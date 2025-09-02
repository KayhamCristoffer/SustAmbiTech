
// === Carrega o menu ===
fetch('menu.html').then(response => response.text()).then(data => {
  document.getElementById('menu-container').innerHTML = data;

  const menuBtn = document.getElementById("menuBtn");
  const body = document.body;

  let overlay = document.getElementById("overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.className = "overlay";
    document.body.appendChild(overlay);
  }

  menuBtn?.addEventListener("click", () => {
    body.classList.toggle("menu-open");
  });

  overlay.addEventListener("click", () => {
    body.classList.remove("menu-open");
  });

  document.querySelector(".login")?.addEventListener("click", () => {
    document.getElementById("loginOverlay")?.classList.add("show");
  });

  document.querySelector(".logout")?.addEventListener("click", () => {
    isLoggedIn = false;
    updateAuthButtons();
  });

  updateAuthButtons();
});

