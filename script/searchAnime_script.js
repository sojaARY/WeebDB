async function submitTerm() {
  let data;
  try {
    const searchTerm = sessionStorage.getItem("searchTerm");

    data = await fetch(
      `https://api.jikan.moe/v4/anime?q=${searchTerm}&page=1`
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch API");
      }
      return response.json();
    });
  } catch (error) {
    console.error(error);
    return;
  }
  return data;
}

async function displayAnime() {
  const data = await submitTerm();
  if (!data || !data.data) {
    console.error("Empty search results.");
    return;
  }

  const animeListId = document.getElementById("anime-list");
  animeListId.innerHTML = ""; 

  
  let animeArray = data.data;

  
  document.getElementById("sortDropdown").addEventListener("change", function () {
    const sortType = this.value;

    animeArray.sort((a, b) => {
      switch (sortType) {
        case "popularity":
          return a.popularity - b.popularity; 
        case "release_asc":
          return new Date(a.aired.from || "1900-01-01") - new Date(b.aired.from || "1900-01-01");
        case "release_desc":
          return new Date(b.aired.from || "1900-01-01") - new Date(a.aired.from || "1900-01-01");
        case "rating_asc":
          return (a.score || 0) - (b.score || 0);
        case "rating_desc":
          return (b.score || 0) - (a.score || 0);
        default:
          return 0;
      }
    });

    renderAnimeList(animeArray); 
  });

  renderAnimeList(animeArray); 
}

function renderAnimeList(animeList) {
  const animeListId = document.getElementById("anime-list");
  animeListId.innerHTML = "";

  animeList.forEach((anime) => {
    const animeCardDiv = document.createElement("a");
    animeCardDiv.href = "#";
    animeCardDiv.classList = "item-card";
    animeCardDiv.setAttribute("data-release", anime.aired?.from || "1900-01-01");
    animeCardDiv.setAttribute("data-rating", anime.score || "0");

    anime.genres.forEach((genre) => {
      animeCardDiv.classList.add(`genre-${genre.mal_id}`);
    });

    animeCardDiv.addEventListener("click", (event) => {
      event.preventDefault();
      sessionStorage.setItem("selectedAnimeItem", anime.mal_id);
      window.location.href = "../html/animeDetails.html";
    });

    const animeImgDiv = document.createElement("img");
    animeImgDiv.classList = "item-card-img";
    animeImgDiv.src = anime.images?.jpg?.image_url || "default.jpg";

    const animeCardTextSectionDiv = document.createElement("div");
    animeCardTextSectionDiv.classList = "item-card-text-section";

    const animeCardHeadTextP = document.createElement("p");
    animeCardHeadTextP.classList = "item-card-h-text";
    animeCardHeadTextP.textContent = anime.title;

    const animeCardContentTextP = document.createElement("p");
    animeCardContentTextP.classList = "item-card-c-text";
    animeCardContentTextP.textContent =
      anime.synopsis?.length > 300
        ? anime.synopsis.slice(0, 300) + "..."
        : anime.synopsis || "No synopsis available.";

    animeListId.appendChild(animeCardDiv);
    animeCardDiv.appendChild(animeImgDiv);
    animeCardDiv.appendChild(animeCardTextSectionDiv);
    animeCardTextSectionDiv.appendChild(animeCardHeadTextP);
    animeCardTextSectionDiv.appendChild(animeCardContentTextP);
  });
}



document.addEventListener("DOMContentLoaded", displayAnime());
