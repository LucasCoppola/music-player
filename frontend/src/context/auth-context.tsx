import { createContext, useState, useContext } from "react";

type AuthContext = {
  authState: AuthState;
  login: (token: string, username: string, email: string) => void;
  logout: () => void;
};

export type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  username: string | null;
  email: string | null;
};

const AuthContext = createContext<AuthContext>({
  authState: {
    isLoggedIn: false,
    token: null,
    username: null,
    email: null,
  },
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    token: null,
    username: null,
    email: null,
  });

  function login(token: string, username: string, email: string) {
    setAuthState({ isLoggedIn: true, token, username, email });
  }

  function logout() {
    setAuthState({
      isLoggedIn: false,
      token: null,
      username: null,
      email: null,
    });
  }

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
