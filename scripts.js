const toggleMenu = () => {
  document.querySelector(".nav__menu").classList.toggle("open");
};

const toggleSettingsMenu = () => {
  document.querySelector(".nav__sub-menu").classList.toggle("open");
};

const darkOn = document.getElementById("dark-mode-on");
const darkOff = document.getElementById("dark-mode-off");

const toggleDarkMode = () => {
  if (darkOn.style.display === "inline-block") {
    darkOn.style.display = "none";
    darkOff.style.display = "inline-block";
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    darkOn.style.display = "inline-block";
    darkOff.style.display = "none";
    document.documentElement.setAttribute("data-theme", "");
    localStorage.setItem("theme", "");
  }
};

let currentTheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "";
document.documentElement.setAttribute("data-theme", currentTheme);
if (currentTheme === "dark") {
  darkOn.style.display = "none";
  darkOff.style.display = "inline-block";
}

document.querySelector(".nav__toggle").addEventListener("click", toggleMenu);

document.querySelector(".nav__menu-item__dropdown").addEventListener("click", toggleSettingsMenu);

document.getElementById("dark-mode").addEventListener("click", toggleDarkMode);
