let menu = document.querySelector(".nav__menu");

document.querySelector(".nav__toggle").addEventListener("click", (event) => {
  event.stopPropagation();
  menu.classList.toggle("open");
});

document.addEventListener("click", () => menu.classList.remove("open"));

menu.addEventListener("click", (event) => event.stopPropagation());

document.querySelector(".nav__menu-item__dropdown").addEventListener("click", () => {
  document.querySelector(".nav__sub-menu").classList.toggle("open");
});

const darkOn = document.querySelector(".dark-on");
const darkOff = document.querySelector(".dark-off");

document.getElementById("dark-mode").addEventListener("click", () => {
  if (darkOn.classList.contains("visible")) {
    darkOn.classList.remove("visible");
    darkOff.classList.add("visible");
    document.documentElement.setAttribute("data-theme", "");
    localStorage.setItem("theme", "");
  } else {
    darkOn.classList.add("visible");
    darkOff.classList.remove("visible");
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});

let currentTheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "";
document.documentElement.setAttribute("data-theme", currentTheme);
if (currentTheme === "dark") {
  darkOn.classList.add("visible");
  darkOff.classList.remove("visible");
}
