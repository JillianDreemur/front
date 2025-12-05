export interface User {
  id: string;
  email: string;
  name: string;
  role: "VENDEDOR" | "CLIENTE";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sellerId: string;
  sellerName: string;
  image: string;
  category: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
}

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