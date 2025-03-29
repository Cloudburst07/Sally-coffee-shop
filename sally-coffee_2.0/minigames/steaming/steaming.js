//variables
var sequence = [];
var playerInput = [];
var score = 0;
var maxScore = 5000;
var keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
var timer;
var timeLeft = 30;
var mistakes = 0;
var isSettings = 0;

//begins the game
function startGame() {
    startSound.play();
    document.getElementById("start-button").style.display = "none";
    document.getElementById("dialog-box").style.display = "none";
    dialogs[4].close();
    dialogs[5].show();
    score = 0;
    timeLeft = 30;
    mistakes = 0;
    sequence = [];
    playerInput = [];
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('timer').textContent = 'Time Left: ' + timeLeft + 's';
    generateSequence();
    startTimer();
}

//generate new squence of arrows
function generateSequence() {
    sequence = [];
    document.getElementById('sequence').innerHTML = '';
    for (let i = 0; i < 7; i++) {
        var key = keys[Math.floor(Math.random() * keys.length)];
        sequence.push(key);
        var img = document.createElement('img');
        img.src = "../../images/arrow_images/" + key.toLowerCase() + '.png';
        img.classList.add('arrow');
        document.getElementById('sequence').appendChild(img);
    }
}

//start countdown
function startTimer() {
    clearInterval(timer);
    clockSound.loop = true;
    clockSound.play();
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = 'Time Left: ' + timeLeft + 's';
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

//listen for pressed key
document.addEventListener('keydown', (event) => {
    if (!keys.includes(event.key)) return;
    var currentIndex = playerInput.length;
    var images = document.querySelectorAll('.arrow');
    playerInput.push(event.key);
    
    if (event.key === sequence[currentIndex]) {
        images[currentIndex].style.outline = '0.5vh solid green';
    } else {
        images[currentIndex].style.outline = '0.5vh solid red';
        mistakes++;
    }
    checkInput();
});

//compare player input and correct input and calculate score
function checkInput() {
    if (playerInput.length === sequence.length) {
        var points = 1000 - (mistakes * 200);
        if (points < 0){
            points = 0;
            failSound.load();
            failSound.play();
        } 
        if (points == 1000){
            goodSound.load();
            goodSound.play();
        } else if (points != 0 && points != 1000){
            badSound.load();
            badSound.play();
        }
        score += points;
        document.getElementById('score').textContent = 'Score: ' + score;
        if (score >= maxScore) {
            clearInterval(timer);
            score = 5000;
            document.getElementById('score').textContent = 'Score: ' + score;
            endGame();
        } else {
            playerInput = [];
            mistakes = 0;
            generateSequence();
        }
    }
}


//when player ends game
function endGame(){
    dingSound.play();
    clockSound.pause();
    winSound.play();
    document.getElementById("dialog-box").style.display = "block";
    defineDialog();
    localStorage.setItem("progression", 4);
    localStorage.setItem("steamingScore", score);
}

//put all dialog elements inside an array
var dialogs = Array.from(document.querySelectorAll("dialog"));
var text = Array.from(document.querySelectorAll("p"));
var buttons =  Array.from(document.querySelectorAll("button"));
var titles =  Array.from(document.querySelectorAll("h1"));

//change font size based on settings
window.addEventListener("message", (event) => {
    if (event.data.type === "fontChanged") {
        for (let i = 0; i < text.length; i++) {
            text[i].style.fontSize = localStorage.getItem("fontSize") + "vh";
        }
        for (let i = 0; i < titles.length; i++) {
            titles[i].style.fontSize = localStorage.getItem("fontSize") + "vh";
        }
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.fontSize = localStorage.getItem("fontSize") + "vh";
        }
        for (let i = 0; i < dialogs.length; i++) {
            dialogs[i].style.fontSize = localStorage.getItem("fontSize") + "vh";
        }
    }
});

//open and close settings using the tab key
const settings = document.getElementById("settings-box");

document.addEventListener("keydown", function(e){
    if(e.key == "Escape"){
        document.activeElement.blur();
        e.stopPropagation(); 
        e.preventDefault();
        toggleSettings();
    }
});

//catch the message from the iframe in order to leave focus
window.addEventListener("message", (event) => {
    if (event.data.type === "escapePressed") {
        toggleSettings();
    }
});

function toggleSettings(){
    if(isSettings == 0){
        settings.style.transform = "translate(-50%, -50%)";
        document.getElementById("dialog-box").style.display = "none";
        isSettings = 1;
    } else if(isSettings == 1){
        settings.style.transform = "translate(-50%, -150%)";
        document.getElementById("dialog-box").style.display = "initial";
        isSettings = 0;
    }
}

//apply the previous determined settings to the current webpage
function applySettings(){
    for (let i = 0; i < text.length; i++) {
        text[i].style.fontSize = localStorage.getItem("fontSize") + "vh";
    }
    for (let i = 0; i < titles.length; i++) {
        titles[i].style.fontSize = localStorage.getItem("fontSize") + "vh";
    }
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.fontSize = localStorage.getItem("fontSize") + "vh";
    }
    for (let i = 0; i < dialogs.length; i++) {
        dialogs[i].style.fontSize = localStorage.getItem("fontSize") + "vh";
    }
}

//define content of dialog depending on score
function defineDialog(){
    dialogs[0].innerHTML = "To properly steam milk, you need to match the instructions given to you, and press the correct keys in the right order.";
    dialogs[1].innerHTML = "You will know if you succeeded when a green (correct) or red (incorrect) border appears around the key that you matched. Don't worry if you mess up a bit, just continue.";
    dialogs[2].innerHTML = "The steam wand doesn't wait for anyone, so try to be as precise and as quick as possible, since perfectly steamed milk requires both speed and precision.";
    dialogs[3].innerHTML = "You need to complete this task within 30 seconds, or the milk will overheat!";
    dialogs[4].innerHTML = "Try to get as high of a score as you can. Click on the button to begin when you're ready.";
    dialogs[5].innerHTML = "You did it, " + localStorage.getItem("playerName") + "!";
    if(score <= 2000){
        dialogs[6].innerHTML = "Seems like you got " + score + " points. It's not very high, but there's a first for everything, so don't worry too much!";
    } else if(score <= 4999){
        dialogs[6].innerHTML = "You ended up getting " + score + " points. It's really high! You definitely have a knack for this. Good job!";
    } else if(score == 5000){
        dialogs[6].innerHTML = "That was perfect! You're truly amazing. Hehe, who'd even believe that you're new at this? Congrats, my new employee!"
    }
    dialogs[7].innerHTML = "Now let's finally assemble our coffee!";
}

//starts the first dialog
function beginDialog(){
    defineDialog()
    dialogs[0].show();
}

//cycle through dialogs using the spacebar
window.addEventListener("keydown", function(e){
    if(e.key === " "){
        for (let i = 0; i < dialogs.length; i++) {
            if (dialogs[i].open) {
              dialogs[i].close(); 
              dialogSound.load();
              dialogSound.play();
    
              if (i + 1 < dialogs.length) {
                dialogs[i + 1].show();
              }
              break;
            }
        }
        if(dialogs[1].open){
            bgm();
        }
        if(dialogs[4].open){
            document.getElementById("start-button").style.display = "initial";
        }
        if(dialogs[5].open){
            document.getElementById("dialog-box").style.display = "none";
        }
        if(dialogs[8].open){
            window.location.href = "../../game.html";
        }
    }
});

//music and other sounds
var backgroundMusic = new Audio("../../sounds/bg_music_2.mp3");
var dialogSound = new Audio("../../sounds/dialog.mp3");
var startSound = new Audio("../../sounds/confirm.mp3");
var clockSound = new Audio("../../sounds/clock.mp3");
var dingSound = new Audio("../../sounds/ding.mp3");
var winSound = new Audio("../../sounds/correct.mp3");
var popSound = new Audio("../../sounds/pop.mp3");
var goodSound = new Audio("../../sounds/good.mp3");
var failSound = new Audio("../../sounds/error.mp3");
var badSound = new Audio("../../sounds/select.mp3");

function bgm(){
    backgroundMusic.loop = true;
    backgroundMusic.load();
    backgroundMusic.volume = localStorage.getItem("musicVolume");
    backgroundMusic.play();
}

//to catch volume change
window.addEventListener("message", (event) => {
    if (event.data.type === "volumeChanged") {
        backgroundMusic.volume = localStorage.getItem("musicVolume");
    }
});

//starting functions
defineDialog();
beginDialog();
applySettings();