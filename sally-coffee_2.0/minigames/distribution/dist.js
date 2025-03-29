//variables 
var clumpCount = 0;
var score = 0;
const maxClumps = 15;
const gameArea = document.getElementById("game-area");
const statusText = document.getElementById("status");
const timerText = document.getElementById("timer");
var timeLeft = 20;
var gameInterval;

//spawn clumps once the game begins
function spawnClump() {
    if (clumpCount >= maxClumps) return;

    const clump = document.createElement("div");
    clump.classList.add("clump");
    clump.style.left = Math.random() * (gameArea.offsetWidth - 30) + "px";
    clump.style.top = Math.random() * (gameArea.offsetHeight - 30) + "px";
    
//click to remove the clump
    clump.addEventListener("click", () => {
        clump.remove();
        popSound.load();
        popSound.play();
        clumpCount++;
        score = clumpCount * 500
        statusText.textContent = `Score: ${score}`;
        if (score >= 5000) {
            score = 5000;
            winGame();
        }
    });
    
    gameArea.appendChild(clump);
//clumps disappear with time
    setTimeout(() => {
        if (document.body.contains(clump)) {
            clump.remove();
        }
    }, 1500); 
}

//start the game
function startGame() {
    startSound.play();
    clockSound.loop = true;
    clockSound.play();
    clumpCount = 0;
    document.getElementById("start-button").style.display = "none";
    document.getElementById("dialog-box").style.display = "none";
    dialogs[4].close();
    dialogs[5].show();
    statusText.textContent = `Score: ${score}`;
    timerText.textContent = `Time left: ${timeLeft}s`;
    gameArea.style.width = "80vw"; 
    gameArea.style.height = "50vh";
    gameInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerText.textContent = `Time left: ${timeLeft}s`;
            spawnClump();
        } else {
            clearInterval(gameInterval);
            winGame();
        }
    }, 800); 
}

//when player ends game
function winGame() {
    clockSound.pause();
    winSound.play();
    dingSound.play();
    clearInterval(gameInterval);
    document.getElementById("dialog-box").style.display = "block";
    defineDialog();
    localStorage.setItem("progression", 2);
    localStorage.setItem("distScore", score);
}

//begins the game
document.getElementById("start-button").addEventListener("click", startGame);

//put all dialog elements inside an array
var dialogs = Array.from(document.querySelectorAll("dialog"));
var text = Array.from(document.querySelectorAll("p"));
var buttons =  Array.from(document.querySelectorAll("button"));
var titles =  Array.from(document.querySelectorAll("h1"));
var isSettings = 0;

//change content of dialog based on score
function defineDialog(){
    dialogs[0].innerHTML = "In order to distribute the ground coffee as evenly as possible, you will need to remove the clumps that appear.";
    dialogs[1].innerHTML = "To do that, you will have to click on them before they disappear.";
    dialogs[2].innerHTML = "The clumps will appear randomly within that beige coloured zone.";
    dialogs[3].innerHTML = "You have to complete this task in 20 seconds or less. If you manage to remove all the clumps perfectly before time runs out, then I'll be very impressed!";
    dialogs[4].innerHTML = "You can click the button to start anytime. Goodluck!";
    dialogs[5].innerHTML = "You did it, " + localStorage.getItem("playerName") + "!";
    if(score <= 2000){
        dialogs[6].innerHTML = "Seems like you got " + score + " points. It's not very high, but there's a first for everything, so don't worry too much!";
    } else if(score <= 4999){
        dialogs[6].innerHTML = "You ended up getting " + score + " points. It's really high! You definitely have a knack for this. Good job!";
    } else if(score == 5000){
        dialogs[6].innerHTML = "That was perfect! You're truly amazing. Hehe, who'd even believe that you're new at this? Congrats, my new employee!"
    }
    dialogs[7].innerHTML = "Now lets move on to the next step of making an espresso.";
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
})

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
const settings = document.getElementById("settings-box")
document.addEventListener("keydown", function(e){
    if(e.key == "Escape"){
        document.activeElement.blur();
        e.stopPropagation(); 
        e.preventDefault();
        toggleSettings();
    }
})

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

//music and other audio
var backgroundMusic = new Audio("../../sounds/bg_music_2.mp3");
var dialogSound = new Audio("../../sounds/dialog.mp3");
var startSound = new Audio("../../sounds/confirm.mp3");
var clockSound = new Audio("../../sounds/clock.mp3");
var dingSound = new Audio("../../sounds/ding.mp3");
var winSound = new Audio("../../sounds/correct.mp3");
var popSound = new Audio("../../sounds/pop.mp3");

function bgm(){
    backgroundMusic.loop = true;
    backgroundMusic.load();
    backgroundMusic.volume = localStorage.getItem("musicVolume");
    backgroundMusic.play();
}

//catch when volume changes
window.addEventListener("message", (event) => {
    if (event.data.type === "volumeChanged") {
        backgroundMusic.volume = localStorage.getItem("musicVolume");
    }
});

//starting functions
defineDialog();
beginDialog();
applySettings();