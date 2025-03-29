//variables
let isPlaying = false;
let outerRingSize = 200;
let innerRingSize = 140; 
let shrinkRate = 2;
let targetZoneStart = 60; 
let targetZoneEnd = 80;    
let score = 0;
let timeLeft = 30; 
const gameArea = document.getElementById("game-area");
const statusText = document.getElementById("status");
const timerText = document.getElementById("timer");
const scoreText = document.getElementById("score");
let gameInterval;
let timerInterval;

//begins the game
function startGame() {
    clockSound.loop = true;
    clockSound.play();
    startSound.play();
    if (isPlaying) return;
    document.getElementById("start-button").style.display = "none";
    document.getElementById("dialog-box").style.display = "none";
    dialogs[4].close();
    dialogs[5].show();
    isPlaying = true;
    outerRingSize = 200;
    score = 0;
    timeLeft = 30;
    updateScore();
    updateTimer();
    gameInterval = setInterval(updateGame, 50);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            checkWin();
        }
    }, 1000);
}

//update the game
function updateGame() {
    outerRingSize -= shrinkRate;
    if (outerRingSize <= 40) {
        outerRingSize = 200; // Reset ring if too small
    }
    drawRing();
}

function drawRing() {
    gameArea.innerHTML = "";

// Draw the outer ring
    const outerRing = document.createElement("div");
    outerRing.classList.add("ring");
    outerRing.style.width = outerRingSize + "px";
    outerRing.style.height = outerRingSize + "px";
    outerRing.style.borderWidth = (outerRingSize - innerRingSize) / 2 + "px";
    
// Check if the outer ring is in the perfect zone and apply glow
    if (outerRingSize >= targetZoneStart + 20 && outerRingSize <= targetZoneEnd + 20) {
        outerRing.classList.add("highlight");
    }

    gameArea.appendChild(outerRing);

// Draw the perfect zone (target zone)
    const perfectZone = document.createElement("div");
    perfectZone.classList.add("perfect-zone");
    perfectZone.style.width = targetZoneEnd + "px";
    perfectZone.style.height = targetZoneEnd + "px";
    perfectZone.style.borderWidth = (targetZoneEnd - targetZoneStart) / 2 + "px";
    gameArea.appendChild(perfectZone);
}

document.addEventListener("click", () => {
    if (!isPlaying) return;

// Check if the click is within the perfect zone
    if (outerRingSize >= targetZoneStart + 20 && outerRingSize <= targetZoneEnd + 20) {
        score += 500; 
        goodSound.play();
    } else if(outerRingSize >= targetZoneStart - 20 && outerRingSize <= targetZoneEnd + 40){
        score += 50; 
        badSound.play();
    } else if(outerRingSize >= targetZoneStart - 30 && outerRingSize <= targetZoneEnd + 110){
        failSound.load();
        failSound.play();
    }

    updateScore();

    if (score >= 5000) {
        score = 5000;
        endGame();
    }

    outerRingSize = 200; // Reset the ring after each click
});

//update score text
function updateScore() {
    scoreText.textContent = "Score: " + score;
}

//update timer text
function updateTimer() {
    timerText.textContent = "Time left: " + timeLeft + "s";
}

function checkWin() {
    endGame();
}

//when games ends
function endGame() {
    dingSound.play();
    winSound.play();
    clockSound.pause();
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    isPlaying = false;
    document.getElementById("dialog-box").style.display = "block";
    defineDialog();
    localStorage.setItem("progression", 3);
    localStorage.setItem("extractScore", score);
}

//maybe shouldve used onclick instead T^T
document.getElementById("start-button").addEventListener("click", startGame);


//put all dialog elements inside an array
var dialogs = Array.from(document.querySelectorAll("dialog"));
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

//define dialog depending on player score
function defineDialog(){
    dialogs[0].innerHTML = "To get the best extraction for an espresso, you need to be very precise.";
    dialogs[1].innerHTML = "Every few seconds, there will be a shrinking ring. You have to click when that ring turns green.";
    dialogs[2].innerHTML = "Make sure to not mess up your timing, since precision is what's most important.";
    dialogs[3].innerHTML = "You will have to finish extracting the espresso within 30 seconds. Best of luck!";
    dialogs[4].innerHTML = "You can press the button to begin anytime.";
    dialogs[5].innerHTML = "You did it, " + localStorage.getItem("playerName") + "!";
    if(score <= 2000){
        dialogs[6].innerHTML = "Seems like you got " + score + " points. It's not very high, but there's a first for everything, so don't worry too much!";
    } else if(score <= 4999){
        dialogs[6].innerHTML = "You ended up getting " + score + " points. It's really high! You definitely have a knack for this. Good job!";
    } else if(score == 5000){
        dialogs[6].innerHTML = "That was perfect! You're truly amazing. Hehe, who'd even believe that you're new at this? Congrats, my new employee!"
    }
    dialogs[7].innerHTML = "Now lets move on to the last step of making a proper coffee.";
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