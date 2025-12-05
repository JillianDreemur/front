// types/index.ts (VERSÃO CORRIGIDA)

export interface User {
  id: string;
  email: string;
  name: string;
  role: "VENDEDOR" | "CLIENTE";
}

// -------------------------------------------------------------
// 1. TIPO DE SAÍDA/EXIBIÇÃO (GET)
// Mantém todos os campos, incluindo aqueles gerenciados apenas no Front-end ou mocks.
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number; // Mapeia para 'quantity' no DTO do Back-end
  sellerId: string;
  sellerName: string;
  image: string;
  category: string;
}

// -------------------------------------------------------------
// 2. TIPO DE ENTRADA DO FORMULÁRIO (POST/PUT)
// **CORREÇÃO:** Contém APENAS os campos que o Back-end (ProductRequest DTO) espera.
// O Front-end (productService.ts) adicionará o skuCode e ignorará os outros campos.
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number; // Mapeia para 'quantity' no DTO do Back-end
  // REMOVIDOS: category, image (e sellerId, sellerName não vêm do form)
}

// -------------------------------------------------------------
// Tipos Auxiliares (Sem Alteração)

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "PENDENTE" | "CONFIRMADO" | "ENVIADO" | "ENTREGUE";
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
}

export interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "VENDEDOR" | "CLIENTE";
}