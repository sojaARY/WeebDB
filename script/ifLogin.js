//Finish later to hide button if not logged in
function ifLogin() {
  if (localStorage.getItem("isLogin") === "true") {
    document.getElementById("signupLogin").style.display = "none";
  } else {
    localStorage.setItem("isLogin") === "false";
    document.getElementById("addToList").style.display = "none";
    document.getElementById("signout").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", ifLogin);
