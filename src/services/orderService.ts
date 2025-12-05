import type { CartItem, Order } from "../types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:49816";

const MOCK_ORDERS: Order[] = [];

export const orderService = {
  async create(
    userId: string,
    items: CartItem[],
    total: number,
    token: string
  ): Promise<Order> {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newOrder: Order = {
            id: String(Date.now()),
            userId,
            items: [...items],
            total,
            status: "PENDENTE",
            createdAt: new Date().toISOString(),
          };
          MOCK_ORDERS.push(newOrder);
          resolve({ ...newOrder });
        }, 800);
      });
    } else {
      const orderLineItems = items.map((item) => ({
        id: Number(item.productId),
        skuCode: null,
        price: null,
        quantity: item.quantity,
      }));

      const orderRequest = {
        orderLineItemsDtoList: orderLineItems,
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderRequest),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Erro ao criar pedido");
      }
      
      const responseText = await response.text();
      const orderNumber = `ORD-${Date.now()}`;
      return {
        id: orderNumber,
        userId,
        items,
        total,
        status: "PENDENTE",
        createdAt: new Date().toISOString(),
      };
    }
  },

  async getByUserId(userId: string, token: string): Promise<Order[]> {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const userOrders = MOCK_ORDERS.filter((o) => o.userId === userId);
          resolve([...userOrders]);
        }, 500);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar pedidos");
      const orders: any[] = await response.json();
      return orders.map((o) => ({
        id: o.orderNumber || String(o.id),
        userId,
        items: o.items?.map((item: any) => ({
          productId: String(item.id || ""),
          quantity: item.quantity,
          product: {
            id: String(item.id || ""),
            name: "Produto",
            description: "",
            price: Number(item.price || 0),
            stock: 0,
            sellerId: "",
            sellerName: "",
            image: "",
            category: "",
          },
        })) || [],
        total: o.items?.reduce(
          (sum: number, item: any) =>
            sum + Number(item.price || 0) * (item.quantity || 0),
          0
        ) || 0,
        status: "PENDENTE" as const,
        createdAt: new Date().toISOString(),
      }));
    }
  },

  async getById(orderId: string, token: string): Promise<Order> {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const order = MOCK_ORDERS.find((o) => o.id === orderId);
          if (order) resolve({ ...order });
          else reject(new Error("Pedido não encontrado"));
        }, 300);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Pedido não encontrado");
      const o: any = await response.json();
      return {
        id: o.orderNumber || String(o.id),
        userId: "",
        items: o.items?.map((item: any) => ({
          productId: String(item.id || ""),
          quantity: item.quantity,
          product: {
            id: String(item.id || ""),
            name: "Produto",
            description: "",
            price: Number(item.price || 0),
            stock: 0,
            sellerId: "",
            sellerName: "",
            image: "",
            category: "",
          },
        })) || [],
        total: o.items?.reduce(
          (sum: number, item: any) =>
            sum + Number(item.price || 0) * (item.quantity || 0),
          0
        ) || 0,
        status: "PENDENTE" as const,
        createdAt: new Date().toISOString(),
      };
    }
  },

  async updateStatus(
    orderId: string,
    status: Order["status"],
    token: string
  ): Promise<Order> {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = MOCK_ORDERS.findIndex((o) => o.id === orderId);
          if (index !== -1) {
            MOCK_ORDERS[index].status = status;
            resolve({ ...MOCK_ORDERS[index] });
          } else {
            reject(new Error("Pedido não encontrado"));
          }
        }, 500);
      });
    } else {
      const order = await this.getById(orderId, token);
      return { ...order, status };
    }
  },
};
