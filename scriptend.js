// Session-ID laden oder erzeugen
sessionId = localStorage.getItem("sessionId");
if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
}

/* ---------------------------------------------------------
   1) FEEDBACK-SEITE ERKENNEN
--------------------------------------------------------- */
if (document.getElementById("feedbackSubmit")) {

    // --- Feedback senden ---
    document.getElementById("feedbackSubmit").addEventListener("click", () => {

        // Card 1
        const aufbau_desinfo_erkennen =
            document.querySelector('input[name="aufbau_desinfo_erkennen"]:checked')?.value || null;

        const aufbau_realismus =
            document.querySelector('input[name="aufbau_realismus"]:checked')?.value || null;

        // Card 2
        const ziel_sensibilisierung =
            document.querySelector('input[name="ziel_sensibilisierung"]:checked')?.value || null;

        const ziel_hinweise =
            document.querySelector('input[name="ziel_hinweise"]:checked')?.value || null;

        // Card 3
        const weiter_entwicklung_idee =
            document.querySelector('input[name="weiter_entwicklung_idee"]:checked')?.value || null;

        const weiter_entwicklung_medienkompetenz =
            document.querySelector('input[name="weiter_entwicklung_medienkompetenz"]:checked')?.value || null;

        // Card 4
        const erfahrung_desinfo =
            document.querySelector('input[name="erfahrung_desinfo"]:checked')?.value || null;

        const erfahrung_sicherheit =
            document.querySelector('input[name="erfahrung_sicherheit"]:checked')?.value || null;


        // --- Pflichtfelder prüfen ---
        if (
            !aufbau_desinfo_erkennen ||
            !aufbau_realismus ||
            !ziel_sensibilisierung ||
            !ziel_hinweise ||
            !weiter_entwicklung_idee ||
            !weiter_entwicklung_medienkompetenz ||
            !erfahrung_desinfo ||
            !erfahrung_sicherheit
        ) {
            alert("Bitte beantworte alle Fragen.");
            return;
        }

        // --- Daten senden ---
        fetch("https://seriousgame.42web.io/save.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session_id: sessionId,

                // Card 1
                aufbau_desinfo_erkennen,
                aufbau_realismus,

                // Card 2
                ziel_sensibilisierung,
                ziel_hinweise,

                // Card 3
                weiter_entwicklung_idee,
                weiter_entwicklung_medienkompetenz,

                // Card 4
                erfahrung_desinfo,
                erfahrung_sicherheit
            })
        })
            .then(() => {
                alert("Danke für dein Feedback!");
                window.location.href = "end.html";
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

    // MINI-FEEDBACK EINSETZEN
    const feedbackBox = document.getElementById("miniFeedback");

    if (feedbackBox && typeof generateMiniFeedback === "function") {
        feedbackBox.innerHTML = generateMiniFeedback(stats);
    } else {
        console.error("miniFeedback oder generateMiniFeedback nicht gefunden");
    }
}

/* ---------------------------------------------------------
   3) restartGame() FUNKTION
--------------------------------------------------------- */
function restartGame() {
    localStorage.removeItem("stats");
    localStorage.removeItem("actionHistory");
    localStorage.removeItem("sessionId");
    window.location.href = "spiel.html";
}