let sessionId = localStorage.getItem("sessionId");

if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
}

// --- FEEDBACK TRACKING ---

const feedbackHard = document.getElementById("feedbackHard");
const feedbackEasy = document.getElementById("feedbackEasy");

// Nur eine Auswahl gleichzeitig erlauben
feedbackHard?.addEventListener("change", () => {
    if (feedbackHard.checked) feedbackEasy.checked = false;
});

feedbackEasy?.addEventListener("change", () => {
    if (feedbackEasy.checked) feedbackHard.checked = false;
});

// Feedback an die Datenbank senden
document.getElementById("feedbackSubmit")?.addEventListener("click", () => {
    let feedbackValue = null;

    if (feedbackHard.checked) feedbackValue = "schwer";
    if (feedbackEasy.checked) feedbackValue = "leicht";

    if (!feedbackValue) {
        alert("Bitte wähle eine Option aus.");
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