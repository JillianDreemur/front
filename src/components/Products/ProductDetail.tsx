import { Minus, Package, Plus, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetail = ({ product, onClose }: ProductDetailProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, quantity);
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    }, 300);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">
            Detalhes do Produto
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Imagem */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg object-cover aspect-square"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/400x400?text=Produto";
                }}
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                  <span className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold text-lg">
                    Esgotado
                  </span>
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="flex flex-col">
              <span className="inline-flex w-fit bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full mb-2">
                {product.category}
              </span>

              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>

              <p className="text-gray-600 mb-4 flex-grow">
                {product.description}
              </p>

              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Package className="w-4 h-4" />
                <span>{product.stock} unidades em estoque</span>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Vendido por:{" "}
                <span className="font-medium text-gray-700">
                  {product.sellerName}
                </span>
              </p>

              <div className="text-3xl font-bold text-indigo-600 mb-4">
                {formatPrice(product.price)}
              </div>

              {/* Quantidade */}
              {user?.role === "CLIENTE" && !isOutOfStock && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Subtotal */}
              {quantity > 1 && (
                <p className="text-gray-600 mb-4">
                  Subtotal:{" "}
                  <span className="font-semibold text-indigo-600">
                    {formatPrice(product.price * quantity)}
                  </span>
                </p>
              )}

              {/* Botão Adicionar */}
              {user?.role === "CLIENTE" && (
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAdding}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all font-medium text-lg
                    ${
                      isOutOfStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : showSuccess
                        ? "bg-green-500 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                >
                  <ShoppingCart
                    className={`w-5 h-5 ${isAdding ? "animate-bounce" : ""}`}
                  />
                  {showSuccess
                    ? "Adicionado ao Carrinho!"
                    : isAdding
                    ? "Adicionando..."
                    : "Adicionar ao Carrinho"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
