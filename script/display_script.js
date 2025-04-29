async function fetchData() {
  let data;
  try {
    const response = await fetch(
      "https://api.jikan.moe/v4/recommendations/anime"
    ).then((temp) => temp.json());

    if (!response) {
      throw new Error("Failed to fetch API");
    }

    data = response;
  } catch (error) {
    console.error(error);
    return;
  }
  return data;
}

async function display(itemType) {
  const item = await fetchData();
  const listId = document.getElementById("list");

  item.data.forEach((item) => {
    const itemCardDiv = document.createElement("a");
    itemCardDiv.href = "#";
    itemCardDiv.classList = "item-card";

    itemCardDiv.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.setItem("selectedItem", item.mal_id);
    });

    const itemImgDiv = document.createElement("img");
    itemImgDiv.classList = "item-card-img";
    itemImgDiv.src = item.images.webp.image_url;
  });
}

//Item type is either anime or manga.
document.addEventListener("DOMContentLoaded", display(itemType));
