document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("navList");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
    });
  }

  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-list a").forEach(function(link){
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
});
