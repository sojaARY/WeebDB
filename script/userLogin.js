function userLogin() {
  const loginEmail = document.getElementById("email").value.trim();
  const loginPass = document.getElementById("password").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const loginUser = users.find(
    (user) => user.email === loginEmail && user.password === loginPass
  );

  if (loginUser) {
    localStorage.setItem("isLogin", true);
    document.getElementById("loginMsg").textContent = "Login successful";
    document.getElementById("loginMsg").style.color = "green";

    setTimeout(() => {
      window.location.href = "../html/frontpg.html";
    }, 1000);
  } else {
    document.getElementById("loginMsg").textContent = "Wrong email or password";
    document.getElementById("loginMsg").style.color = "red";
  }
}
