function increaseFont() {
    let body = document.body;
    let currentSize = window.getComputedStyle(body).fontSize;
    body.style.fontSize = (parseFloat(currentSize) + 2) + "px";
}

function decreaseFont() {
    let body = document.body;
    let currentSize = window.getComputedStyle(body).fontSize;
    body.style.fontSize = (parseFloat(currentSize) - 2) + "px";
}

function toggleDark() {
    document.body.classList.toggle("dark");
}

function readText() {
    const text = document.getElementById("text").innerText;
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
}

// ===============================
// PROCESS LINK
// ===============================
async function processLink() {

    const url = document.getElementById("urlInput").value;

    if (!url) {
        alert("Enter a URL");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/process-link", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        // SHOW ORIGINAL TEXT
        document.getElementById("text").innerText = data.text;

        // SHOW BULLETS (IMPORTANT: innerHTML)
        document.getElementById("simpleText").innerHTML = data.simplified;

    } catch (error) {
        alert("Error");
        console.error(error);
    }
}
