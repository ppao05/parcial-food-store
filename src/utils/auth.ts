export type Rol = "ADMIN" | "USUARIO";

export interface UsuarioSesion {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  celular: string;
  rol: Rol;
}

const USER_KEY = "usuarioLogueado";

export function getUsuarioLogueado(): UsuarioSesion | null {
  const data = localStorage.getItem(USER_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as UsuarioSesion;
}

export function requireAuth() {
  const usuario = getUsuarioLogueado();

  if (!usuario) {
    window.location.href = "/src/pages/auth/login/login.html";
    return null;
  }

  return usuario;
}

export function requireRole(rol: Rol) {
  const usuario = requireAuth();

  if (!usuario) {
    return null;
  }

  if (usuario.rol !== rol) {
    if (usuario.rol === "ADMIN") {
      window.location.href = "/src/pages/admin/home/home.html";
    } else {
      window.location.href = "/src/pages/store/home/home.html";
    }

    return null;
  }

  return usuario;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
  window.location.href = "/src/pages/auth/login/login.html";
}
