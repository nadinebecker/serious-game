// Session-ID laden oder erzeugen
let sessionId = localStorage.getItem("sessionId");
if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
}

/* ---------------------------------------------------------
   1) FEEDBACK-SEITE ERKENNEN
--------------------------------------------------------- */
if (document.getElementById("feedbackSubmit")) {

    // Card 1
    const feedbackHard = document.getElementById("feedbackHard");
    const feedbackEasy = document.getElementById("feedbackEasy");

    feedbackHard?.addEventListener("change", () => {
        if (feedbackHard.checked) feedbackEasy.checked = false;
    });

    feedbackEasy?.addEventListener("change", () => {
        if (feedbackEasy.checked) feedbackHard.checked = false;
    });

    // Card 2
    const feedbackYes = document.getElementById("feedbackYes");
    const feedbackNo = document.getElementById("feedbackNo");

    feedbackYes?.addEventListener("change", () => {
        if (feedbackYes.checked) feedbackNo.checked = false;
    });

    feedbackNo?.addEventListener("change", () => {
        if (feedbackNo.checked) feedbackYes.checked = false;
    });

    // Card 3
    const feedbackConfident = document.getElementById("feedbackConfident");
    const feedbackUncertain = document.getElementById("feedbackUncertain");

    feedbackConfident?.addEventListener("change", () => {
        if (feedbackConfident.checked) feedbackUncertain.checked = false;
    });

    feedbackUncertain?.addEventListener("change", () => {
        if (feedbackUncertain.checked) feedbackConfident.checked = false;
    });

    // --- Feedback senden ---
document.getElementById("feedbackSubmit").addEventListener("click", () => {

    let difficulty = feedbackHard.checked ? "schwer" :
                     feedbackEasy.checked ? "leicht" : null;

    let exposure = feedbackYes.checked ? "begegnet" :
                   feedbackNo.checked ? "nicht_begegnet" : null;

    let confidence = feedbackConfident.checked ? "sicher" :
                     feedbackUncertain.checked ? "unsicher" : null;

    const sensibilisierung = document.querySelector('input[name="sensibilisierung"]:checked')?.value || null;
    const hinweise = document.querySelector('input[name="hinweise"]:checked')?.value || null;
    const realismus = document.querySelector('input[name="realismus"]:checked')?.value || null;

    if (!difficulty || !exposure || !confidence || !sensibilisierung || !hinweise || !realismus) {
        alert("Bitte beantworte alle Fragen.");
        return;
    }

    fetch("https://seriousgame.42web.io/save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            session_id: sessionId,
            difficulty,
            exposure,
            confidence,
            sensibilisierung,
            hinweise,
            realismus
        })
    })
    .then(() => {
        alert("Danke für dein Feedback!");
        window.location.href = "end.html";   // ← Weiterleitung hier!
    })
    .catch(err => console.error("Feedback-Fehler:", err));
});

}
/* ---------------------------------------------------------
   2) ENDSEITE ERKENNEN
--------------------------------------------------------- */
if (document.getElementById("punkteAnzeige")) {
    const stats = JSON.parse(localStorage.getItem("stats")) || { points: 0 };
    document.getElementById("punkteAnzeige").textContent = stats.points;
}

/* ---------------------------------------------------------
   3) restartGame() FUNKTION
--------------------------------------------------------- */
function restartGame() {
    localStorage.removeItem("stats");
    window.location.href = "spiel.html";
}
