import { Eye, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  onView?: (product: Product) => void;
}

export const ProductCard = ({
  product,
  showAddToCart = true,
  onView,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, 1);
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 300);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Imagem do Produto */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x300?text=Produto";
          }}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              Esgotado
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Informações do Produto */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-indigo-600">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Package className="w-4 h-4" />
            <span>{product.stock} em estoque</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-3">
          Vendido por:{" "}
          <span className="text-gray-600">{product.sellerName}</span>
        </p>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              onView ? onView(product) : navigate(`/product/${product.id}`)
            }
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </button>

          {showAddToCart && user?.role === "CLIENTE" && (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-medium
                ${
                  isOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : showSuccess
                    ? "bg-green-500 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
            >
              <ShoppingCart
                className={`w-4 h-4 ${isAdding ? "animate-bounce" : ""}`}
              />
              {showSuccess
                ? "Adicionado!"
                : isAdding
                ? "Adicionando..."
                : "Adicionar"}
            </button>
          )}

          {!user && showAddToCart && (
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              Faça Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
