// ===============================
// 1. INCREASE FONT SIZE
// ===============================
function increaseFont() {
    let body = document.body;
    let currentSize = window.getComputedStyle(body).fontSize;
    let newSize = parseFloat(currentSize) + 2;
    body.style.fontSize = newSize + "px";
}


// ===============================
// 2. DECREASE FONT SIZE
// ===============================
function decreaseFont() {
    let body = document.body;
    let currentSize = window.getComputedStyle(body).fontSize;
    let newSize = parseFloat(currentSize) - 2;
    body.style.fontSize = newSize + "px";
}


// ===============================
// 3. DARK MODE
// ===============================
function toggleDark() {
    document.body.classList.toggle("dark");
}


// ===============================
// 4. READ ALOUD (TEXT TO SPEECH)
// ===============================
function readText() {
    const text = document.getElementById("text").innerText;

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;  // slower for elderly users
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


// ===============================
// 5. PROCESS LINK (CONNECT TO BACKEND)
// ===============================
async function processLink() {

    const url = document.getElementById("urlInput").value;

    if (!url) {
        alert("Please enter a URL");
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

        document.getElementById("text").innerText = data.text;
document.getElementById("simpleText").innerText = data.simplified;


    } catch (error) {
        alert("Error fetching website");
        console.error(error);
    }
}
