import React, { useEffect, useReducer } from "react";
import type { AuthState, User, LoginCredentials } from "../auth.types";
import { loginUser, logoutUser, getCurrentUser } from "../auth.service";
import { AuthContext } from "./useAuth";

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_TOKEN"; payload: string | null }
  | { type: "LOGOUT" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        isLoading: false,
      };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const TOKEN_KEY = "galaxy_auth_token";
const USER_KEY = "galaxy_auth_user";
const REMEMBER_KEY = "galaxy_remember_me";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const authResponse = await loginUser(credentials);

      // Store token and user
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, authResponse.token);
      storage.setItem(USER_KEY, JSON.stringify(authResponse.user));

      if (credentials.rememberMe) {
        localStorage.setItem(REMEMBER_KEY, "true");
      }

      dispatch({ type: "SET_TOKEN", payload: authResponse.token });
      dispatch({ type: "SET_USER", payload: authResponse.user });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      // Clear all storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REMEMBER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);

      dispatch({ type: "LOGOUT" });
    }
  };

  const checkAuth = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Check for stored token
      const rememberMe = localStorage.getItem(REMEMBER_KEY);
      const storage = rememberMe ? localStorage : sessionStorage;
      const token = storage.getItem(TOKEN_KEY);
      const storedUser = storage.getItem(USER_KEY);

      if (!token || !storedUser) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      // Check if token is expired
      const tokenData = atob(token);
      const timestamp = parseInt(tokenData.split(":")[1]);
      const now = Date.now();
      const maxAge = rememberMe
        ? 30 * 24 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000; // 30 days vs 24 hours

      if (now - timestamp > maxAge) {
        await logout();
        return;
      }

      // Validate token with server
      const user = await getCurrentUser(token);

      dispatch({ type: "SET_TOKEN", payload: token });
      dispatch({ type: "SET_USER", payload: user });
    } catch {
      await logout();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};