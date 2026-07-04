// Session-ID erzeugen
if (!localStorage.getItem("sessionId")) {
  localStorage.setItem("sessionId", crypto.randomUUID());
}

// Globale Variablen
let posts = [];
let stats = JSON.parse(localStorage.getItem("stats")) || {
  statLikes: 0,
  statShares: 0,
  statWarning: 0,

  realLikes: 0,
  fakeLikes: 0,
  realShares: 0,
  fakeShares: 0,
  realWarning: 0,
  fakeWarning: 0,

  neutralNewsLikes: 0,
  neutralPostLikes: 0,
  emotionalNewsLikes: 0,
  disinfoLikes: 0,
  emotionalDisinfoLikes: 0,

  neutralNewsShares: 0,
  neutralPostShares: 0,
  emotionalNewsShares: 0,
  disinfoShares: 0,
  emotionalDisinfoShares: 0,

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

// Kategorie prüfen
function isCorrectCategory(category) {
  return category === "neutralNews" || category === "neutralPost";
}

// POSTS RENDERN
function renderAllPosts() {

  const wrapper = document.getElementById("postsWrapper");
  const template = document.getElementById("postTemplate");

  // Schutz für index.html
  if (!wrapper || !template) return;

  wrapper.textContent = "";

  posts.forEach(post => {
    const clone = template.content.cloneNode(true);

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

    commentCount.textContent = post.comments?.length ?? 0;
    likeCount.textContent = post.likes ?? 0;

    // Quelle
    if (post.source && post.source.trim() !== "") {
      source.textContent = "Quelle: " + post.source;
    } else {
      source.style.display = "none";
    }

    // Icons
    likeBtn.src = "images/like.PNG";
    commentBtn.src = "images/comment.PNG";
    shareBtn.src = "images/share.PNG";
    warnBtn.src = "images/warning.png";

    // Quelle öffnen + Tracking
    source.onclick = () => {
      openSource(post);
      trackClick(post.id, "source_open", isCorrectCategory(post.category));
    };

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

    // Kommentare + Tracking
    commentBtn.onclick = () => {
      toggleComments(post, commentsSection);
      trackClick(post.id, "comment_open", isCorrectCategory(post.category));
    };

    wrapper.appendChild(clone);
  });
}


// Punkte-Popup
function showPointsPopup(value) {
  const popup = document.getElementById("pointsPopup");
  popup.textContent = (value > 0 ? "+" : "") + value;

  popup.classList.remove("show");
  void popup.offsetWidth;
  popup.classList.add("show");
}


// Aktionen zählen
function handleAction(action, post) {
  // --- Doppelaktionen verhindern ---
let actionHistory = JSON.parse(localStorage.getItem("actionHistory")) || {};
const postId = post.id;

if (!actionHistory[postId]) {
  actionHistory[postId] = { like: false, share: false, warning: false };
}

if (actionHistory[postId][action] === true) {
  return;
}

actionHistory[postId][action] = true;
localStorage.setItem("actionHistory", JSON.stringify(actionHistory));

  const correct = isCorrectCategory(post.category);

  if (action === "like") stats.statLikes++;
  if (action === "share") stats.statShares++;
  if (action === "warning") stats.statWarning++;

  if (action === "like") correct ? stats.realLikes++ : stats.fakeLikes++;
  if (action === "share") correct ? stats.realShares++ : stats.fakeShares++;
  if (action === "warning") correct ? stats.realWarning++ : stats.fakeWarning++;

  const cat = post.category;

  if (action === "like") stats[cat + "Likes"]++;
  if (action === "share") stats[cat + "Shares"]++;
  if (action === "warning") stats[cat + "Warning"]++;

  localStorage.setItem("stats", JSON.stringify(stats));

  trackClick(post.id, action, correct);

  // Punktevergabe
  let points = 0;

  if (action === "like" || action === "share") {
    switch (post.category) {
      case "neutralPost": points = 1; break;
      case "neutralNews": points = 5; break;
      case "disinfo": points = -2; break;
      case "emotionalNews":
      case "emotionalDisinfo": points = -5; break;
    }
  }

if (action === "warning") {
  switch (post.category) {
    case "neutralPost": points = -1; break;
    case "neutralNews": points = -5; break;
    case "disinfo":
    case "emotionalNews":
    case "emotionalDisinfo": points = 5; break;
    default: points = 0;
    }
  }

  stats.points += points;
  if (points !== 0) showPointsPopup(points);
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


// Quelle öffnen
function openSource(post) {
  const modalBody = document.getElementById("modal-body");
  const modalFooter = document.getElementById("modal-footer");

  const showImage = post.info?.tag !== "-";

  modalBody.innerHTML = `
    <div class="info-page">
      <div class="info-banner">${post.info?.tag || ""}</div>
      ${showImage ? `<img src="${post.image}" class="info-image">` : ""}
      <h1 class="info-headline">${post.info?.headline || ""}</h1>
      <p class="info-text">${post.info?.text || ""}</p>
      <div class="info-fade"></div>
    </div>
  `;

  if (post.sourcesCount > 1) {
    modalFooter.textContent = `${post.sourcesCount} weitere unabhängige Medien gefunden`;
    modalFooter.style.color = "#1f5e36";
  } else {
    modalFooter.textContent = `⚠️ Keine weiteren Quellen gefunden`;
    modalFooter.style.color = "#f87171";
  }

  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}


// Tracking – InfinityFree-kompatibel
async function trackClick(postId, userChoice) {
  try {
    await fetch("https://seriousgame.42web.io/save.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: localStorage.getItem("sessionId"),
        post_id: postId,
        user_choice: userChoice
      })
    });
  } catch (err) {
    console.error("Tracking-Fehler:", err);
  }
}

// Navigation
function startGame() {
  localStorage.removeItem("stats");
  localStorage.removeItem("actionHistory");
  localStorage.removeItem("sessionId"); // optional
  window.location.href = "spiel.html";
}


function goToEndScreen() {
  localStorage.setItem("stats", JSON.stringify(stats));
  window.location.href = "end.html";
}


// Buttons aktivieren
const auswertungBtn = document.getElementById("auswertungBtn");
if (auswertungBtn) {
  auswertungBtn.addEventListener("click", goToEndScreen);
}

const startBtn = document.getElementById("startGameBtn");
if (startBtn) {
  startBtn.addEventListener("click", startGame);
}
