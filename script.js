// Startwerte
let posts = [];
let statLikes = 0;
let statShares = 0;
let statWarning = 0;

let realLikes = 0;
let fakeLikes = 0;
let realShares = 0;
let fakeShares = 0;
let realWarning = 0;
let fakeWarning = 0;


// Start Seite
document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("startScreen").style.display = "none";
});

// Posts laden
fetch("posts.json")
  .then(response => response.json())
  .then(data => {
    posts = data;
    renderAllPosts();
  })
  .catch(error => {
    console.error("Fehler beim Laden der Posts:", error);
  });


// Alle Posts anzeigen
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
    const commentBtn = clone.querySelector(".commentIcon");
    const shareBtn = clone.querySelector(".shareIcon");
    const warnBtn = clone.querySelector(".warnIcon");

    // Inhalte setzen
    account.src = post.account;
    author.textContent = post.author;
    image.src = post.image;
    content.textContent = post.content;
    timestamp.textContent = post.timestamp;

    if (post.source && post.source.trim() !== "") {
      source.textContent = "Quelle: " + post.source;
    } else {
      source.style.display = "none";
    }
    likeBtn.src = "images/like.PNG";
    commentBtn.src = "images/comment.PNG";
    shareBtn.src = "images/share.PNG";
    warnBtn.src = "images/warning.png";

    source.style.cursor = "pointer";
    source.onclick = () => openSource(post);

    likeBtn.onclick = () => {
      likeBtn.src = "images/like-red.PNG";
      disableOtherButtons(warnBtn, likeBtn);
      handleAction("like", post);
    };

    shareBtn.onclick = () => {
      shareBtn.src = "images/share-green.PNG";
      disableOtherButtons(warnBtn, shareBtn);
      handleAction("share", post);
    };

    warnBtn.onclick = () => {
      warnBtn.src = "images/warning-red.png";
      disableOtherButtons(warnBtn, likeBtn, shareBtn);
      handleAction("warning", post);
    };
    commentBtn.onclick = () => toggleComments(post, commentsSection);

    wrapper.appendChild(clone);
  });
}



function disableOtherButtons(active, ...others) {
  others.forEach(btn => {
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.4";
  });

  active.style.pointerEvents = "none";
}

function handleAction(action, post) {
  console.log("Aktion:", action, "für Post:", post.id);

  if (action === "like") {
    statLikes++;
    if (post.isFake) fakeLikes++;
    else realLikes++;
  }

  if (action === "share") {
    statShares++;
    if (post.isFake) fakeShares++;
    else realShares++;
  }

  if (action === "warning") {
    statWarning++;
    if (post.isFake) fakeWarning++;
    else realWarning++;
  }

  trackClick(post.id, action, !post.isFake);
}


// Kommentare ein-/ausblenden
function toggleComments(post, section) {
  if (section.classList.contains("hidden")) {
    section.classList.remove("hidden");
    section.textContent = "";

    post.comments.forEach(c => {
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

  modalBody.innerHTML = `
    <div class="fake-tag">${post.info?.tag || ""}</div>
    <h1 class="fake-title">${post.info?.headline || ""}</h1>
    <p class="fake-text">${post.info?.text || ""}</p>
  `;

  document.getElementById("modal").style.display = "flex";
}


// Modal schließen
function closeModal() {
  document.getElementById("modal").style.display = "none";
}


// Tracking-Funktion 
async function trackClick(postId, userChoice, isCorrect) {
  try {
    await fetch("https://seriousgame.42web.io/save.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: postId,
        user_choice: userChoice,
        correct: isCorrect ? 1 : 0
      })
    });

    console.log("Tracking gespeichert");
  } catch (error) {
    console.error("Tracking-Fehler:", error);
  }
}


// Weiterleitung + Stats speichern
function goToEndScreen() {
  const stats = {
    statLikes,
    statShares,
    statWarning,

    realLikes,
    fakeLikes,
    realShares,
    fakeShares,
    realWarning,
    fakeWarning,
  };

  localStorage.setItem("stats", JSON.stringify(stats));
  window.location.href = "end.html";
}


// Button zur Auswertung
document.getElementById("auswertungBtn").addEventListener("click", goToEndScreen);
