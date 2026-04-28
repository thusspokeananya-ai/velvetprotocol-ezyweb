const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// ==============================
// SIMPLIFY FUNCTION
// ==============================
function simplifyText(text) {
    let sentences = text.split(/[.!?]/);

    sentences = sentences
        .map(s => s.trim())
        .filter(s => s.length > 50);

    let important = sentences.slice(0, 8);

    const keywords = [
        "important",
        "people",
        "help",
        "use",
        "need",
        "problem",
        "problems",
        "information",
        "service",
        "services",
        "system",
        "support",
        "learning",
        "reading",
        "health",
        "safety"
    ];

    let simplified = important.map(s => {
        let line = s
            .replace(/\[\d+\]/g, "")
            .replace(/utilize/gi, "use")
            .replace(/approximately/gi, "about")
            .replace(/individuals/gi, "people")
            .replace(/numerous/gi, "many")
            .replace(/assistance/gi, "help")
            .replace(/difficulties/gi, "problems")
            .replace(/comprehension/gi, "understanding")
            .replace(/demonstrate/gi, "show")
            .replace(/significant/gi, "important")
            .replace(/therefore/gi, "so")
            .replace(/however/gi, "but")
            .replace(/obtain/gi, "get")
            .replace(/require/gi, "need");

        keywords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, "gi");
            line = line.replace(regex, match => `<span class="highlight">${match}</span>`);
        });

        return `<div class="chunk"><li>${line}</li></div>`;
    });

    return "<ul>" + simplified.join("") + "</ul>";
}

// ==============================
// PROCESS LINK
// ==============================
app.post("/process-link", async (req, res) => {
    const { url } = req.body;

    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        $("script, style, nav, footer, header").remove();

        let text = "";

        $("p").each((i, el) => {
            text += $(el).text() + " ";
        });

        const simplified = simplifyText(text);

        res.json({
            text: text,
            simplified: simplified
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            error: "Error fetching website"
        });
    }
});
module.exports = app;
