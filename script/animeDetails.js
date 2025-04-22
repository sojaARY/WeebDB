const anime_MalID = sessionStorage.getItem("selectedAnimeItem");

const animeInfoFetch = async () => {
  if (!anime_MalID) {
    console.error("No selected item");
    return;
  }

  let data;
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime/${anime_MalID}`
    ).then((item) => item.json());
    data = response;
    // console.log(data); Debugging
  } catch (error) {
    console.error(
      "selectedAnimeItem sessionStorage is either empty or failed to fetch"
    );
    return;
  }
  return data.data;
};

async function animeInfo() {
  const anime = await animeInfoFetch();

  if (!anime) {
    window.location.href = "../html/frontpg.html";
  }

  //1st Section - (Img, button, title, & studio)
  const thumbnail = document.getElementById("anime-img");
  thumbnail.src = anime.images.webp.large_image_url;

  const title = document.getElementById("title-text");
  title.textContent = anime.titles[0].title;

  const studioList = document.getElementById("studio-text");
  anime.studios.forEach((studio) => {
    const studioItem = document.createElement("p");
    studioItem.textContent = "• " + studio.name;
    studioList.appendChild(studioItem);
  });

  //2nd Section (Synopsis)
  const synopsis = document.getElementById("synopsis");
  synopsis.textContent = anime.synopsis;
}

function addToList() {
  const btn = document.getElementById("addToList");

  let userAnimeList = JSON.parse(localStorage.getItem("userAnimeList")) || [];
  const index = userAnimeList.indexOf(anime_MalID);

  if (index === -1) {
    btn.textContent = "Remove from List";
    userAnimeList.push(anime_MalID);
  } else {
    btn.textContent = "Add to List";
    userAnimeList.splice(index, 1);
  }

  localStorage.setItem("userAnimeList", JSON.stringify(userAnimeList));
}

document.addEventListener("DOMContentLoaded", animeInfo());
document.getElementById("addToList").addEventListener("click", addToList);
