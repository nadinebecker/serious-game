// Session-ID erzeugen, falls noch nicht vorhanden
if (!localStorage.getItem("sessionId")) {
  localStorage.setItem("sessionId", crypto.randomUUID());
}

// Statistiken
let posts = [];
let stats = JSON.parse(localStorage.getItem("stats")) || {

  // Gesamtwerte
  statLikes: 0,
  statShares: 0,
  statWarning: 0,

  // Korrekt/Falsch
  realLikes: 0,
  fakeLikes: 0,
  realShares: 0,
  fakeShares: 0,
  realWarning: 0,
  fakeWarning: 0,

  // Kategorien: Likes
  neutralNewsLikes: 0,
  neutralPostLikes: 0,
  emotionalNewsLikes: 0,
  disinfoLikes: 0,
  emotionalDisinfoLikes: 0,

  // Kategorien: Shares
  neutralNewsShares: 0,
  neutralPostShares: 0,
  emotionalNewsShares: 0,
  disinfoShares: 0,
  emotionalDisinfoShares: 0,

  // Kategorien: Warnungen
  neutralNewsWarning: 0,
  neutralPostWarning: 0,
  emotionalNewsWarning: 0,
  disinfoWarning: 0,
  emotionalDisinfoWarning: 0,

    points: 0
};


// Posts laden
fetch("posts.json")
  .then(response => response.json())
  .then(data => {
    posts = data;
    renderAllPosts();
  })
  .catch(error => console.error("Fehler beim Laden der Posts:", error));


function isCorrectCategory(category) {
return category === "neutralNews" || category === "neutralPost";
}


// Posts rendern
function renderAllPosts() {
  const wrapper = document.getElementById("postsWrapper");
  const template = document.getElementById("postTemplate");

  wrapper.textContent = "";

  posts.forEach(post => {
    const clone = template.content.cloneNode(true);

    // Elemente holen
    const account = clone.querySelector(".postAccount");
    const author = clone.querySelector(".postAuthor");
    const image = clone.querySelector(".postImage");
    const content = clone.querySelector(".postContent");
    const source = clone.querySelector(".postSource");
    const commentsSection = clone.querySelector(".comments");
    const timestamp = clone.querySelector(".postTimestamp");

    const likeBtn = clone.querySelector(".likeIcon");
    const likeCount = clone.querySelector(".likeCount");
    const commentBtn = clone.querySelector(".commentIcon");
    const commentCount = clone.querySelector(".commentCount");
    const shareBtn = clone.querySelector(".shareIcon");
    const warnBtn = clone.querySelector(".warnIcon");

    // Inhalte setzen
    account.src = post.account;
    author.textContent = post.author;
    image.src = post.image;
    content.textContent = post.content;
    timestamp.textContent = post.timestamp;

    // Kommentare sicher zählen
    commentCount.textContent = post.comments?.length ?? 0;

    // Likes aus JSON übernehmen
    likeCount.textContent = post.likes ?? 0;

    // Quelle
    if (post.source && post.source.trim() !== "") {
      source.textContent = "Quelle: " + post.source;
    } else {
      source.style.display = "none";
    }

    // Icons setzen
    likeBtn.src = "images/like.PNG";
    commentBtn.src = "images/comment.PNG";
    shareBtn.src = "images/share.PNG";
    warnBtn.src = "images/warning.png";

    // Quelle öffnen
    source.onclick = () => openSource(post);

    // LIKE
    likeBtn.onclick = () => {
      likeBtn.src = "images/like-red.PNG";

      warnBtn.style.pointerEvents = "none";
      warnBtn.style.opacity = "0.4";

      let count = parseInt(likeCount.textContent);
      likeCount.textContent = count + 1;

      handleAction("like", post);
    };

    // SHARE
    shareBtn.onclick = () => {
      shareBtn.src = "images/share-green.PNG";

      warnBtn.style.pointerEvents = "none";
      warnBtn.style.opacity = "0.4";

      handleAction("share", post);
    };

    // WARNING
    warnBtn.onclick = () => {
      warnBtn.src = "images/warning-red.png";

      likeBtn.style.pointerEvents = "none";
      likeBtn.style.opacity = "0.4";

      shareBtn.style.pointerEvents = "none";
      shareBtn.style.opacity = "0.4";

      handleAction("warning", post);
    };

    // Kommentare ein-/ausblenden
    commentBtn.onclick = () => toggleComments(post, commentsSection);

    wrapper.appendChild(clone);
  });
}

function showPointsPopup(value) {
  const popup = document.getElementById("pointsPopup");

  popup.textContent = (value > 0 ? "+" : "") + value;

  // Reset Animation
  popup.classList.remove("show");
  void popup.offsetWidth; // Trick: Animation neu starten

  // Start Animation
  popup.classList.add("show");
}



// Aktionen zählen
function handleAction(action, post) {
  const correct = isCorrectCategory(post.category);
  
  // Gesamtzähler
  if (action === "like") stats.statLikes++;
  if (action === "share") stats.statShares++;
  if (action === "warning") stats.statWarning++;

  // Korrekt/Falsch
  if (action === "like") {
    correct ? stats.realLikes++ : stats.fakeLikes++;
  }

  if (action === "share") {
    correct ? stats.realShares++ : stats.fakeShares++;
  }

  if (action === "warning") {
    correct ? stats.realWarning++ : stats.fakeWarning++;
  }

  // Kategorien zählen
  const cat = post.category;

  if (action === "like") stats[cat + "Likes"]++;
  if (action === "share") stats[cat + "Shares"]++;
  if (action === "warning") stats[cat + "Warning"]++;

  // Speichern
  localStorage.setItem("stats", JSON.stringify(stats));

  // Tracking an Server
  trackClick(post.id, action, correct);
// Punktevergabe für LIKE & SHARE
if (action === "like" || action === "share") {

  let points = 0;

  switch (post.category) {

    case "neutralPost":
      points = 1;
      break;

    case "neutralNews":
      points = 5;
      break;

    case "disinfo":
      points = -2;
      break;

    case "emotionalNews":
    case "emotionalDisinfo":
      points = -5;
      break;
  }

  stats.points += points;
  showPointsPopup(points);
}


//  Punktevergabe für WARNING
if (action === "warning") {

  let points = 0;

  switch (post.category) {

    case "neutralPost":
    case "neutralNews":
      points = 0;
      break;

    case "disinfo":
    case "emotionalNews":
    case "emotionalDisinfo":
      points = 5;
      break;
  }

  stats.points += points;
  if (points !== 0) showPointsPopup(points);
}

}


// Kommentare ein-/ausblenden
function toggleComments(post, section) {
  if (section.classList.contains("hidden")) {
    section.classList.remove("hidden");
    section.textContent = "";

    (post.comments ?? []).forEach(c => {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = c.user + ": ";
      p.appendChild(strong);
      p.appendChild(document.createTextNode(c.text));
      section.appendChild(p);
    });

  } else {
    section.classList.add("hidden");
  }
}


// Info öffnen
function openSource(post) {
  const modalBody = document.getElementById("modal-body");
  const modalFooter = document.getElementById("modal-footer");

  const showImage = post.info?.tag !== "-";

  modalBody.innerHTML = `
    <div class="info-page">

      <div class="info-banner">${post.info?.tag || ""}</div>

      ${showImage ? `<img src="${post.image}" class="info-image" alt="Artikelbild">` : ""}

      <h1 class="info-headline">
        ${post.info?.headline || ""}
      </h1>

      <p class="info-text">
        ${post.info?.text || ""}
      </p>

      <div class="info-fade"></div>

    </div>
  `;

  if (post.sourcesCount > 1) {
    modalFooter.textContent = `${post.sourcesCount} weitere unabhängige Medien im Netz gefunden`;
    modalFooter.style.color = "#1f5e36";
  } else {
    modalFooter.textContent = `⚠️ Keine weiteren Quellen gefunden`;
    modalFooter.style.color = "#f87171";
  }

  document.getElementById("modal").style.display = "flex";
}


// Modal schließen
function closeModal() {
  document.getElementById("modal").style.display = "none";
}


// Tracking
async function trackClick(postId, userChoice, isCorrect) {
  try {
    await fetch("https://seriousgame.42web.io/save.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: postId,
        user_choice: userChoice,
        correct: isCorrect ? 1 : 0,
        session_id: localStorage.getItem("sessionId")
      })
    });
  } catch (error) {
    console.error("Tracking-Fehler:", error);
  }
}

function startGame() {
  localStorage.removeItem("stats");
  window.location.href = "spiel.html";
}



// Weiterleitung + Stats speichern
function goToEndScreen() {
  localStorage.setItem("stats", JSON.stringify(stats));
  window.location.href = "end.html";
}

function generateMiniFeedback(stats) {

  const correct = stats.realLikes + stats.realShares + stats.realWarning;
  const wrong = stats.fakeLikes + stats.fakeShares + stats.fakeWarning;

  const disinfoClicked = stats.disinfoLikes + stats.disinfoShares;
  const disinfoWarned = stats.disinfoWarning;

  let level = "";
  let text = "";

  // Bewertung
  if (correct > wrong + 5) {
    level = "sehr gut";
    text = "Du hast viele Inhalte richtig eingeschätzt und sehr aufmerksam reagiert.";
  } else if (correct > wrong) {
    level = "gut";
    text = "Du hast die meisten Inhalte korrekt erkannt. Einige Posts waren tricky, aber insgesamt solide.";
  } else if (wrong > correct) {
    level = "mittelmäßig";
    text = "Du hast einige Inhalte gut erkannt, aber auch viele Desinformation positiv bewertet. Achte stärker auf emotionale Sprache und übertriebene Behauptungen.";
  } else {
    level = "schwach";
    text = "Du hast viele problematische Inhalte positiv bewertet. Schau dir kritisch an, welche Muster Desinformation oft nutzt.";
  }

  return `
    <h3 class="font-semibold mt-6">Feedback</h3>

    <strong>Einordnung:</strong> ${level}<br>
    ${text}<br><br>

    <strong>Umgang mit Desinformation:</strong><br>
    Kritisch markiert: <strong>${disinfoWarned}</strong><br>
    Positiv bewertet (Like/Share): <strong>${disinfoClicked}</strong><br><br>

    <strong>Hinweis:</strong><br>
    ${
      level === "sehr gut"
        ? "Du erkennst problematische Inhalte sehr zuverlässig. Weiter so!"
        : level === "gut"
        ? "Du bist auf einem guten Weg. Achte bei emotionalen Posts auf übertriebene Formulierungen."
        : level === "mittelmäßig"
        ? "Du hast einiges richtig erkannt, aber emotionale oder polarisierende Inhalte können täuschen. Schau genauer hin."
        : "Viele Inhalte waren schwer einzuschätzen. Achte besonders auf Quellen, Sprache und unrealistische Behauptungen."
    }
  `;
}


// Button zur Auswertung
document.getElementById("auswertungBtn").addEventListener("click", goToEndScreen);
