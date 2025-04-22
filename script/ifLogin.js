function ifLogin() {
  if (sessionStorage.getItem("isLogin") === "true") {
    document.getElementById("signupLogin").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", ifLogin());
