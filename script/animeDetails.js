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

function addToListBtn() {
  if (localStorage.getItem("isLogin") === "false") {
    window.location.href = "../html/signup.html";
    return;
  }

  const currentUserEmail = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currUserIndex = users.findIndex(
    (user) => user.email === currentUserEmail
  );

  if (currUserIndex === -1) {
    console.error("Logged in user not found");
    return;
  }

  // Make sure userAnimeList exists and is an object
  if (
    !users[currUserIndex].userAnimeList ||
    typeof users[currUserIndex].userAnimeList !== "object" ||
    Array.isArray(users[currUserIndex].userAnimeList)
  ) {
    users[currUserIndex].userAnimeList = {}; // initialize
  }

  const userAnimeList = users[currUserIndex].userAnimeList;
  const hasAnime = anime_MalID in userAnimeList;

  const s1 = document.getElementById("img_n_addToList");
  const btn = document.createElement("button");
  btn.id = "addToList";
  btn.textContent = hasAnime ? "Remove from List" : "Add to List";

  btn.addEventListener("click", () => {
    const updatedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUser = updatedUsers.find(
      (user) => user.email === currentUserEmail
    );

    // Ensure userAnimeList exists
    if (
      !updatedUser.userAnimeList ||
      typeof updatedUser.userAnimeList !== "object" ||
      Array.isArray(updatedUser.userAnimeList)
    ) {
      updatedUser.userAnimeList = {};
    }

    if (anime_MalID in updatedUser.userAnimeList) {
      delete updatedUser.userAnimeList[anime_MalID];
      btn.textContent = "Add to List";
    } else {
      updatedUser.userAnimeList[anime_MalID] = {
        reviewTxt: "",
        reviewStatus: "",
      };
      btn.textContent = "Remove from List";
    }

    localStorage.setItem("users", JSON.stringify(updatedUsers));
  });

  s1.appendChild(btn);
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

  const reviewsToShow = Math.min(3, data.length);
  for (let i = 0; i < reviewsToShow; ++i) {
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

    const recommended = document.createElement("p");
    recommended.textContent = data[i].tags[0];
    recommended.classList.add("ml-auto");

    if (recommended.textContent === "Recommended") {
      recommended.style.color = "lime";
    } else {
      recommended.style.color = "red";
    }

    topRow.appendChild(userPfp);
    topRow.appendChild(userName);
    topRow.appendChild(recommended);
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
document.addEventListener("DOMContentLoaded", addToListBtn);
