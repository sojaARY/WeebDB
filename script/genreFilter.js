// Fetch and populate genre dropdown
fetch("https://api.jikan.moe/v4/genres/anime")
  .then((response) => response.json())
  .then((info) => {
    const genres = info.data;
    let text = `<select id="genreDropdown">`;
    text += `<option value="all">Show All</option>`;
    for (let genre of genres) {
      text += `<option value="genre-${genre.mal_id}">${genre.name}</option>`;
    }
    text += "</select>";
    document.getElementById("filter").innerHTML = text;
  })
  .catch((error) => {
    console.error("Error fetching genres:", error);
    document.getElementById("filter").textContent = "Failed to load genres.";
  });

// Unified filter function
function applyAllFilters() {
  const genreVal = document.getElementById("genreDropdown")?.value || "all";
  const releaseType = document.getElementById("releaseFilterType")?.value || "all";
  const releaseYear = parseInt(document.getElementById("releaseFilterYear")?.value);
  const ratingVal = document.getElementById("ratingFilter")?.value || "all";

  const cards = document.getElementsByClassName("item-card");

  for (let card of cards) {
    let match = true;

    // Genre
    if (genreVal !== "all" && !card.classList.contains(genreVal)) {
      match = false;
    }

    // Release Year
    const releaseDate = new Date(card.getAttribute("data-release"));
    const animeYear = releaseDate.getFullYear();
    if (!isNaN(releaseYear) && releaseType !== "all") {
      if (releaseType === "before" && !(animeYear < releaseYear)) match = false;
      else if (releaseType === "after" && !(animeYear > releaseYear)) match = false;
      else if (releaseType === "exact" && animeYear !== releaseYear) match = false;
    }

    // Rating
    const rating = parseFloat(card.getAttribute("data-rating"));
    if (ratingVal === "low" && rating >= 5) match = false;
    else if (ratingVal === "medium" && (rating < 5 || rating > 7)) match = false;
    else if (ratingVal === "high" && rating <= 7) match = false;

    card.style.display = match ? "flex" : "none";
  }
}

// Apply filters when input changes
document.addEventListener("input", (e) => {
  if (
    ["genreDropdown", "releaseFilterType", "releaseFilterYear", "ratingFilter"].includes(
      e.target.id
    )
  ) {
    applyAllFilters();
  }
});

