async function fetchAPI(searchURL) {
  try {
    const res = await fetch(searchURL);
    if (!res.ok) {
      throw new Error("Failed to fetch API");
    }
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("Error fetching data:", err);
    return;
  }
}

async function displayItems(itemDiv, searchURL) {
  const series = await fetchAPI(searchURL);
  if (!series) {
    console.error("No series data available to display");
  }
  itemDiv.innerHTML = "";

  const itemCont = series.slice(0, 4);
  itemCont.forEach((item) => {
    const thumbnailDiv = document.createElement("a");
    thumbnailDiv.href = "#";

    thumbnailDiv.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.setItem("selectedAnimeItem", item.mal_id);
      window.location.href = "../html/animeDetails.html";
    });

    const thumbnail = document.createElement("img");
    thumbnail.src = item.images.webp.large_image_url;
    thumbnail.alt = item.title;
    thumbnailDiv.appendChild(thumbnail);
    itemDiv.appendChild(thumbnailDiv);
  });
}

const popularAnime = document.getElementById("track1");
const seasonalAnime = document.getElementById("track2");
const publishingManga = document.getElementById("track3");
async function displayCall() {
  displayItems(
    popularAnime,
    "https://api.jikan.moe/v4/top/anime?filter=airing"
  );
  displayItems(seasonalAnime, "https://api.jikan.moe/v4/seasons/now");
  displayItems(
    publishingManga,
    "https://api.jikan.moe/v4/top/manga?filter=publishing"
  );
}

document.addEventListener("DOMContentLoaded", displayCall);
