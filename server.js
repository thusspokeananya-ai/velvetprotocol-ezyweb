const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// ==============================
// CLEAN SENTENCE
// ==============================
function cleanSentence(sentence) {
    return sentence
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
        .replace(/require/gi, "need")
        .trim();
}

// ==============================
// SIMPLIFY FUNCTION
// ==============================
function simplifyText(text) {
    let sentences = text.split(/[.!?]/);

    sentences = sentences
        .map(s => cleanSentence(s))
        .filter(s => s.length > 30)
        .slice(0, 8);

    const html =
        "<ul>" +
        sentences.map(s => `<div class="chunk"><li>${s}</li></div>`).join("") +
        "</ul>";

    return {
        html: html,
        sentences: sentences
    };
}

// ==============================
// PROCESS URL / TEXT / IMAGE
// ==============================
app.post("/process", upload.single("image"), async (req, res) => {
    try {
        let text = "";

        if (req.body.url) {
            const response = await axios.get(req.body.url, {
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            });

            const html = response.data;
            const $ = cheerio.load(html);

            $("script, style, nav, footer, header").remove();

            $("p").each((i, el) => {
                text += $(el).text() + " ";
            });
        }

        if (req.body.text) {
            text += " " + req.body.text;
        }

        if (req.file) {
            const result = await Tesseract.recognize(req.file.path, "eng");
            text += " " + result.data.text;

            fs.unlink(req.file.path, () => {});
        }

        const result = simplifyText(text);

        res.json({
            text: text,
            html: result.html,
            sentences: result.sentences
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            error: "Error processing input"
        });
    }
});

module.exports = (req, res) => app(req, res);
