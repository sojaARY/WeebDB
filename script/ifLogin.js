function ifLogin() {
  if (localStorage.getItem("isLogin") === "true") {
    document.getElementById("signupLogin").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", ifLogin);
