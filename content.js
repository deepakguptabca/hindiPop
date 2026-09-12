document.addEventListener("mouseup", async () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (!text) return 0;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Remove previous popup
    document.querySelector("#hindi-translator-popup")?.remove();

    const popup = document.createElement("div");
    popup.id = "hindi-translator-popup";

    popup.innerHTML = `
        <div class="translation-loading">
            Translating...
        </div>
    `;

    document.body.appendChild(popup);

    popup.style.left = `${rect.left + window.scrollX}px`;
    popup.style.top = `${rect.bottom + window.scrollY + 8}px`;

    try {
        const url =
            `https://translate.googleapis.com/translate_a/single?client=gtx` +
            `&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url);
        const data = await response.json();

        const translation = data[0]
            .map(item => item[0])
            .join("");

        popup.innerHTML = `
            <div class="original">${text}</div>
            <div class="translation">${translation}</div>
        `;

    } catch (error) {
        popup.innerHTML = "Translation failed";
        console.error(error);
    }
});


// Close popup when clicking outside
document.addEventListener("mousedown", (event) => {
    const popup = document.querySelector("#hindi-translator-popup");

    if (popup && !popup.contains(event.target)) {
        popup.remove();
        window.getSelection().removeAllRanges();
    }
});