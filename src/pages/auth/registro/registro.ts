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

const form = document.getElementById("register-form") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = (document.getElementById("name") as HTMLInputElement).value.trim();
  const apellido = (document.getElementById("lastname") as HTMLInputElement).value.trim();
  const mail = (document.getElementById("email") as HTMLInputElement).value.trim();
  const celular = (document.getElementById("phone") as HTMLInputElement).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement).value.trim();

  if (!nombre || !apellido || !mail || !celular || !password) {
    alert("Completá todos los campos");
    return;
  }

  if (!mail.includes("@") || !mail.includes(".")) {
    alert("Ingresá un email válido");
    return;
  }

  if (password.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  try {
    const response = await fetch("/data/usuarios.json");

    if (!response.ok) {
      throw new Error("No se pudo cargar usuarios.json");
    }

    const usuarios: Usuario[] = await response.json();

    const existeUsuario = usuarios.some((u) => u.mail === mail);

    if (existeUsuario) {
      alert("Ya existe un usuario registrado con ese email");
      return;
    }

    const nuevoId =
      usuarios.length > 0
        ? Math.max(...usuarios.map((u) => u.id)) + 1
        : 1;

    const nuevoUsuario: Usuario = {
      id: nuevoId,
      nombre,
      apellido,
      mail,
      celular,
      rol: "USUARIO",
      password,
    };

    const { password: _, ...usuarioSinPassword } = nuevoUsuario;

    localStorage.setItem(
      "usuarioLogueado",
      JSON.stringify(usuarioSinPassword)
    );

    const usuariosLocales = JSON.parse(
      localStorage.getItem("usuariosLocal") || "[]"
    );

    usuariosLocales.push(nuevoUsuario);

    localStorage.setItem(
      "usuariosLocal",
      JSON.stringify(usuariosLocales)
    );

    alert("Registro exitoso");

    window.location.href = "../../store/home/home.html";
  } catch (error) {
    console.error(error);
    alert("Ocurrió un error al registrar el usuario");
  }
});