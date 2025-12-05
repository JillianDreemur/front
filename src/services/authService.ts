import type { User } from "../types";

// URL da API de autenticação (backend com PostgreSQL)
const AUTH_API_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:3001";

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${AUTH_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Email ou senha inválidos");
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao fazer login");
    }
  },

  async register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ message: string }> {
    try {
      const response = await fetch(`${AUTH_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao criar conta");
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao criar conta");
    }
  },

  async validateToken(token: string): Promise<User | null> {
    try {
      const response = await fetch(`${AUTH_API_URL}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch {
      return null;
    }
  },

};
