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

let lists = localStorage.getItem("lists") ? JSON.parse(localStorage.getItem("lists")) : [];
let removedLists = localStorage.getItem("removedLists") ? JSON.parse(localStorage.getItem("removedLists")) : [];

/* Lists main view */
if (document.title === "Shopping List") {
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

  const removeList = (e) => {
    let li = e.target.parentNode.parentNode.parentNode;
    let key = li.dataset.key;
    removedLists.push({ id: key, name: li.childNodes[0].textContent });
    localStorage.setItem("removedLists", JSON.stringify(removedLists));
    li.remove();
    lists = lists.filter((list) => list.id != key);
    localStorage.setItem("lists", JSON.stringify(lists));
  };

  //   const expandList = (e) => {
  //     console.log("rozwijam liste");
  //     let id = e.target.parentNode.parentNode.dataset.key;
  //     console.log(id);
  //     console.log(e.target.parentNode.parentNode);
  //     let ul = document.createElement("ul");
  //     ul.classList.add("list");
  //     ul.innerHTML = `<div class="lists__add">
  //     <form id="add-item">
  //         <input class="input-new" id="new-item">
  //         <button id="add-item" class="btn btn-add" type="submit">Add</button>
  //     </form>
  // </div>`;
  //     e.target.parentNode.parentNode.appendChild(ul);
  //   };

  const renderList = (list) => {
    let li = document.createElement("li");
    li.innerHTML = `<header class="list__header"><button class="lists__ref">${list.name}</button>
    <span><i class="manage-list fa-solid fa-pen"></i><i class="manage-list fa-solid fa-trash"></span></i></header>`;
    li.classList.add("lists__item");
    li.dataset.key = list.id;
    document.querySelector(".lists__list").appendChild(li);
    let listTitle = li.childNodes[0].childNodes[0];
    //list content dodac, klasa open gdy klikniete
    let editBtn = li.childNodes[0].childNodes[2].childNodes[0];
    let removeBtn = li.childNodes[0].childNodes[2].childNodes[1];
    // listTitle.addEventListener("click", expandList);
    editBtn.addEventListener("click", editListName);
    removeBtn.addEventListener("click", removeList);
  };

  let addList = document.getElementById("add-list");

  addList.addEventListener("submit", (e) => {
    e.preventDefault();

    let listName = addList[0].value.trim();

    if (listName === "") {
      if (localStorage.getItem("language") === "polish") {
        listName = "Nowa lista";
      } else {
        listName = "New list";
      }
    }
    let list = {
      id: new Date().getTime(),
      name: listName,
    };
    renderList(list);
    lists.push(list);
    localStorage.setItem("lists", JSON.stringify(lists));
    addList[0].value = "";
  });

  lists.forEach(renderList);
}

/* Removed Lists */
if (document.title === "Removed Lists") {
  const restoreList = (e) => {
    let li = e.target.parentNode.parentNode;
    let key = li.dataset.key;
    lists.push({ id: key, name: li.childNodes[0].textContent });
    localStorage.setItem("lists", JSON.stringify(lists));
    li.remove();
    removedLists = removedLists.filter((list) => list.id != key);
    localStorage.setItem("removedLists", JSON.stringify(removedLists));
  };

  const removeListPermanently = (e) => {
    let li = e.target.parentNode.parentNode;
    let key = li.dataset.key;
    removedLists = removedLists.filter((list) => list.id != key);
    localStorage.setItem("removedLists", JSON.stringify(removedLists));
    li.remove();
  };

  const renderRemovedLists = (removedLists) => {
    removedLists.forEach((list) => {
      let li = document.createElement("li");
      li.innerHTML = `<span>${list.name}</span>
    <span><i class="manage-list fa-solid fa-trash-arrow-up"></i><i class="manage-list fa-solid fa-trash" style="color: #b30009"></i></span>`;
      li.classList.add("lists__item", "lists__item-removed");
      li.dataset.key = list.id;
      document.querySelector(".lists__list").appendChild(li);
      let restoreBtn = li.childNodes[2].childNodes[0];
      let removeBtn = li.childNodes[2].childNodes[1];
      restoreBtn.addEventListener("click", restoreList);
      removeBtn.addEventListener("click", removeListPermanently);
    });
  };
  renderRemovedLists(removedLists);
}

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
    removedlists: "Removed Lists",
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
    removedlists: "Usunięte listy",
    add: "Dodaj",
  },
};

const switchToPolish = document.querySelector(".fi-pl");
const switchToEnglish = document.querySelector(".fi-us");

const setPolishLanguage = () => {
  localStorage.setItem("language", "polish");
  switchToPolish.classList.add("selected");
  switchToEnglish.classList.remove("selected");
  Object.keys(languages.pl).forEach((key) => {
    if (document.getElementById(key)) {
      document.getElementById(key).textContent = languages.pl[key];
    }
  });
};

switchToPolish.addEventListener("click", setPolishLanguage);

if (localStorage.getItem("language") === "polish") {
  setPolishLanguage();
}

const setEnglishLanguage = () => {
  localStorage.setItem("language", "english");
  switchToPolish.classList.remove("selected");
  switchToEnglish.classList.add("selected");
  Object.keys(languages.en).forEach((key) => {
    if (document.getElementById(key)) {
      document.getElementById(key).textContent = languages.en[key];
    }
  });
};

switchToEnglish.addEventListener("click", setEnglishLanguage);
