var playerName
//obtain and save the username of the player
function getName(){
    var nameInput = document.getElementById("name-input");
    var deniedCd = false
    if(nameInput.value == "" && deniedCd == false){
        deniedCd = true;
        nameInput.style.borderBottom = "solid rgb(200, 0, 0) 0.5vh";
        setTimeout(() => {
            nameInput.style.borderBottom = "solid white 0.5vh";
            deniedCd = false;
        }, 1500);
    } else {
        playerName = nameInput.value
        localStorage.setItem("playerName", playerName);
        document.getElementById("start-screen").style.display = "none";
        defineDialog();
        beginDialog();
        bgm();
    }
}
//music and other audio
var backgroundMusic = new Audio("../sounds/bg_music_1.mp3");
var dialogSound = new Audio("../sounds/dialog.mp3");

function bgm(){
    backgroundMusic.loop = true;
    backgroundMusic.load();
    backgroundMusic.volume = 0.5;
    backgroundMusic.play();
}

window.addEventListener("message", (event) => {
    if (event.data.type === "volumeChanged") {
        backgroundMusic.volume = localStorage.getItem("musicVolume");
    }
});

//put all dialog elements inside an array
var dialogs = Array.from(document.querySelectorAll("dialog"));
var text = Array.from(document.querySelectorAll("p"));
var buttons =  Array.from(document.querySelectorAll("button"));
var titles =  Array.from(document.querySelectorAll("h1"));

//define the content of the dialogs
function defineDialog(){
    dialogs[0].innerHTML = "Hi there " + localStorage.getItem("playerName") + "! Starting today, I will be your superior, Sally, and welcome to my coffee shop. You can use Space to continue.";
    dialogs[1].innerHTML = "You will have the task of handling the customers, as well as their many orders."
    dialogs[2].innerHTML = "Don't worry too much, since I will be here to guide you through the entire process."
    dialogs[3].innerHTML = "I'm sure that you will do great! Before we begin, do you have any questions? (Use the escape key to see the settings menu at any time)"
    dialogs[4].innerHTML = "Well then, shall we start this? Get ready!"
}

//starts the first dialog
function beginDialog(){
    dialogs[0].show();
    localStorage.setItem("progression", 0)
}

var isSettings = 0;

//open and close settings using the escape key
const settings = document.getElementById("settings-box")
document.addEventListener("keydown", function(e){
    if(e.key == "Escape"){
        document.activeElement.blur();
        e.stopPropagation(); 
        e.preventDefault();
        toggleSettings();
    }
})

//catch the message from the iframe in order to leave focus and change font size based on settings
window.addEventListener("message", (event) => {
    if (event.data.type === "escapePressed") {
        toggleSettings();
    }
    if (event.data.type === "fontChanged") {
        for (let i = 0; i < dialogs.length; i++) {
            dialogs[i].style.fontSize = localStorage.getItem("fontSize")  + "vh";
        }
        for (let i = 0; i < text.length; i++) {
            text[i].style.fontSize = localStorage.getItem("fontSize") + "vh";
        }
        for (let i = 0; i < titles.length; i++) {
            titles[i].style.fontSize = localStorage.getItem("fontSize") + "vh";
        }
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.fontSize = localStorage.getItem("fontSize") + "vh";
        }
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
        if(dialogs[5].open){
            this.window.location.href = "../game.html";
        }
    }
})

//allow the use of the enter key to submit the player's username
document.getElementById("name-input").addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        getName();
    }
});

//apply the settings selected by the user
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

applySettings();