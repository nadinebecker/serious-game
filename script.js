
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

function showPost(post) {
  console.log("Aktueller Post:", post);
 document.getElementById("postAuthor").textContent = post.author;
  document.getElementById("postContent").textContent = post.content;
  document.getElementById("postSource").textContent = "Quelle: " + post.source;
 
}
