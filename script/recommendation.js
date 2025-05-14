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
  
  async function fetchAnimeDetails(animeId) {
    try {
      const animeDetails = await fetchAPI(`https://api.jikan.moe/v4/anime/${animeId}`);
      if (!animeDetails) {
        console.error("No anime details found");
        return;
      }
      return animeDetails[0];  
    } catch (err) {
      console.error("Error fetching anime details:", err);
      return;
    }
  }
  
  async function displayRecommendations(itemDiv, animeId) {
    try {
      const recommendations = await fetchAPI(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`);
      if (!recommendations) {
        console.error("No recommendations found");
        return;
      }
  
      itemDiv.innerHTML = "";
  
      
      const itemCont = recommendations.slice(0, 12);
  
      itemCont.forEach((rec) => {
        const thumbnailDiv = document.createElement("a");
        thumbnailDiv.href = "#";
  
        thumbnailDiv.addEventListener("click", (e) => {
          e.preventDefault();
          const selectedAnimeId = rec.entry.mal_id;  
          sessionStorage.setItem("selectedAnimeItem", selectedAnimeId);  
         
          fetchAnimeDetails(selectedAnimeId).then((animeDetails) => {
            if (animeDetails) {
              const selectedAnimeTitle = animeDetails.title;  
              sessionStorage.setItem("selectedAnimeTitle", selectedAnimeTitle);  
            }
          });
  
          window.location.href = "../html/animeDetails.html";  
        });
  
        const thumbnail = document.createElement("img");
        thumbnail.src = rec.entry.images.webp.large_image_url;
        thumbnail.alt = rec.entry.title;
        thumbnail.title = rec.entry.title;
        thumbnailDiv.appendChild(thumbnail);
        itemDiv.appendChild(thumbnailDiv);
      });
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    }
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    const selectedAnimeId = sessionStorage.getItem("selectedAnimeItem");
    const recommendationSection = document.getElementById("recommendation-section");
    const recommendationTrack = document.getElementById("track4");
    const titleElement = document.getElementById("recommendation-title");
  
    if (!selectedAnimeId) {
      recommendationSection.classList.add("hidden");
      return;
    }
  
    
    displayRecommendations(recommendationTrack, selectedAnimeId);
  
    
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${selectedAnimeId}`);
      if (!res.ok) throw new Error("Failed to fetch anime title");
      const data = await res.json();
      const animeTitle = data.data.title;
  
     
      titleElement.textContent = `Because you liked ${animeTitle}`;
    } catch (err) {
      console.error("Error loading anime title:", err);
      titleElement.textContent = "Because you liked this anime"; 
    }
  
    recommendationSection.classList.remove("hidden");
  });
  
  