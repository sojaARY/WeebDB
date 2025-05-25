//Finish later to hide button if not logged in
function ifLogin() {
  if (localStorage.getItem("isLogin") === "true") {
    document.getElementById("signupLogin").textContent = "Signout";
    document.getElementById("signupLogin").addEventListener("click", () => {
      localStorage.setItem("isLogin", "false");
      window.location.href = "../html/frontpg.html";
    });
  } else {
    document.getElementById("signupLogin").textContent = "Login/Signup";
    localStorage.setItem("isLogin", "false");
    document.getElementById("signupLogin").addEventListener("click", () => {
      window.location.href = "../html/signup.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", ifLogin);

//wubba