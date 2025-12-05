import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useState } from "react";
import { authService } from "../services/authService";
import type { AuthContextType, User } from "../types";

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se há token salvo ao carregar
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("authUser", JSON.stringify(response.user));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role: string) => {
      setIsLoading(true);
      try {
        await authService.register(name, email, password, role);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  }, []);

  const loginWithGitHub = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.loginWithGitHub();
      // Se estiver em modo mock, fazer login automático
      if (import.meta.env.VITE_USE_MOCK === "true") {
        const response = await authService.handleGitHubCallback("");
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("authUser", JSON.stringify(response.user));
      }
      // Se não estiver em modo mock, o redirecionamento já foi feito
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.loginWithGoogle();
      // Se estiver em modo mock, fazer login automático
      if (import.meta.env.VITE_USE_MOCK === "true") {
        const response = await authService.handleGoogleCallback("");
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("authUser", JSON.stringify(response.user));
      }
      // Se não estiver em modo mock, o redirecionamento já foi feito
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        loginWithGitHub,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
