// Startwerte
let posts = [];

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

    const likeBtn = clone.querySelector(".likeIcon");
    const commentBtn = clone.querySelector(".commentIcon");
    const shareBtn = clone.querySelector(".shareIcon");

    // Inhalte setzen
    account.src = post.account;
    author.textContent = post.author;
    image.src = post.image;
    content.textContent = post.content;
    source.textContent = "Quelle: " + post.source;

    likeBtn.src = "images/like.PNG";
    commentBtn.src = "images/comment.PNG";
    shareBtn.src = "images/share.PNG";

    // Quelle klickbar machen
    source.style.cursor = "pointer";
    source.onclick = () => openSource(post);

    // Events
    likeBtn.onclick = () => {
      likeBtn.src = "images/like-red.PNG";
      handleAction("like", post);
    };

    shareBtn.onclick = () => handleAction("share", post);

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


// Fake-Website öffnen
function openSource(post) {
  const modalBody = document.getElementById("modal-body");

  modalBody.innerHTML = `
    <div class="fake-header">${post.source}</div>
    <div class="fake-tag">${post.fakeSite.tag}</div>
    <h1 class="fake-title">${post.fakeSite.headline}</h1>
    <p class="fake-text">${post.fakeSite.text}</p>
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
