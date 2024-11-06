import { useCallback, useEffect, useState } from "react";
import type { RegisterFormData } from "../components/auth/sign-up";
import type { LoginFormData } from "@/components/auth/login";
import { AuthContext, AuthState } from "@/context/auth-context";

const TOKEN_KEY = "auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const getProfile = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (isTokenInvalid(storedToken)) {
      logout();
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/auth/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw data;
    }

    const userData = await response.json();
    return userData;
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (isTokenInvalid(storedToken)) {
      logout();
      setIsAuthLoading(false);
    } else {
      getProfile()
        .then((data) => {
          setAuthState({
            username: data.username,
            email: data.email,
            imageUrl: data.imageUrl,
            userId: data.sub,
            token: storedToken,
            isAuthenticated: true,
          });
        })
        .finally(() => setIsAuthLoading(false));
    }
  }, [getProfile]);

  async function register(formData: RegisterFormData) {
    const { username, email, password } = formData;
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw data;
    }

    const { access_token } = await response.json();
    localStorage.setItem(TOKEN_KEY, access_token);

    const userData = await getProfile();
    if (userData) {
      setAuthState({
        username: userData.username,
        email: userData.email,
        imageUrl: userData.imageUrl,
        userId: userData.sub,
        token: access_token,
        isAuthenticated: true,
      });
    }
  }

  async function login(formData: LoginFormData) {
    const { email, password } = formData;
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw data;
    }

    const { access_token } = await response.json();
    localStorage.setItem(TOKEN_KEY, access_token);

    const userData = await getProfile();
    if (userData) {
      setAuthState({
        username: userData.username,
        email: userData.email,
        imageUrl: userData.imageUrl,
        userId: userData.sub,
        token: access_token,
        isAuthenticated: true,
      });
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setAuthState(null);
  }

  return (
    <AuthContext.Provider
      value={{ authState, register, login, logout, isAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function isTokenInvalid(token: string | null): boolean {
  return !token || token === "undefined" || isTokenExpired(token);
}

function isTokenExpired(token: string): boolean {
  const base64Url = token.split(".")[1]; // Get payload part of the JWT
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join(""),
  );

  const { exp } = JSON.parse(jsonPayload); // Get the exp field
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  return exp < currentTime; // If token expiration time is less than current time, it's expired
}
