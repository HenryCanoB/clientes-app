import type { AuthResponse, LoginCredentials, User } from "./auth.types";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const USERS_URL = `https://${API_TOKEN}.mockapi.io/api/v1/customers`;

export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await fetch(USERS_URL);
    if (!response.ok) throw new Error("Error al conectar con el servidor");

    const users = (await response.json()) as User[];

    const user = users.find(
      (u: User) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error("Credenciales incorrectas");
    }

    const token = btoa(`${user.email}:${Date.now()}`);
    const refreshToken = btoa(`refresh:${user.email}:${Date.now()}`);

    const authUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      createdAt: user.createdAt,
      password: user.password,
    };

    return {
      user: authUser,
      token,
      refreshToken,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de autenticación");
  }
};

export const logoutUser = async (): Promise<void> => {
  return Promise.resolve();
};

export const getCurrentUser = async (token: string): Promise<User> => {
  try {
    const decoded = atob(token);
    const email = decoded.split(":")[0];

    const response = await fetch(USERS_URL);
    if (!response.ok) throw new Error("Error al obtener usuario");
    const users = (await response.json()) as User[];
    const user = users.find((u: User) => u.email === email);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      createdAt: user.createdAt,
      password: user.password,
    };
  } catch {
    throw new Error("Token invalido");
  }
};

export const refreshToken = async (token: string): Promise<string> => {
  try {
    const decoded = atob(token);
    const email = decoded.split(":")[1];

    return btoa(`${email}:${Date.now()}`);
  } catch {
    throw new Error("No se pudo renovar la sesion");
  }
};