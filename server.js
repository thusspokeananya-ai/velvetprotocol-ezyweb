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

    let important = sentences.slice(0, 6);

    let simplified = important.map(s => {
        return s
            .replace(/utilize/gi, "use")
            .replace(/approximately/gi, "about")
            .replace(/individuals/gi, "people")
            .replace(/numerous/gi, "many")
            .replace(/assistance/gi, "help")
            .replace(/difficulties/gi, "problems");
    });

    // RETURN HTML BULLETS
    return "<ul>" + simplified.map(s => `<li>${s}</li>`).join("") + "</ul>";
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

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
