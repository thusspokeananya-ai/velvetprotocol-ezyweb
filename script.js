let currentFontSize = 18;
let readingRulerOn = false;

async function processLink() {
    const url = document.getElementById("urlInput").value;
    const loading = document.getElementById("loading");
    const message = document.getElementById("message");

    if (url.trim() === "") {
        message.innerText = "Please paste a URL first.";
        return;
    }

    loading.innerText = "Simplifying...";
    message.innerText = "";

    document.getElementById("simpleText").innerHTML = "";
    document.getElementById("text").innerText = "";
    document.getElementById("progressBar").style.width = "0%";

    try {
        const response = await fetch("http://localhost:3000/process-link", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        loading.innerText = "";

        if (data.error) {
            message.innerText = "Sorry, this website could not be opened. Please try another link.";
            return;
        }

        document.getElementById("simpleText").innerHTML = data.simplified;
        document.getElementById("text").innerText = data.text;

        document.getElementById("progressBar").style.width = "100%";

    } catch (error) {
        loading.innerText = "";
        message.innerText = "Backend is not running. Start server.js first.";
        console.log(error);
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
