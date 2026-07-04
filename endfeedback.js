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
