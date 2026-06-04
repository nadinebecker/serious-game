// Startwerte
let posts = [];

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


// Alle Posts untereinander anzeigen
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

    // Quelle klickbar machen
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

function disableOtherButtons(active, ...others) {
  others.forEach(btn => {
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.4";
  });

  active.style.pointerEvents = "none";
}

    commentBtn.onclick = () => toggleComments(post, commentsSection);

    wrapper.appendChild(clone);
  });
}


// Aktionen (Like / Share)
function handleAction(action, post) {
  console.log("Aktion:", action, "für Post:", post.id);
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
    <div class="fake-tag">${post.info.tag}</div>
    <h1 class="fake-title">${post.info.headline}</h1>
    <p class="fake-text">${post.info.text}</p>
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


// Testbutton
document.getElementById("testBtn").addEventListener("click", () => {
  const testPostId = 999;
  const testChoice = "test-button";
  const testCorrect = false;

  trackClick(testPostId, testChoice, testCorrect);

  console.log("Test-Tracking ausgelöst");
});
