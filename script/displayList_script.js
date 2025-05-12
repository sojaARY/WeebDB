const ifUserLogin = () => {
  if (localStorage.getItem("isLogin") === "true") {
    document.getElementById("signupLogin").style.display = "none";
  } else {
    localStorage.removeItem("currentUser");
    window.location.href = "../html/signup.html";
  }
};

async function displayAnime() {
  ifUserLogin();

  const currentUserEmail = localStorage.getItem("currentUser");
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  const currentUser = allUsers.find((user) => user.email === currentUserEmail);

  const animeList = currentUser.userAnimeList;
  const listCont = document.getElementById("user-list");

  for (const animeID of Object.keys(animeList)) {
    try {
      const temp = await fetch(
        `https://api.jikan.moe/v4/anime/${animeID}`
      ).then((response) => response.json());

      const anime = await temp.data;

      const animeCardDiv = document.createElement("a");
      animeCardDiv.href = "#";
      animeCardDiv.classList = "item-card";

      animeCardDiv.addEventListener("click", (event) => {
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

      listCont.appendChild(animeCardDiv);
      animeCardDiv.appendChild(animeImgDiv);
      animeCardDiv.appendChild(animeCardTextSectionDiv);
      animeCardTextSectionDiv.appendChild(animeCardHeadTextP);
      animeCardTextSectionDiv.appendChild(animeCardContentTextP);
    } catch (err) {
      console.error(`Error fetching anime ID ${animeID}:`, err);
    }
  }
}

document.addEventListener("DOMContentLoaded", displayAnime);
