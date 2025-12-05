import type { User } from "../types";

// Flag para usar MOCK ou API real
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

interface MockUser extends User {
  password: string;
}

const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    email: "vendedor@email.com",
    password: "senha123",
    name: "João Vendedor",
    role: "VENDEDOR",
  },
  {
    id: "2",
    email: "cliente@email.com",
    password: "senha123",
    name: "Maria Cliente",
    role: "CLIENTE",
  },
  {
    id: "3",
    email: "outro@email.com",
    password: "senha123",
    name: "Pedro Vendedor 2",
    role: "VENDEDOR",
  },
];

// Armazena usuários registrados (simulação)
const registeredUsers = [...MOCK_USERS];

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = registeredUsers.find(
            (u) => u.email === email && u.password === password
          );
          if (user) {
            const { password: _, ...userWithoutPassword } = user;
            resolve({
              user: userWithoutPassword,
              token: `mock-jwt-token-${user.id}-${Date.now()}`,
            });
          } else {
            reject(new Error("Email ou senha inválidos"));
          }
        }, 800);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Login falhou");
      return response.json();
    }
  },

  async register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ message: string }> {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const userExists = registeredUsers.some((u) => u.email === email);
          if (userExists) {
            reject(new Error("Email já cadastrado"));
          } else {
            const newUser: MockUser = {
              id: String(registeredUsers.length + 1),
              name,
              email,
              password,
              role: role as "VENDEDOR" | "CLIENTE",
            };
            registeredUsers.push(newUser);
            resolve({ message: "Cadastro realizado com sucesso" });
          }
        }, 800);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!response.ok) throw new Error("Registro falhou");
      return response.json();
    }
  },

  async validateToken(token: string): Promise<User | null> {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simula validação do token - extrai o userId do token mock
          const tokenParts = token.split("-");
          if (tokenParts.length >= 4) {
            const userId = tokenParts[3];
            const user = registeredUsers.find((u) => u.id === userId);
            if (user) {
              const { password: _, ...userWithoutPassword } = user;
              resolve(userWithoutPassword);
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        }, 300);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return response.json();
    }
  },

  async loginWithGitHub(): Promise<void> {
    if (USE_MOCK) {
      // Simulação de OAuth GitHub
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simula um usuário GitHub
          const githubUser: MockUser = {
            id: "github-1",
            email: "github@example.com",
            password: "",
            name: "GitHub User",
            role: "CLIENTE",
          };
          registeredUsers.push(githubUser);
          resolve();
        }, 500);
      });
    } else {
      // Redirecionar para OAuth GitHub
      // O backend deve ter um endpoint /auth/oauth2/github/authorize
      const redirectUri = `${window.location.origin}/auth/callback/github`;
      const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || "";
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
      
      if (!clientId) {
        throw new Error("GitHub Client ID não configurado. Configure VITE_GITHUB_CLIENT_ID no .env");
      }
      
      window.location.href = githubAuthUrl;
    }
  },

  async handleGitHubCallback(code: string): Promise<AuthResponse> {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const githubUser = registeredUsers.find((u) => u.id === "github-1");
          if (githubUser) {
            const { password: _, ...userWithoutPassword } = githubUser;
            resolve({
              user: userWithoutPassword,
              token: `mock-jwt-token-github-${Date.now()}`,
            });
          } else {
            throw new Error("Erro ao autenticar com GitHub");
          }
        }, 500);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/auth/oauth2/github/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error("Erro ao autenticar com GitHub");
      return response.json();
    }
  },

  async loginWithGoogle(): Promise<void> {
    if (USE_MOCK) {
      // Simulação de OAuth Google
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simula um usuário Google
          const googleUser: MockUser = {
            id: "google-1",
            email: "google@example.com",
            password: "",
            name: "Google User",
            role: "CLIENTE",
          };
          registeredUsers.push(googleUser);
          resolve();
        }, 500);
      });
    } else {
      // Redirecionar para OAuth Google
      // O backend deve ter um endpoint /auth/oauth2/google/authorize
      const redirectUri = `${window.location.origin}/auth/callback/google`;
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile`;
      
      if (!clientId) {
        throw new Error("Google Client ID não configurado. Configure VITE_GOOGLE_CLIENT_ID no .env");
      }
      
      window.location.href = googleAuthUrl;
    }
  },

  async handleGoogleCallback(code: string): Promise<AuthResponse> {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const googleUser = registeredUsers.find((u) => u.id === "google-1");
          if (googleUser) {
            const { password: _, ...userWithoutPassword } = googleUser;
            resolve({
              user: userWithoutPassword,
              token: `mock-jwt-token-google-${Date.now()}`,
            });
          } else {
            throw new Error("Erro ao autenticar com Google");
          }
        }, 500);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/auth/oauth2/google/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error("Erro ao autenticar com Google");
      return response.json();
    }
  },
};
