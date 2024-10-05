import { createContext, useContext } from "react";
import type { RegisterFormData } from "../components/auth/sign-up";
import { LoginFormData } from "@/components/auth/login";

export type AuthContext = {
  authState: AuthState | null;
  register: (formData: RegisterFormData) => Promise<void>;
  login: (formData: LoginFormData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

export type AuthState = {
  userId: string;
  username: string;
  email: string;
  imageUrl: string | null;
};

export const AuthContext = createContext<AuthContext>({
  authState: null,
  register: () => Promise.resolve(),
  login: () => Promise.resolve(),
  logout: () => {},
  isAuthenticated: false,
});

export function useAuth() {
  return useContext(AuthContext);
}
