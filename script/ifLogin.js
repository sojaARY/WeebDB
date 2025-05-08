//Finish later to hide button if not logged in
function ifLogin() {
  if (localStorage.getItem("isLogin") === "true") {
    document.getElementById("signupLogin").style.display = "none";
  }else {
    localStorage.getItem("isLogin") === "true";
  }
  if (localStorage.getItem("isLogin") === NULL) {

  }
}

document.addEventListener("DOMContentLoaded", ifLogin);
