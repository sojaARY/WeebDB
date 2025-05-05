// drop down menu
fetch("https://api.jikan.moe/v4/genres/anime")
  .then(response => response.json())
  .then(info => {
    const genres = info.data;
    let text = `<select id="genreDropdown">`;
    text += `<option value="all">Show All</option>`;
    for (let i = 0; i < genres.length; i++) {
      text += `<option value="genre-${genres[i].mal_id}">${genres[i].name}</option>`;
    }
    text += "</select>";
    document.getElementById("filter").innerHTML = text;

    // filter
    document.getElementById("genreDropdown").addEventListener("change", function () {
      const selected = this.value;
      const cards = document.getElementsByClassName("item-card");

      for (let card of cards) {
        
        card.style.display = "none";

        
        if (selected === "all" || card.classList.contains(selected)) {
          card.style.display = "flex";
        }
      }
    });
  })
  .catch(error => {
    console.error("Error fetching genres:", error);
    document.getElementById("filter").textContent = "Failed to load genres.";
  });
