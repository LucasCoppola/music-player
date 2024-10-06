import { createContext, useContext } from "react";
import type { RegisterFormData } from "../components/auth/sign-up";
import { LoginFormData } from "@/components/auth/login";

export type AuthContext = {
  authState: AuthState | null;
  register: (formData: RegisterFormData) => Promise<void>;
  login: (formData: LoginFormData) => Promise<void>;
  logout: () => void;
};

export type AuthState = {
  userId: string;
  username: string;
  email: string;
  imageUrl: string | null;
  token: string | null;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContext>({
  authState: null,
  register: () => Promise.resolve(),
  login: () => Promise.resolve(),
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
