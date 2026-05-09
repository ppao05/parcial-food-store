import "../../../style.css";

const form = document.getElementById("login-form") as HTMLFormElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = (
    document.getElementById("email") as HTMLInputElement
  ).value;

  const password = (
    document.getElementById("password") as HTMLInputElement
  ).value;

  // ADMIN
  if (email === "admin@gmail.com" && password === "1234") {
    window.location.href = "../../admin/home/home.html";
    return;
  }

  // CLIENTE
  if (email === "user@gmail.com" && password === "1234") {
    window.location.href = "../../store/home/home.html";
    return;
  }

  alert("Credenciales incorrectas");
});