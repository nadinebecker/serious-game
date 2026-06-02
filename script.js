// Startwerte
let level = 1;
let points = 0;

// Werte in die HTML-Elemente schreiben
document.getElementById("level").textContent = level;
document.getElementById("points").textContent = points;


// Posts laden
fetch("posts.json")
  .then(response => response.json())
  .then(posts => {
    console.log("Posts geladen:", posts);

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
