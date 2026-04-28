const express = require("express");
<<<<<<< HEAD
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Extract readable text
function extractText(html) {
    const $ = cheerio.load(html);

    $("script, style, nav, footer, header, aside").remove();

    let text = "";

    $("p").each((i, el) => {
        const t = $(el).text().trim();
        if (t.length > 50) { // ignore tiny useless lines
            text += t + "\n\n";
        }
    });
=======
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
>>>>>>> c7f74c2797640e4f3c9f13f7cb32b446b082ff14

    return text;
}

<<<<<<< HEAD
// Simple (but working) simplifier
function simplifyText(text) {
    return text
        .replace(/however/gi, "but")
        .replace(/therefore/gi, "so")
        .replace(/in order to/gi, "to")
        .replace(/individuals/gi, "people")
        .replace(/numerous/gi, "many");
}

app.post("/process", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "No URL provided" });
    }

    try {
        const response = await axios.get(url);

        const raw = extractText(response.data);
        const simplified = simplifyText(raw);

        res.json({
            original: raw.slice(0, 4000),
            simplified: simplified.slice(0, 4000)
        });

    } catch (err) {
        res.status(500).json({
            error: "Could not fetch this site. Try another URL."
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
=======
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
>>>>>>> c7f74c2797640e4f3c9f13f7cb32b446b082ff14
});
