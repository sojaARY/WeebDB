function userSignUp() {
  const newEmail = document.getElementById("email").value.trim();
  const newPass = document.getElementById("password").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const existingUser = users.find((user) => user.email === newEmail);
  if (existingUser) {
    document.getElementById("registerMsg").textContent = "Email already taken";
    document.getElementById("registerMsg").style.color = "red";
  } else {
    const newUser = {
      email: newEmail,
      password: newPass,
    };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("registerMsg").textContent =
      "Registration successful";
    document.getElementById("registerMsg").style.color = "green";

    setTimeout(() => {
      window.location.href = "../html/login.html";
    }, 1000);
  }
  console.log(users);
}
