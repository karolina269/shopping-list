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

  const saveListName = (e) => {
    if (e.target.value.length > 0 && (e.code === "Enter" || e.type === "click")) {
      let newName = e.target.value;
      let listLink = e.target.parentNode.childNodes[1];
      listLink.textContent = newName;
      let key = e.target.parentNode.dataset.key;
      for (let list of lists) {
        if (list.id == key) {
          list.name = newName;
          localStorage.setItem("lists", JSON.stringify(lists));
          break;
        }
      }
      e.target.remove();
      listLink.classList.remove("invisible");
      document.removeEventListener("click", cancelEdit);
    }
  };

  const removeList = (e) => {
    let li = e.target.parentNode.parentNode;
    let key = li.dataset.key;
    li.remove();
    for (let list of lists) {
      if (list.id == key) {
        list.isRemoved = true;
        localStorage.setItem("lists", JSON.stringify(lists));
        break;
      }
    }
  };

  const renderList = (list) => {
    let li = document.createElement("li");
    li.innerHTML = `<a class="lists__link" href="singlelist.html">${list.name}</a>
    <span><i class="manage-list fa-solid fa-pen"></i><i class="manage-list fa-solid fa-trash"></i></span>`;
    li.classList.add("lists__item");
    li.dataset.key = list.id;
    document.querySelector(".lists__list").appendChild(li);
    let editBtn = li.childNodes[2].childNodes[0];
    let removeBtn = li.childNodes[2].childNodes[1];
    editBtn.addEventListener("click", editListName);
    removeBtn.addEventListener("click", removeList);
    let link = li.childNodes[0];
    link.addEventListener("click", viewList);
  };

  const viewList = (e) => {
    let id = e.target.parentNode.dataset.key;
    localStorage.setItem("viewed", id);
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
      isRemoved: false,
      items: [],
    };
    renderList(list);
    lists.push(list);
    localStorage.setItem("lists", JSON.stringify(lists));
    addList[0].value = "";
  });

  lists.forEach((list) => {
    if (list.isRemoved === false) {
      renderList(list);
    }
  });
}

/* Removed lists */
if (document.title === "Removed Lists") {
  const restoreList = (e) => {
    let li = e.target.parentNode.parentNode;
    let key = li.dataset.key;
    li.remove();
    for (let list of lists) {
      if (list.id == key) {
        list.isRemoved = false;
        localStorage.setItem("lists", JSON.stringify(lists));
        break;
      }
    }
  };

  const removeListPermanently = (e) => {
    let li = e.target.parentNode.parentNode;
    let key = li.dataset.key;
    lists = lists.filter((list) => list.id != key);
    localStorage.setItem("lists", JSON.stringify(lists));
    li.remove();
  };

  const renderRemovedLists = (lists) => {
    lists.forEach((list) => {
      if (list.isRemoved === true) {
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
      }
    });
  };
  renderRemovedLists(lists);
}

/* Single list */
if (document.title === "Single List") {
  let id = localStorage.getItem("viewed");

  let listTitle = document.querySelector(".list__name");
  for (list of lists) {
    if (list.id == id) {
      listTitle.textContent = list.name;
      if (list.items.length === 0) {
        document.querySelector(".list-empty").classList.remove("hide");
      }
      break;
    }
  }

  const editItemName = (e) => {
    e.stopPropagation();
    let previousNameSpan = e.target.parentNode.parentNode.childNodes[0].childNodes[1];
    if (previousNameSpan.tagName === "INPUT") return;
    previousNameSpan.classList.add("invisible");
    let input = document.createElement("input");
    input.value = previousNameSpan.textContent;
    input.classList.add("edit");
    input.addEventListener("click", saveItemName);
    input.addEventListener("keypress", saveItemName);
    let checkbox = previousNameSpan.parentNode.childNodes[0];
    checkbox.after(input);
    document.addEventListener("click", cancelEdit);
    input.select();
  };

  const saveItemName = (e) => {
    if (e.target.value.length > 0 && (e.code === "Enter" || e.type === "click")) {
      let newName = e.target.value;
      let itemNameSpan = e.target.parentNode.childNodes[2];
      itemNameSpan.textContent = newName;
      let key = e.target.parentNode.parentNode.dataset.key;
      for (list of lists) {
        for (item of list.items) {
          if (item.id == key) {
            item.name = newName;
            localStorage.setItem("lists", JSON.stringify(lists));
            break;
          }
        }
      }
      e.target.remove();
      itemNameSpan.classList.remove("invisible");
      document.removeEventListener("click", cancelEdit);
    }
  };

  const removeItem = (e) => {
    let li = e.target.parentNode.parentNode;
    let key = li.dataset.key;
    if (li.parentNode.nodeName === "UL") {
      document.querySelector(".list-empty").classList.remove("hide");
    }
    li.remove();
    for (let list of lists) {
      list.items = list.items.filter((item) => {
        item.id != key;
      });
    }
    localStorage.setItem("lists", JSON.stringify(lists));
  };

  const toggleIsPurchased = (e) => {
    let li = e.target.parentNode.parentNode;
    li.classList.toggle("purchased");
    let key = li.dataset.key;
    for (list of lists) {
      for (item of list.items) {
        if (item.id == key) {
          item.isPurchased = !item.isPurchased;
          localStorage.setItem("lists", JSON.stringify(lists));
          break;
        }
      }
    }
  };

  const renderItem = (item) => {
    let li = document.createElement("li");
    li.innerHTML = `<div><input type="checkbox"><span>${item.name}</span></div>
  <span><i class="manage-list fa-solid fa-pen"></i><i class="manage-list fa-solid fa-trash"></i></span>`;
    li.classList.add("list__item");
    li.dataset.key = item.id;
    document.querySelector(".list__content").appendChild(li);
    let checkbox = li.childNodes[0].childNodes[0];
    if (item.isPurchased === true) {
      checkbox.setAttribute("checked", "");
      li.classList.add("purchased");
    }
    checkbox.addEventListener("click", toggleIsPurchased);
    let editBtn = li.childNodes[2].childNodes[0];
    let removeBtn = li.childNodes[2].childNodes[1];
    editBtn.addEventListener("click", editItemName);
    removeBtn.addEventListener("click", removeItem);
  };

  for (let list of lists) {
    if (list.id == id) {
      list.items.forEach((item) => renderItem(item));
      break;
    }
  }

  let addItem = document.getElementById("add-item");
  addItem.addEventListener("submit", (e) => {
    e.preventDefault();

    let itemName = addItem[0].value.trim();

    if (itemName === "") {
      addItem[0].classList.add("error");
      return;
    } else {
      addItem[0].classList.remove("error");
    }

    let newItem = {
      id: new Date().getTime(),
      name: itemName,
      isPurchased: false,
    };

    for (let list of lists) {
      if (list.id == id) {
        list.items.push(newItem);
        localStorage.setItem("lists", JSON.stringify(lists));
        break;
      }
    }
    renderItem(newItem);
    addItem[0].value = "";
    document.querySelector(".list-empty").classList.add("hide");
  });
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
    emptylist: "Your list is empty",
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
    emptylist: "Twoja lista jest pusta",
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
