import { Calendar, ChevronRight, Package, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../components/Common";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { orderService } from "../services/orderService";
import type { Order } from "../types";

const OrdersPage = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user || !token) return;
      setIsLoading(true);
      try {
        const data = await orderService.getByUserId(user.id, token);
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(data);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && token) {
      loadOrders();
    }
  }, [user, token]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      PENDENTE: "bg-yellow-100 text-yellow-800",
      CONFIRMADO: "bg-blue-100 text-blue-800",
      ENVIADO: "bg-purple-100 text-purple-800",
      ENTREGUE: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: Order["status"]) => {
    const labels = {
      PENDENTE: "Pendente",
      CONFIRMADO: "Confirmado",
      ENVIADO: "Enviado",
      ENTREGUE: "Entregue",
    };
    return labels[status] || status;
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Meus Pedidos</h1>
          <p className="text-indigo-100">Acompanhe o status dos seus pedidos</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loading size="lg" text="Carregando pedidos..." />
          </div>
        )}

        {/* Lista Vazia */}
        {!isLoading && orders.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Nenhum pedido encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              Você ainda não fez nenhum pedido. Que tal começar a comprar?
            </p>
            <Link
              to="/store"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Ir para a Loja
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {/* Lista de Pedidos */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Header do Pedido */}
                <button
                  onClick={() => toggleOrderDetails(order.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">
                        Pedido #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                    <span className="font-bold text-indigo-600">
                      {formatPrice(order.total)}
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedOrder === order.id ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Detalhes do Pedido (Expandido) */}
                {expandedOrder === order.id && (
                  <div className="border-t bg-gray-50 p-4">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Itens do Pedido
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-4 bg-white p-3 rounded-lg"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/64?text=Produto";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantidade: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-800">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="text-gray-600">Total do Pedido</span>
                      <span className="text-xl font-bold text-indigo-600">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
