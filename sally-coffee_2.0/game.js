//put all dialog elements inside an array
var dialogs = Array.from(document.querySelectorAll("dialog"));

//define the content of the dialogs depending on progression of the player
function defineDialog(){
    dialogs[8].innerHTML = "You've already completed that, " + localStorage.getItem("playerName") + "!";
    dialogs[9].innerHTML = localStorage.getItem("playerName") + ", you have to take things one step at a time. We need to complete the previous steps first!";
    if(localStorage.getItem("progression") == 0){
        dialogs[0].innerHTML = "Welcome to the counter, " + localStorage.getItem("playerName") + "! This is where all the delicious coffee is made.";
        dialogs[1].innerHTML = "Do you see those four squares? They are the tasks that you'll have to complete in order to make a cup of coffee."
        dialogs[2].innerHTML = "You'll have to do them in order, starting with grinding the coffee beans. (The leftmost square)"
        dialogs[3].innerHTML = "Depending on how well you do in each of these tasks, your final coffee will also be affected! So try to complete them as perfectly as possible."
        dialogs[4].innerHTML = "The perfect score is 5000 points. You can begin whenever you're ready."
        dialogs[5].innerHTML = "Just click on the square to begin the task. Best of luck, " + localStorage.getItem("playerName") +"!"
    } else if(localStorage.getItem("progression") == 1){
        dialogs[0].innerHTML = "The next task will be to distribute the ground coffee evenly.";
        dialogs[1].innerHTML = "It is one of the most important steps when making a proper espresso.";
        dialogs[2].innerHTML = "The more evenly and perfectly you distribute the ground coffee, the better the extraction.";
        dialogs[3].innerHTML = "For the best final result, you must not take this step lightly, " + localStorage.getItem("playerName") + ".";
        dialogs[4].innerHTML = "I believe that you'll do great, so do not stress about this!";
        dialogs[5].innerHTML = "When you're ready, just click on the second square to begin.";

    } else if(localStorage.getItem("progression") == 2){
        dialogs[0].innerHTML = "Next, its time to extract the espresso.";
        dialogs[1].innerHTML = "In order to obtain a good extraction, we need to take into account many factors.";
        dialogs[2].innerHTML = "The temperature, the pressure, the time...";
        dialogs[3].innerHTML = "You probably feel quite overwhelmed right now, " + localStorage.getItem("playerName") + ", but as always, I will be there to guide you through everything.";
        dialogs[4].innerHTML = "We're already halfway through this process, hang in there!";
        dialogs[5].innerHTML = "When you're ready, you can click on the third square to begin.";

    } else if(localStorage.getItem("progression") == 3){
        dialogs[0].innerHTML = "Now that our espresso is done, we can steam the milk.";
        dialogs[1].innerHTML = "The steamed milk will add texture and sweetness to the coffee, so it's quite important!";
        dialogs[2].innerHTML = "Of course, you can always drink espresso directly... but it's very bitter so I recommend against it.";
        dialogs[3].innerHTML = "A good steamed milk has a delicate balance between the foam and the liquid. It's a task which requires utmost care and precision.";
        dialogs[4].innerHTML = "This will be more difficult that all of your previous hurdles, but I believe that you're more than ready for this, " + localStorage.getItem("playerName") + "!";
        dialogs[5].innerHTML = "You can begin anytime by clicking on the last square. Goodluck!";

    } else if(localStorage.getItem("progression") == 4){
        dialogs[0].innerHTML = "We're done!";
        dialogs[1].innerHTML = "Now, all that's left is to pour the milk into our espresso.";
        dialogs[2].innerHTML = "Finally, we'll be able to savour the fruits of your labour!";
        dialogs[3].innerHTML = "Are you excited, " + localStorage.getItem("playerName") + "? Because I surely am~";
        dialogs[4].innerHTML = "It's only fitting to do a small countdown. Afterall, it is your first ever completed coffee! Ready?";
        dialogs[5].innerHTML = "3, 2, 1...";
    }
}

//starts the first dialog
function beginDialog(){
    defineDialog()
    dialogs[0].show();
}

//cycle through dialogs using the spacebar
window.addEventListener("keydown", function(e){
    if(e.key === " "){
        if(dialogs[8].open || dialogs[9].open){
            dialogs[8].close();
            dialogs[9].close();
            dialogSound.load();
            dialogSound.play();
            return;
        }
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
        if(localStorage.getItem("progression") == 0 && dialogs[6].open){
            document.getElementById("dialog-box").style.display = "none";
        } else if(localStorage.getItem("progression") == 1 && dialogs[6].open){
            document.getElementById("dialog-box").style.display = "none";
        } else if(localStorage.getItem("progression") == 2 && dialogs[6].open){
            document.getElementById("dialog-box").style.display = "none";
        } else if(localStorage.getItem("progression") == 3 && dialogs[6].open){
            document.getElementById("dialog-box").style.display = "none";
        } else if(localStorage.getItem("progression") == 4 && dialogs[6].open){
            document.getElementById("dialog-box").style.display = "none";
            end();
        }
    }
})

//for font size
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

//redirect to the minigames
//different conditions for when player clicks on step 1
function grind(){
    if(localStorage.getItem("progression") == 0){
        window.location.href = './minigames/grind/grind.html';
    } else if(localStorage.getItem("progression") >= 1){
        dialogs[8].show();
    } 
}

//different conditions for when player clicks on step 2
function distribute(){
    if(localStorage.getItem("progression") <= 0){
        dialogs[9].show();
    } else if(localStorage.getItem("progression") == 1){
        window.location.href = './minigames/distribution/dist.html';
    } else if(localStorage.getItem("progression") >= 2){
        dialogs[8].show();
    }
}

//different conditions for when player clicks on step 3
function extract(){
    if(localStorage.getItem("progression") <= 1){
        dialogs[9].show();
    } else if(localStorage.getItem("progression") == 2){
        window.location.href = './minigames/extraction/extract.html';
    } else if(localStorage.getItem("progression") >= 3){
        dialogs[8].show();
    }
}

//different conditions for when player clicks on step 4
function steam(){
    if(localStorage.getItem("progression") <= 2){
        dialogs[9].show();
    } else if(localStorage.getItem("progression") == 3){
        window.location.href = './minigames/steaming/steaming.html';
    } else if(localStorage.getItem("progression") >= 4){
        dialogs[8].show();
    }
}

//music and other audio
var backgroundMusic = new Audio("./sounds/bg_music_1.mp3");
var dialogSound = new Audio("./sounds/dialog.mp3");

function bgm(){
    backgroundMusic.loop = true;
    backgroundMusic.load();
    backgroundMusic.volume = localStorage.getItem("musicVolume");
    backgroundMusic.play();
}

//catch when volume changes via settings
window.addEventListener("message", (event) => {
    if (event.data.type === "volumeChanged") {
        backgroundMusic.volume = localStorage.getItem("musicVolume");
    }
});

//what happens at the very end
function end(){
//combining for final score
    var finalScore = parseInt(localStorage.getItem("grindScore"), 10) + 
                    parseInt(localStorage.getItem("distScore"), 10) + 
                    parseInt(localStorage.getItem("extractScore"), 10) + 
                    parseInt(localStorage.getItem("steamingScore"), 10);

    dialogSound.volume = 0;
    document.getElementById("end-screen").style.display = "block";
    document.getElementById("end-text").innerHTML = "Your coffee's final score is " + finalScore + " points out of 20000 points. Thanks for playing!"
//fade out effect
    for (let i = 0; i < localStorage.getItem("musicVolume") * 100; i++) {
        backgroundMusic.volume = (localStorage.getItem("musicVolume") * 100 - i + 1) / 100;
    }
}

beginDialog();
applySettings();