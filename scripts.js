const menu = document.querySelector(".main-nav__list");

document.querySelector(".main-nav__toggle").addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("open");
});

document.addEventListener("click", () => menu.classList.remove("open"));

menu.addEventListener("click", (e) => e.stopPropagation());

document.querySelector(".submenu__list-dropdown").addEventListener("click", () => {
  document.querySelector(".submenu__list").classList.toggle("open");
});

const editListName = (e) => {
  e.stopPropagation();
  let previousName = e.target.parentNode.parentNode.firstChild;
  if (previousName.tagName === "INPUT") return;
  previousName.classList.add("invisible");
  let input = document.createElement("input");
  input.value = previousName.textContent;
  input.classList.add("edit");
  input.addEventListener("click", saveListName);
  input.addEventListener("keypress", saveListName);
  previousName.parentNode.prepend(input);
  document.addEventListener("click", cancelEdit);
  input.select();
};

const cancelEdit = (e) => {
  e.stopPropagation();
  document.removeEventListener("click", cancelEdit);
  if (document.querySelector(".invisible") !== null) {
    document.querySelector(".invisible").classList.remove("invisible");
  }
  if (document.querySelector(".edit") !== null) {
    document.querySelector(".edit").remove();
  }
};

const saveListName = (e) => {
  if (e.target.value.length > 0 && (e.keyCode === 13 || e.type === "click")) {
    let currentName = e.target.parentNode.childNodes[1];
    currentName.textContent = e.target.value;
    e.target.remove();
    currentName.classList.remove("invisible");
  }
};

const removeList = (e) => e.target.parentNode.parentNode.remove();

const addListForm = document.getElementById("add-list");
addListForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let listName = addListForm[0].value.trim();

  if (listName === "") {
    if (localStorage.getItem("language") === "polish") {
      listName = "Nowa lista";
    } else {
      listName = "New list";
    }
  }
  let li = document.createElement("li");
  li.innerHTML = `<a class="all-lists__link" href="">${listName}</a><span><i class="manage-list fa-solid fa-pen"></i><i class="manage-list fa-solid fa-trash"><span></i>`;
  li.classList.add("all-lists__item", "btn");
  document.querySelector(".all-lists__list").appendChild(li);
  li.childNodes[1].childNodes[0].addEventListener("click", editListName);
  li.childNodes[1].childNodes[1].addEventListener("click", removeList);
});

/* dark mode */
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

/* languages */
const languages = {
  en: {
    shoppinglist: "Shopping List",
    lists: "Lists",
    settings: "Settings",
    language: "Language",
    darkmode: "Dark mode",
    recyclebin: "Recycle bin",
    yourlists: "Your lists",
    add: "Add",
  },
  pl: {
    shoppinglist: "Lista Zakupów",
    lists: "Listy",
    settings: "Ustawienia",
    language: "Język",
    darkmode: "Tryb ciemny",
    recyclebin: "Kosz",
    yourlists: "Twoje listy",
    add: "Dodaj",
  },
};

const switchToPolish = document.querySelector(".fi-pl");
const switchToEnglish = document.querySelector(".fi-us");

const setPolishLanguage = () => {
  localStorage.setItem("language", "polish");
  switchToPolish.classList.add("selected");
  switchToEnglish.classList.remove("selected");
  Object.keys(languages.pl).forEach((key) => (document.getElementById(key).textContent = languages.pl[key]));
};

switchToPolish.addEventListener("click", setPolishLanguage);

if (localStorage.getItem("language") === "polish") {
  setPolishLanguage();
}

switchToEnglish.addEventListener("click", () => {
  localStorage.setItem("language", "english");
  switchToPolish.classList.remove("selected");
  switchToEnglish.classList.add("selected");
  Object.keys(languages.en).forEach((key) => (document.getElementById(key).textContent = languages.en[key]));
});
