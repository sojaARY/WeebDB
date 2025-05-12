function hideReview() {
  const addToListBtn = document.getElementById("addToList");
  const reviewArea = document.getElementById("reviewArea");
  const alert = document.getElementById("alert");

  function updateVisibility() {
    if (addToListBtn.textContent === "Add to List") {
      reviewArea.style.display = "none";
      alert.textContent =
        "(You must add the anime to your list to leave a review)";
    } else {
      reviewArea.style.display = "block";
      alert.textContent = "";
    }
  }

  updateVisibility();

  addToListBtn.addEventListener("click", updateVisibility);
}

function checkIfInList() {
  const selectedAnime = sessionStorage.getItem("selectedAnimeItem");
  const currUser = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users"));
  const user = users.find((u) => u.email === currUser);

  if (!user || typeof user.userAnimeList !== "object") {
    const reviewArea = document.getElementById("reviewArea");
    reviewArea.style.display = "none";
    return false;
  }

  return selectedAnime in user.userAnimeList;
}

function saveAnimeReview() {
  if (!checkIfInList()) {
    return;
  }
  const reviewTxt = document.getElementById("userReview").value;
  const reviewStatus = document.getElementById("reviewStatus").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = localStorage.getItem("currentUser");
  const currUserIndex = users.findIndex((user) => user.email === currentUser);

  if (
    typeof users[currUserIndex].userAnimeList !== "object" ||
    Array.isArray(users[currUserIndex].userAnimeList)
  ) {
    users[currUserIndex].userAnimeList = {};
  }

  const animeID = sessionStorage.getItem("selectedAnimeItem");

  users[currUserIndex].userAnimeList[animeID] = {
    reviewTxt: reviewTxt,
    reviewStatus: reviewStatus,
  };

  localStorage.setItem("users", JSON.stringify(users));
  location.reload();
}

function postAnimeReview() {
  const selectedAnime = sessionStorage.getItem("selectedAnimeItem");
  const currUser = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users"));
  const user = users.find((u) => u.email === currUser);

  if (!checkIfInList()) {
    return;
  }

  setTimeout(() => {}, 3000);

  const animeReviewDetails = user.userAnimeList[selectedAnime];

  const reviewTxt = animeReviewDetails.reviewTxt;
  const reviewStatus = animeReviewDetails.reviewStatus;

  const reviewSection = document.getElementById("reviewSection");

  const reviewDiv = document.createElement("div");
  reviewDiv.classList = "reviewDiv w-[100%]";
  const topRow = document.createElement("div");
  topRow.classList = "flex w-[100%] flex-row";

  const userPfp = document.createElement("img");
  userPfp.src = "https://avatar.iran.liara.run/public";
  userPfp.alt = "Your profile picture";
  userPfp.classList = "mr-10";

  const userName = document.createElement("h2");
  userName.textContent = "You";
  userName.classList = "usernameBG";

  const status = document.createElement("p");
  status.textContent = reviewStatus;
  status.classList = "ml-auto";
  if (status.textContent === "Recommended") {
    status.style.color = "lime";
  } else {
    status.style.color = "red";
  }

  const txt = document.createElement("p");
  txt.textContent = reviewTxt;

  topRow.appendChild(userPfp);
  topRow.appendChild(userName);
  topRow.appendChild(status);
  reviewDiv.appendChild(topRow);
  reviewDiv.appendChild(txt);
  reviewSection.appendChild(reviewDiv);
}

document.addEventListener("DOMContentLoaded", function () {
  hideReview();
  postAnimeReview();
});
