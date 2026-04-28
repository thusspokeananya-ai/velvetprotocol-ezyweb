let size = 16;

function increaseFont() {
    size += 2;
    document.getElementById("text").style.fontSize = size + "px";
}

function decreaseFont() {
    size -= 2;
    document.getElementById("text").style.fontSize = size + "px";
}

function toggleDark() {
    document.body.classList.toggle("dark");
}

function readText() {
    let text = document.getElementById("text").innerText;

    let speech = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(speech);
}

function simplifyText() {
    document.getElementById("simpleText").innerText =
    "Government websites are often difficult. EasyWeb makes them simpler to understand.";
}
