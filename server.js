const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend is working!");
});


// ==============================
// PROCESS LINK
// ==============================
app.post("/process-link", async (req, res) => {

    const { url } = req.body;

    console.log("Received URL:", url);  // DEBUG

    try {
        const response = await axios.get(url, {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
});

        const html = response.data;

        const $ = cheerio.load(html);

        let text = "";

        $("p").each((i, el) => {
            text += $(el).text() + " ";
        });

        console.log("Extracted text length:", text.length); // DEBUG

       // SIMPLE SIMPLIFICATION LOGIC
function simplify(text) {

    const replacements = {
        "utilize": "use",
        "approximately": "about",
        "assistance": "help",
        "individuals": "people",
        "numerous": "many",
        "commence": "start",
        "terminate": "end"
    };

    for (let word in replacements) {
        const regex = new RegExp(word, "gi");
        text = text.replace(regex, replacements[word]);
    }

    // Break long sentences
    text = text
        .split(".")
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .join(". ");

    return text;
}

// AFTER extracting text
const simplifiedText = simplify(text);

// Send BOTH original + simplified
res.json({
    text: text,
    simplified: simplifiedText
});


    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Error fetching website" });
    }
});


// ==============================
// SIMPLIFY TEXT
// ==============================
app.post("/simplify", (req, res) => {

    let { text } = req.body;

    console.log("Simplifying text..."); // DEBUG

    const replacements = {
        "utilize": "use",
        "approximately": "about",
        "assistance": "help",
        "individuals": "people",
        "numerous": "many"
    };

    for (let word in replacements) {
        const regex = new RegExp(word, "gi");
        text = text.replace(regex, replacements[word]);
    }

    res.json({ simplified: text });
});


// START SERVER
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
