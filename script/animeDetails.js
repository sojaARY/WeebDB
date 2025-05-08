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
    return;
  }

  //1st Section - (Img, button, title, & studio)
  const thumbnail = document.getElementById("anime-img");
  thumbnail.src = anime.images.webp.large_image_url;

  const title = document.getElementById("title-text");
  title.textContent = anime.titles[0].title;

  const studioList = document.getElementById("studio-text");
  const ratingDisplay = document.createElement("Ratings:");
  ratingDisplay.textContent = `${anime.score} / 10`;
  studioList.appendChild(ratingDisplay);

  const studioTxt = document.createElement("p");
  studioTxt.classList = "font-bold pt-8";
  studioTxt.textContent = "Studio";
  studioList.appendChild(studioTxt);
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

async function displayReviews() {
  let data;
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime/${anime_MalID}/reviews`
    ).then((item) => item.json());
    data = res.data;

    if (!data || data.length === 0) {
      noReview();
      return;
    }
  } catch (error) {
    console.error(error);
    return;
  }

  const reviewSection = document.getElementById("reviewSection");

  for (let i = 0; i < 3; ++i) {
    const reviewDiv = document.createElement("div");
    reviewDiv.classList = "reviewDiv";

    const topRow = document.createElement("div");
    topRow.classList = "flex w-[100%] flex-row";

    const userPfp = document.createElement("img");
    userPfp.src = data[i].user.images.webp.image_url;
    userPfp.alt = `${data[i].user.username}'s Profile Picture`;
    userPfp.classList = "mr-10";

    const userName = document.createElement("h2");
    userName.textContent = data[i].user.username;

    topRow.appendChild(userPfp);
    topRow.appendChild(userName);
    reviewDiv.appendChild(topRow);

    const fullText = data[i].review;
    const maxLength = 500;

    const reviewContent = document.createElement("p");
    const toggleBtn = document.createElement("button");

    if (fullText.length > maxLength) {
      const shortText = fullText.substring(0, maxLength) + "...";

      reviewContent.textContent = shortText;
      toggleBtn.textContent = "Read More";

      toggleBtn.addEventListener("click", () => {
        const isCollapsed = reviewContent.textContent.endsWith("...");
        if (isCollapsed) {
          reviewContent.textContent = fullText;
          toggleBtn.textContent = "Show Less";
        } else {
          reviewContent.textContent = shortText;
          toggleBtn.textContent = "Read More";
        }
      });

      reviewDiv.appendChild(reviewContent);
      reviewDiv.appendChild(toggleBtn);
    } else {
      reviewContent.textContent = fullText;
      reviewDiv.appendChild(reviewContent);
    }

    reviewSection.appendChild(reviewDiv);
  }
}

function noReview() {
  const reviewDiv = document.createElement("div");
  reviewDiv.textContent = "No reviews yet";
  reviewDiv.classList = "flex justify-center self-center";
  reviewSection.appendChild(reviewDiv);
}

document.addEventListener("DOMContentLoaded", animeInfo);
document.addEventListener("DOMContentLoaded", displayReviews);
document.getElementById("addToList").addEventListener("click", addToList);
