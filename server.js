const express = require("express");
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

    return text;
}

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
});
