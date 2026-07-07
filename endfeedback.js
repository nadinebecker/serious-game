const stats = JSON.parse(localStorage.getItem("stats")) || {};

function generateMiniFeedback(stats) {

  const correct = stats.realLikes + stats.realShares + stats.fakeWarning;
  const wrong = stats.fakeLikes + stats.fakeShares + stats.realWarning;

  const disinfoClicked = stats.disinfoLikes + stats.disinfoShares;
  const disinfoWarned = stats.disinfoWarning;

  let level = "";
  let text = "";

  if (correct > wrong + 2) {
    level = "sehr gut";
    text = "Du hast viele Inhalte richtig eingeschätzt und sehr aufmerksam reagiert.";
  } else if (correct > wrong) {
    level = "gut";
    text = "Du hast die meisten Inhalte korrekt erkannt. Einige Posts waren nicht ganz richtig, aber insgesamt tolle Leistung.";
  } else if (Math.abs(correct - wrong) <= 2) {
    level = "Mittelfeld";
    text = "Du hast einige Inhalte gut erkannt, aber auch viele Desinformation positiv bewertet.";
  } else {
    level = "schwach";
    text = "Du hast mehrere Inhalte falsch eingeschätzt. Probier's direkt nochmal ";
  }

  return `
  <p class="text-lg">
    <strong>Wie du dich geschlagen hast:</strong> ${level}<br>
    ${text}
  </p>

  <p class="text-lg mt-4">
    <strong>Unter deiner detaillierten Auswertung findest du zusätzliche Hinweise,
    die dir beim nächsten Durchlauf helfen können.</strong>
  </p>
`;

}
// Feedback erzeugen
const feedbackHTML = generateMiniFeedback(stats);
document.getElementById("miniFeedback").innerHTML = feedbackHTML;

// Level aus dem HTML extrahieren
const levelMatch = feedbackHTML.match(/Wie du dich geschlagen hast:<\/strong>\s*(.*?)</);
const level = levelMatch ? levelMatch[1] : "unbekannt";

// Session-ID laden
let sessionId = localStorage.getItem("sessionId");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("sessionId", sessionId);
}

// Nur das speichern, was du wirklich brauchst
const form = new FormData();
form.append("session_id", sessionId);
form.append("level", level);

// Ergebnis speichern
fetch("https://seriousgame.42web.io/save.php", {
  method: "POST",
  body: form
})
  .then(r => r.text())
  .then(t => console.log("RESULT:", t))
  .catch(err => console.error("Result-Fehler:", err));
