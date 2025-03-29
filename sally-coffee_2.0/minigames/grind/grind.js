//update the entire game
function update(){
    updateGame();
    requestAnimationFrame(update);
}

//variables (sound variables are elsewhere)
var isGame = true;
var angle = 0;
var angleVelocity = 0;
const friction = 0.98;
var playerControl = 0;
var indicatorPosition;
var indicatorVelocity = 0;
var isBalance;
var score = 0;
var time;
const maxAngle = 10;

const grinder = document.getElementById("grinder");
const indicator = document.getElementById("indicator");
const statusText = document.getElementById("status");
const scoreText = document.getElementById("score");
const perfectZone = document.getElementById("perfect-zone");
const timerText = document.getElementById("timer");

var grinderWidth, perfectZoneWidth, indicatorRadius, gravityStrength;

//change game size depending on screen size
function resizeGame() {
    grinderWidth = window.innerWidth * 0.6;
    gravityStrength = grinderWidth / 1500
    perfectZoneWidth = grinderWidth * 0.25;
    grinder.style.width = grinderWidth + "px";
    grinder.style.height = grinderWidth / 18 + "px";
    perfectZone.style.width = perfectZoneWidth + "px";
    perfectZone.style.left = "50%";
    perfectZone.style.transform = "translate(-50%, 80%)";
    perfectZone.style.height = grinder.offsetHeight / 2.5 + "px";
    indicator.style.transform = "translate(0%, 15%)";
    indicator.style.height = perfectZone.offsetHeight * 2 + "px";
    indicator.style.width = perfectZone.offsetHeight * 2 + "px";
    indicatorRadius = indicator.offsetWidth;
    setRandomStartingPosition();
}

window.addEventListener("resize", resizeGame);

//arrow keys
document.addEventListener("keydown", (event) => {
    if(isGame == false){
        return;
    }
    if (event.key === "ArrowLeft") {
        playerControl = -0.5;
    } else if (event.key === "ArrowRight") {
        playerControl = 0.5;
    }
})

//reset player key press
document.addEventListener("keyup", () => {
    playerControl = 0;
})

//indicator starts randomly on the left or right side of the bar
function setRandomStartingPosition() {
    indicatorPosition = Math.random() > 0.5 ? 0 : grinderWidth - indicatorRadius;
    indicator.style.left = `${indicatorPosition}px`;
}

//starting function
function init(){
    startSound.load();
    startSound.play();
    resizeGame();
    barScore();
    timer();
    update();
    document.getElementById("start-button").style.display = "none";
    document.getElementById("dialog-box").style.display = "none";
    dialogs[4].close();
    dialogs[5].show();
}

//countdown timer
function timer(){
    time = 20;
    timerText.innerHTML = "Time left: " + time + " seconds";
    setInterval(() => {
        if(isGame == false){
            return;
        }
        time -= 1;
        clockSound.loop = true;
        clockSound.play();
        timerText.innerHTML = "Time left: " + time + " seconds";
    }, 1000);
}

//update the score based on indicator position
function barScore(){
    scoreText.innerHTML = "Score: " + score + " points";
    setInterval(() => {
        if(isBalance) {
            if(isGame == false){
                return;
            }
            score += 250;
            scoreText.innerHTML = "Score: " + score + " points";
            checkWin();
        } 
    }, 500);
}

function updateGame() {
    if(isGame == false){
        return;
    }
//player control the bar's tilt with arrow keys
    angleVelocity += playerControl;
    angleVelocity *= friction;
    angle += angleVelocity;
    if (angle > maxAngle) angle = maxAngle;
    if (angle < -maxAngle) angle = -maxAngle;
    grinder.style.transform = `rotate(${angle}deg)`;

//simulating gravity for a more realistic feeling
    var gravityEffect = Math.sin(angle * (Math.PI / 180)) * gravityStrength;
    indicatorVelocity += gravityEffect;
    indicatorVelocity *= 0.98;
    indicatorPosition += indicatorVelocity;

//stopping the indicator from going out of the bar
    if (indicatorPosition < 0) {
        indicatorPosition = 0;
        indicatorVelocity = 0;
    }
    if (indicatorPosition > grinderWidth - indicatorRadius) {
        indicatorPosition = grinderWidth - indicatorRadius;
        indicatorVelocity = 0;
    }
    indicator.style.left = `${indicatorPosition}px`;

//defining and checking the perfect zone
    var perfectZoneStart = (grinderWidth - perfectZoneWidth) / 2;
    var perfectZoneEnd = perfectZoneStart + perfectZoneWidth;
    if (indicatorPosition >= perfectZoneStart && indicatorPosition <= perfectZoneEnd) {
        statusText.textContent = "Perfect grind!";
        statusText.style.color = "green";
        isBalance = true;
    } else {
        statusText.textContent = "Uneven grind!";
        statusText.style.color = "black";
        isBalance = false;
    }
}

//verify if any win condition is met
function checkWin(){
    if(time <= 0){
        time = 0;
        timerText.innerHTML = "Time left: " + time + " seconds";
        win();
    } else if(score >= 5000){
        score = 5000;
        scoreText.innerHTML = "Score: " + score + " points";
        win()
    }
}

//when the game ends
function win(){
    clockSound.pause();
    winSound.load();
    winSound.play();
    dingSound.load();
    dingSound.play();
    isGame = false;
    localStorage.setItem("grindScore", score);
    defineDialog();
    document.getElementById("dialog-box").style.display = "block";
    localStorage.setItem("progression", 1);
}

//to change font size
var text = Array.from(document.querySelectorAll("p"));
var buttons =  Array.from(document.querySelectorAll("button"));
var titles =  Array.from(document.querySelectorAll("h1"));
var isSettings = 0;

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

//open or close settings
function toggleSettings(){
    if(isSettings == 0){
        settings.style.transform = "translate(-50%, -50%)";
        // document.getElementById("dialog-box").style.display = "none";
        isSettings = 1;
    } else if(isSettings == 1){
        settings.style.transform = "translate(-50%, -150%)";
        // document.getElementById("dialog-box").style.display = "initial";
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

//put all dialog elements inside an array
var dialogs = Array.from(document.querySelectorAll("dialog"));

//define the content of the dialogs
function defineDialog(){
    dialogs[0].innerHTML = "The first step to making a proper espresso is to grind the coffee beans into powder.";
    dialogs[1].innerHTML = "To do that properly, you'll have to make sure that the grind is even by keeping the coffee bean inside the green zone.";
    dialogs[2].innerHTML = "Try to hold it at the middle for the required time (20 seconds), or the grinder will stop by itself if you complete the task before time runs out.";
    dialogs[3].innerHTML = "You can tilt the grinding bar to move that coffee bean by using the left and right arrow keys.";
    dialogs[4].innerHTML = "Seems simple, right? Just click that button to begin. I'll be watching you.";
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

//music and other audio
var backgroundMusic = new Audio("../../sounds/bg_music_2.mp3");
var dialogSound = new Audio("../../sounds/dialog.mp3");
var startSound = new Audio("../../sounds/confirm.mp3");
var clockSound = new Audio("../../sounds/clock.mp3");
var dingSound = new Audio("../../sounds/ding.mp3");
var winSound = new Audio("../../sounds/correct.mp3");

function bgm(){
    backgroundMusic.loop = true;
    backgroundMusic.load();
    backgroundMusic.volume = localStorage.getItem("musicVolume");
    backgroundMusic.play();
}

window.addEventListener("message", (event) => {
    if (event.data.type === "volumeChanged") {
        backgroundMusic.volume = localStorage.getItem("musicVolume");
    }
});

beginDialog();
resizeGame();
applySettings();

