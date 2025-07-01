const BACKEND = window.location.origin;

async function loadComments(){
  const res = await fetch(`${BACKEND}/comments`);
  const list = await res.json();
  const container = document.getElementById("commentsList");
  container.innerHTML = "";
  list.forEach(c => {
    const d = document.createElement("div");
    d.className = "comment-box";
    d.innerHTML = `<strong>${c.name}</strong><p>${c.comment}</p>`;
    container.appendChild(d);
  });
}

document.getElementById("commentForm").addEventListener("submit", async e => {
  e.preventDefault();
  const name = e.target.name.value, comment = e.target.comment.value;
  await fetch(`${BACKEND}/comments`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ name, comment })
  });
  e.target.reset();
  loadComments();
});

document.getElementById("donateBtn").addEventListener("click", async () => {
  const res = await fetch(`${BACKEND}/donate`, { method:"POST" });
  const { url } = await res.json();
  window.location.href = url;
});

loadComments();
