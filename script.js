let currentFontSize = 18;
let readingRulerOn = false;

let sentences = [];
let index = 0;
function showInput(type) {
    document.getElementById("urlSection").classList.add("hidden");
    document.getElementById("textSection").classList.add("hidden");
    document.getElementById("imageSection").classList.add("hidden");

    if (type === "url") {
        document.getElementById("urlSection").classList.remove("hidden");
    }

    if (type === "text") {
        document.getElementById("textSection").classList.remove("hidden");
    }

    if (type === "image") {
        document.getElementById("imageSection").classList.remove("hidden");
    }
}

async function processInput() {
    const url = document.getElementById("urlInput").value;
    const text = document.getElementById("textInput").value;
    const image = document.getElementById("imageInput").files[0];

    const loading = document.getElementById("loading");
    const message = document.getElementById("message");

    if (url.trim() === "" && text.trim() === "" && !image) {
        message.innerText = "Please enter a URL, paste text, or upload an image.";
        return;
    }

    loading.innerText = "Processing...";
    message.innerText = "";

    document.getElementById("simpleText").innerHTML = "";
    document.getElementById("text").innerText = "";
    document.getElementById("progressBar").style.width = "0%";

    const formData = new FormData();

    if (url.trim() !== "") {
        formData.append("url", url);
    }

    if (text.trim() !== "") {
        formData.append("text", text);
    }

    if (image) {
        formData.append("image", image);
    }

    try {
        const response = await fetch("http://localhost:3000/process", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        loading.innerText = "";

        if (data.error) {
            message.innerText = "Sorry, the input could not be processed.";
            return;
        }

        document.getElementById("simpleText").innerHTML = data.html;
        document.getElementById("text").innerText = data.text || "";

        sentences = data.sentences || [];
        index = 0;

        updateSentence();

        document.getElementById("progressBar").style.width = "100%";

    } catch (error) {
        loading.innerText = "";
        message.innerText = "Backend is not running. Start server.js first.";
        console.log(error);
    }
}

function toggleSentenceMode() {
    const sentenceBox = document.getElementById("sentenceBox");
    sentenceBox.classList.toggle("active");
    updateSentence();
}

function updateSentence() {
    const sentenceText = document.getElementById("sentenceText");
    const sentenceCounter = document.getElementById("sentenceCounter");

    if (sentences.length === 0) {
        sentenceText.innerText = "Your sentence will appear here...";
        sentenceCounter.innerText = "Sentence 0 of 0";
        return;
    }

    sentenceText.innerText = sentences[index];
    sentenceCounter.innerText = "Sentence " + (index + 1) + " of " + sentences.length;
}

function nextSentence() {
    if (sentences.length === 0) {
        document.getElementById("message").innerText = "Simplify something first.";
        return;
    }

    if (index < sentences.length - 1) {
        index++;
        updateSentence();
    }
}

function prevSentence() {
    if (sentences.length === 0) {
        document.getElementById("message").innerText = "Simplify something first.";
        return;
    }

    if (index > 0) {
        index--;
        updateSentence();
    }
}

function increaseFont() {
    currentFontSize += 2;
    document.body.style.fontSize = currentFontSize + "px";
}

function decreaseFont() {
    if (currentFontSize > 12) {
        currentFontSize -= 2;
        document.body.style.fontSize = currentFontSize + "px";
    }
}

function toggleDark() {
    document.body.classList.toggle("dark");
}

function readText() {
    const text = document.getElementById("simpleText").innerText;

    if (text.trim() === "" || text.includes("Your simplified text will appear here")) {
        document.getElementById("message").innerText = "There is no simplified text to read yet.";
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.8;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}

function stopReading() {
    window.speechSynthesis.cancel();
}

function copySimplifiedText() {
    const text = document.getElementById("simpleText").innerText;

    if (text.trim() === "" || text.includes("Your simplified text will appear here")) {
        document.getElementById("message").innerText = "There is no simplified text to copy yet.";
        return;
    }

    navigator.clipboard.writeText(text);
    document.getElementById("message").innerText = "Simplified text copied!";
}

function toggleFocusMode() {
    document.body.classList.toggle("focus-mode");
}

function toggleSpacing() {
    document.body.classList.toggle("readable-spacing");
}

function toggleCalmMode() {
    document.body.classList.toggle("calm-mode");
}

function toggleReadingRuler() {
    const ruler = document.getElementById("readingRuler");

    readingRulerOn = !readingRulerOn;

    if (readingRulerOn) {
        ruler.style.display = "block";
    } else {
        ruler.style.display = "none";
    }
}

document.addEventListener("mousemove", function(event) {
    const ruler = document.getElementById("readingRuler");

    if (readingRulerOn) {
        ruler.style.top = event.clientY + "px";
    }
});
