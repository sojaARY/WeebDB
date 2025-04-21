const anime_MalID = sessionStorage.getItem("selectedAnimeItem");
const animeInfoFetch = async () => {
  let data;
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime/${anime_MalID}`
    ).then((item) => item.json());
    data = response;
    console.log(data);
  } catch (error) {
    console.error(
      "selectedAnimeItem sessionStorage is either empty or failed to fetch"
    );
    return;
  }
  return data;
};

async function animeInfo() {
  const anime = await animeInfoFetch();

  //1st Section
  const thumbnail = document.getElementById("anime-img");
  const title = document.getElementById("title-text");
  const studioList = document.getElementById("studio-text");
}

document.addEventListener("DOMContentLoaded", animeInfo()); //Add function to load
