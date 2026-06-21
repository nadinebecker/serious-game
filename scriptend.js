let sessionId = localStorage.getItem("sessionId");

if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
}

// Card 1
feedbackHard?.addEventListener("change", () => {
    if (feedbackHard.checked) feedbackEasy.checked = false;
});

feedbackEasy?.addEventListener("change", () => {
    if (feedbackEasy.checked) feedbackHard.checked = false;
});

// Card 2
feedbackYes?.addEventListener("change", () => {
    if (feedbackYes.checked) feedbackNo.checked = false;
});

feedbackNo?.addEventListener("change", () => {
    if (feedbackNo.checked) feedbackYes.checked = false;
});

// Card 3
feedbackConfident?.addEventListener("change", () => {
    if (feedbackConfident.checked) feedbackUncertain.checked = false;
});

feedbackUncertain?.addEventListener("change", () => {
    if (feedbackUncertain.checked) feedbackConfident.checked = false;
});


// --- Feedback senden ---
document.getElementById("feedbackSubmit")?.addEventListener("click", () => {

    // Werte sammeln
    let difficulty = null;
    if (feedbackHard.checked) difficulty = "schwer";
    if (feedbackEasy.checked) difficulty = "leicht";

    let exposure = null;
    if (feedbackYes.checked) exposure = "begegnet";
    if (feedbackNo.checked) exposure = "nicht_begegnet";

    let confidence = null;
    if (feedbackConfident.checked) confidence = "sicher";
    if (feedbackUncertain.checked) confidence = "unsicher";

    // Prüfen ob alles ausgefüllt ist
    if (!difficulty || !exposure || !confidence) {
        alert("Bitte beantworte alle drei Fragen.");
        return;
    }


    fetch("https://seriousgame.42web.io/save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            feedback: feedbackValue,
            session_id: sessionId
        })
    })
        .then(() => alert("Danke für dein Feedback!"))
        .catch(err => console.error("Feedback-Fehler:", err));
});

function restartGame() {
  localStorage.removeItem("stats");
  window.location.href = "spiel.html";
}
