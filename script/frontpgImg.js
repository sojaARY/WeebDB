const popularAnime = document.getElementById("track1");

async function fetchAPI() {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/recommendations/anime`);
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

async function popularAnimeDisplay() {
  const anime = await fetchAPI();
  if (!anime) {
    console.error("No anime data available");
    return;
  }

  const animeItems = anime.slice(0, 12);

  animeItems.forEach((item) => {
    const thumbnailLink = document.createElement("a");
    thumbnailLink.href = item.entry[0].url;

    const thumbnail = document.createElement("img");
    thumbnail.src = item.entry[0].images.webp.image_url;
    thumbnail.alt = item.entry[0].title;
    thumbnailLink.appendChild(thumbnail);
    popularAnime.appendChild(thumbnailLink);
  });
}

document.addEventListener("DOMContentLoaded", popularAnimeDisplay);
