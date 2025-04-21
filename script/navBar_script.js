const searchBarItem = document.getElementById("searchBarItem");

function searchAnime() {
  let searchKey = searchBarItem.value.trim();
  if (searchKey) {
    sessionStorage.setItem("searchTerm", searchKey);
    window.location.href = "../html/searchAnime.html";
  }
}

searchBarItem.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchAnime();
  }
});
