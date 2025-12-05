import type { Product } from "../types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:58156";

let MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Notebook Dell Inspiron",
    description:
      "Notebook com processador Intel Core i7, 16GB RAM, SSD 512GB. Ideal para trabalho e estudos.",
    price: 3500.0,
    stock: 10,
    sellerId: "1",
    sellerName: "João Vendedor",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    category: "Eletrônicos",
  },
  {
    id: "2",
    name: "Mouse Logitech MX Master",
    description:
      "Mouse sem fio ergonômico com sensor de alta precisão. Bateria de longa duração.",
    price: 150.0,
    stock: 50,
    sellerId: "1",
    sellerName: "João Vendedor",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    category: "Periféricos",
  },
  {
    id: "3",
    name: "Teclado Mecânico RGB",
    description:
      "Teclado mecânico com switches Cherry MX, iluminação RGB personalizável.",
    price: 450.0,
    stock: 25,
    sellerId: "3",
    sellerName: "Pedro Vendedor 2",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400",
    category: "Periféricos",
  },
  {
    id: "4",
    name: 'Monitor LG UltraWide 29"',
    description:
      "Monitor Full HD 144Hz, painel IPS, tempo de resposta 1ms. Perfeito para games.",
    price: 800.0,
    stock: 15,
    sellerId: "3",
    sellerName: "Pedro Vendedor 2",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    category: "Monitores",
  },
  {
    id: "5",
    name: "Headset Gamer HyperX",
    description:
      "Headset com som surround 7.1, microfone com cancelamento de ruído.",
    price: 350.0,
    stock: 30,
    sellerId: "1",
    sellerName: "João Vendedor",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
    category: "Áudio",
  },
  {
    id: "6",
    name: "Webcam Logitech C920",
    description:
      "Webcam Full HD 1080p, foco automático, microfone estéreo integrado.",
    price: 280.0,
    stock: 20,
    sellerId: "3",
    sellerName: "Pedro Vendedor 2",
    image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400",
    category: "Periféricos",
  },
];

export const productService = {
  async getAll(): Promise<Product[]> {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...MOCK_PRODUCTS]), 500);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) throw new Error("Erro ao buscar produtos");
      const products: any[] = await response.json();
      return products.map((p) => ({
        id: String(p.id),
        name: p.name,
        description: p.description || "",
        price: Number(p.price),
        stock: p.quantity || 0,
        sellerId: "1",
        sellerName: "Vendedor",
        image: `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&sig=${p.id}`,
        category: "Geral",
      }));
    }
  },

  async getById(id: string): Promise<Product> {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const product = MOCK_PRODUCTS.find((p) => p.id === id);
          if (product) resolve({ ...product });
          else reject(new Error("Produto não encontrado"));
        }, 300);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      if (!response.ok) throw new Error("Produto não encontrado");
      const p: any = await response.json();
      return {
        id: String(p.id),
        name: p.name,
        description: p.description || "",
        price: Number(p.price),
        stock: p.quantity || 0,
        sellerId: "1",
        sellerName: "Vendedor",
        image: `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&sig=${p.id}`,
        category: "Geral",
      };
    }
  },

  async getBySellerId(sellerId: string, token: string): Promise<Product[]> {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const sellerProducts = MOCK_PRODUCTS.filter(
            (p) => p.sellerId === sellerId
          );
          resolve([...sellerProducts]);
        }, 500);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar produtos do vendedor");
      const products: any[] = await response.json();
      return products.map((p) => ({
        id: String(p.id),
        name: p.name,
        description: p.description || "",
        price: Number(p.price),
        stock: p.quantity || 0,
        sellerId: sellerId,
        sellerName: "Vendedor",
        image: `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&sig=${p.id}`,
        category: "Geral",
      }));
    }
  },

  async create(product: Omit<Product, "id">, token: string): Promise<Product> {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newProduct: Product = {
            ...product,
            id: String(Date.now()),
          };
          MOCK_PRODUCTS.push(newProduct);
          resolve({ ...newProduct });
        }, 500);
      });
    } else {
      const productRequest = {
        name: product.name,
        description: product.description,
        price: product.price,
        skuCode: `SKU-${Date.now()}`,
        quantity: product.stock,
      };
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productRequest),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Erro ao criar produto");
      }
      const p: any = await response.json();
      return {
        id: String(p.id),
        name: p.name,
        description: p.description || "",
        price: Number(p.price),
        stock: p.quantity || 0,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        image: product.image,
        category: product.category,
      };
    }
  },

  async update(
    id: string,
    product: Partial<Product>,
    token: string
  ): Promise<Product> {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
          if (index !== -1) {
            MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...product };
            resolve({ ...MOCK_PRODUCTS[index] });
          } else {
            reject(new Error("Produto não encontrado"));
          }
        }, 500);
      });
    } else {
      const productRequest: any = {};
      if (product.name) productRequest.name = product.name;
      if (product.description) productRequest.description = product.description;
      if (product.price !== undefined) productRequest.price = product.price;
      if (product.stock !== undefined) productRequest.quantity = product.stock;
      
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productRequest),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Erro ao atualizar produto");
      }
      return productService.getById(id);
    }
  },

  async delete(id: string, token: string): Promise<void> {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
          if (index !== -1) {
            MOCK_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.id !== id);
            resolve();
          } else {
            reject(new Error("Produto não encontrado"));
          }
        }, 500);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Erro ao deletar produto");
      }
    }
  },

  async searchByCategory(category: string): Promise<Product[]> {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const products = MOCK_PRODUCTS.filter((p) =>
            p.category.toLowerCase().includes(category.toLowerCase())
          );
          resolve([...products]);
        }, 300);
      });
    } else {
      const allProducts = await this.getAll();
      return allProducts.filter((p) =>
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }
  },

  async searchByName(name: string): Promise<Product[]> {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const products = MOCK_PRODUCTS.filter((p) =>
            p.name.toLowerCase().includes(name.toLowerCase())
          );
          resolve([...products]);
        }, 300);
      });
    } else {
      const allProducts = await this.getAll();
      return allProducts.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    }
  },
};
