import "../../../style.css";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  celular: string;
  rol: "ADMIN" | "USUARIO";
  password: string;
}

const form = document.getElementById("login-form") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = (document.getElementById("email") as HTMLInputElement).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement).value.trim();

  if (!email || !password) {
    alert("Completá email y contraseña");
    return;
  }

  try {
    const response = await fetch("/data/usuarios.json");

    if (!response.ok) {
      throw new Error("No se pudo cargar usuarios.json");
    }

    const usuarios: Usuario[] = await response.json();

    const usuario = usuarios.find(
      (u) => u.mail === email && u.password === password
    );

    if (!usuario) {
      alert("Credenciales incorrectas o usuario inexistente");
      return;
    }

    const { password: _, ...usuarioSinPassword } = usuario;

    localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioSinPassword));

    if (usuario.rol === "ADMIN") {
      window.location.href = "../../admin/home/home.html";
    } else {
      window.location.href = "../../store/home/home.html";
    }
  } catch (error) {
    console.error(error);
    alert("Ocurrió un error al iniciar sesión");
  }
});