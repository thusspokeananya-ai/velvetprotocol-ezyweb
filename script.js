async function processLink() {
    const url = document.getElementById("urlInput").value;

    try {
        const response = await fetch("http://localhost:3000/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        document.getElementById("text").innerText = data.original;
        document.getElementById("simpleText").innerText = data.simplified;

    } catch (err) {
        alert("Error processing website");
    }
}
