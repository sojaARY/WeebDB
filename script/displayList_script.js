const ifUserLogin = () => {
  if (localStorage.getItem("isLogin") === "true") {
    document.getElementById("signupLogin").style.display = "none";
  } else {
    localStorage.removeItem("currentUser");
    window.location.href = "../html/signup.html";
  }
};

function migrateUserAnimeListFormat() {
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  let modified = false;

  for (let user of allUsers) {
    const list = user.userAnimeList;

    if (list && !list["Default"]) {
      user.userAnimeList = { "Default": list };
      modified = true;
    }
  }

  if (modified) {
    localStorage.setItem("users", JSON.stringify(allUsers));
  }
}

// Add new category
function addNewCategory() {
  const input = document.getElementById("newCategoryName");
  const newCategory = input.value.trim();
  if (!newCategory) return alert("Please enter a category name");

  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const currentUserEmail = localStorage.getItem("currentUser");
  const currentUser = allUsers.find((user) => user.email === currentUserEmail);

  if (!currentUser.userAnimeList[newCategory]) {
    currentUser.userAnimeList[newCategory] = {};
    localStorage.setItem("users", JSON.stringify(allUsers));
    input.value = "";
    updateCategoryDropdown(newCategory);
    displayAnime(newCategory);
  } else {
    alert("Category already exists");
  }
}

// Move to other category
function moveAnimeToCategory(animeID, newCategory) {
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const currentUserEmail = localStorage.getItem("currentUser");
  const currentUser = allUsers.find((user) => user.email === currentUserEmail);
  const userAnimeList = currentUser.userAnimeList;

  for (const category in userAnimeList) {
    if (animeID in userAnimeList[category]) {
      const animeData = userAnimeList[category][animeID];
      delete userAnimeList[category][animeID];

      if (!userAnimeList[newCategory]) userAnimeList[newCategory] = {};
      userAnimeList[newCategory][animeID] = animeData;
      break;
    }
  }

  localStorage.setItem("users", JSON.stringify(allUsers));
  displayAnime(newCategory);
}

// select dropdown
function updateCategoryDropdown(selectedCategory = "Default") {
  const currentUserEmail = localStorage.getItem("currentUser");
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = allUsers.find((user) => user.email === currentUserEmail);
  const userAnimeList = currentUser?.userAnimeList || {};
  const categorySelect = document.getElementById("categorySelect");

  categorySelect.innerHTML = "";
  for (let cat of Object.keys(userAnimeList)) {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selectedCategory) option.selected = true;
    categorySelect.appendChild(option);
  }
}

async function displayAnime(selectedCategory = "Default") {
  ifUserLogin();
  migrateUserAnimeListFormat();

  updateCategoryDropdown(selectedCategory);

  const currentUserEmail = localStorage.getItem("currentUser");
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = allUsers.find((user) => user.email === currentUserEmail);
  const animeList = currentUser.userAnimeList?.[selectedCategory] || {};
  const listCont = document.getElementById("user-list");
  listCont.innerHTML = "";

  for (const animeID of Object.keys(animeList)) {
    try {
      const temp = await fetch(
        `https://api.jikan.moe/v4/anime/${animeID}`
      ).then((response) => response.json());

      const anime = temp.data;

      const animeCardDiv = document.createElement("div");
      animeCardDiv.classList = "item-card";

      const animeLink = document.createElement("a");
      animeLink.href = "#";
      animeLink.addEventListener("click", (event) => {
        event.preventDefault();
        sessionStorage.setItem("selectedAnimeItem", anime.mal_id);
        window.location.href = "../html/animeDetails.html";
      });

      const animeImgDiv = document.createElement("img");
      animeImgDiv.classList = "item-card-img";
      animeImgDiv.src = anime.images.jpg.image_url;

      const animeCardTextSectionDiv = document.createElement("div");
      animeCardTextSectionDiv.classList = "item-card-text-section";

      const animeCardHeadTextP = document.createElement("p");
      animeCardHeadTextP.classList = "item-card-h-text";
      animeCardHeadTextP.textContent = anime.title;

      const animeCardContentTextP = document.createElement("p");
      animeCardContentTextP.classList = "item-card-c-text";
      animeCardContentTextP.textContent = anime.synopsis
        ? anime.synopsis.split(" ").slice(0, 47).join(" ") +
          (anime.synopsis.split(" ").length > 50 ? "..." : "")
        : "No synopsis available.";

      // Move dropdown
      const moveDropdown = document.createElement("select");
      moveDropdown.innerHTML = `<option disabled selected>Move to...</option>`;
      Object.keys(currentUser.userAnimeList).forEach((cat) => {
        if (cat !== selectedCategory) {
          const option = document.createElement("option");
          option.value = cat;
          option.textContent = cat;
          moveDropdown.appendChild(option);
        }
      });
      moveDropdown.addEventListener("change", (e) => {
        moveAnimeToCategory(animeID, e.target.value);
      });

      animeCardTextSectionDiv.appendChild(animeCardHeadTextP);
      animeCardTextSectionDiv.appendChild(animeCardContentTextP);

      animeLink.appendChild(animeImgDiv);
      animeLink.appendChild(animeCardTextSectionDiv);

      animeCardDiv.appendChild(animeLink);
      animeCardDiv.appendChild(moveDropdown);

      listCont.appendChild(animeCardDiv);
    } catch (err) {
      console.error(`Error fetching anime ID ${animeID}:`, err);
    }
  }
}

function deleteCurrentCategory() {
  const categoryToDelete = document.getElementById("categorySelect").value;

  if (categoryToDelete === "Default") {
    alert("You cannot delete the Default category.");
    return;
  }

  const confirmDelete = confirm(`Are you sure you want to delete "${categoryToDelete}"?`);

  if (!confirmDelete) return;

  const currentUserEmail = localStorage.getItem("currentUser");
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = allUsers.find((user) => user.email === currentUserEmail);

  delete currentUser.userAnimeList[categoryToDelete];

  localStorage.setItem("users", JSON.stringify(allUsers));

  displayAnime("Default");
}


document.addEventListener("DOMContentLoaded", () => displayAnime());

