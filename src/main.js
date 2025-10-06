
// Navbar toggle
const menuBtn = document.getElementById("menu-icon");
const menuIcon = document.getElementById("menu-icon");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    menuIcon.classList.toggle("fa-xmark");
    menuIcon.classList.toggle("fa-bars");
  });
}

