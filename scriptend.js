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

    // Checkbox‑Werte
    let difficulty = feedbackHard.checked ? "schwer" :
                     feedbackEasy.checked ? "leicht" : null;

    let exposure = feedbackYes.checked ? "begegnet" :
                   feedbackNo.checked ? "nicht_begegnet" : null;

    let confidence = feedbackConfident.checked ? "sicher" :
                     feedbackUncertain.checked ? "unsicher" : null;

    // Radio‑Werte
    const sensibilisierung = document.querySelector('input[name="sensibilisierung"]:checked')?.value || null;
    const hinweise = document.querySelector('input[name="hinweise"]:checked')?.value || null;
    const realismus = document.querySelector('input[name="realismus"]:checked')?.value || null;

    // Prüfen ob alles ausgefüllt ist
    if (!difficulty || !exposure || !confidence || !sensibilisierung || !hinweise || !realismus) {
        alert("Bitte beantworte alle Fragen.");
        return;
    }

    // Daten senden
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
    .then(() => alert("Danke für dein Feedback!"))
    .catch(err => console.error("Feedback-Fehler:", err));
});

function restartGame() {
  localStorage.removeItem("stats");
  window.location.href = "spiel.html";
}

const sensibilisierung = document.getElementById("sliderSensibilisierung").value;
const realismus = document.getElementById("sliderRealismus").value;

localStorage.setItem("sensibilisierung", sensibilisierung);
localStorage.setItem("realismus", realismus);