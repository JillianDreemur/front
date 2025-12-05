import { CheckCircle, CreditCard, MapPin, Truck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components/Common";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { orderService } from "../services/orderService";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleFinishOrder = async () => {
    if (!user || !token || items.length === 0) return;

    setIsProcessing(true);
    try {
      const order = await orderService.create(user.id, items, total, token);
      setOrderId(order.id);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    navigate("/cart");
    return null;
  }

  if (orderComplete) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Pedido Confirmado!
            </h1>
            <p className="text-gray-600 mb-4">
              Seu pedido foi realizado com sucesso.
            </p>
            {orderId && (
              <p className="text-sm text-gray-500 mb-8">
                Número do pedido:{" "}
                <span className="font-mono font-medium">#{orderId}</span>
              </p>
            )}

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-4 text-left">
                <Truck className="w-10 h-10 text-indigo-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">
                    Acompanhe seu pedido
                  </p>
                  <p className="text-sm text-gray-600">
                    Você receberá atualizações sobre o status da entrega.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/store")}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Voltar para a Loja
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Finalizar Compra</h1>
          <p className="text-indigo-100 mt-2">Revise seu pedido e confirme</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Informações do Pedido */}
          <div className="space-y-6">
            {/* Endereço (Simulado) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Endereço de Entrega
                </h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-gray-600 text-sm mt-1">
                  Rua Exemplo, 123 - Apto 45
                  <br />
                  Bairro Centro - São Paulo, SP
                  <br />
                  CEP: 01234-567
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Endereço simulado para demonstração
              </p>
            </div>

            {/* Pagamento (Simulado) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Forma de Pagamento
                </h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded flex items-center justify-center text-white text-xs">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      •••• •••• •••• 4242
                    </p>
                    <p className="text-gray-500 text-sm">Válido até 12/28</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Pagamento simulado para demonstração
              </p>
            </div>

            {/* Itens do Pedido */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Itens do Pedido
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qtd: {item.quantity} x {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} itens)
                  </span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="text-green-600">Grátis</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Desconto</span>
                  <span>-</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    em até 12x de {formatPrice(total / 12)} sem juros
                  </p>
                </div>
              </div>

              <button
                onClick={handleFinishOrder}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loading size="sm" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Confirmar Pedido
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Ao confirmar, você concorda com nossos termos de uso e política
                de privacidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
