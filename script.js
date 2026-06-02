// Startwerte
let level = 1;
let points = 0;
let currentPostIndex = 0;
let posts = [];


// Werte in die HTML-Elemente schreiben
document.getElementById("level").textContent = level;
document.getElementById("points").textContent = points;


// Posts laden
fetch("posts.json")
  .then(response => response.json())
   .then(data => {
    posts = data;
    showPost(posts[0]);
  })
  .catch(error => {
    console.error("Fehler beim Laden der Posts:", error);
  });


// Post anzeigen

function showPost(post) {
  console.log("Aktueller Post:", post);
  document.getElementById("postAccount").src = post.account;
  document.getElementById("postAuthor").textContent = post.author;
  document.getElementById("postContent").textContent = post.content;
  document.getElementById("postSource").textContent = "Quelle: " + post.source;
  document.getElementById("postImage").src = post.image;

  // Kommentare ausblenden
  document.getElementById("commentsSection").innerHTML = "";
  document.getElementById("commentsSection").style.display = "none";

  // Icons verbinden
  document.getElementById("likeIcon").onclick = () => handleAction("like", post);
  document.getElementById("shareIcon").onclick = () => handleAction("share", post);
  document.getElementById("commentIcon").onclick = () => toggleComments(post);
}

// Aktionen (Like / Share)
function handleAction(action, post) {
  console.log("Aktion:", action, "für Post:", post.id);
  // Nächster Post
  loadNextPost();
}


// Kommentare ein-/ausblenden
function toggleComments(post) {
  const section = document.getElementById("commentsSection");

  if (section.style.display === "none") {
    section.style.display = "block";

    section.innerHTML = post.comments
      .map(c => `<p><strong>${c.user}:</strong> ${c.text}</p>`)
      .join("");
  } else {
    section.style.display = "none";
  }
}


// Nächsten Post laden
function loadNextPost() {
  currentPostIndex++;

  if (currentPostIndex >= posts.length) {
    alert("Keine Posts mehr!");
    return;
  }

  showPost(posts[currentPostIndex]);
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

document.getElementById("testBtn").addEventListener("click", () => {
  
  
  //  Testwert
  const testPostId = 999;
  const testChoice = "test-button";
  const testCorrect = false;

  trackClick(testPostId, testChoice, testCorrect);

  console.log("Test-Tracking ausgelöst");
});
