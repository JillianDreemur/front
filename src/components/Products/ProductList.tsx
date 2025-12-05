import type { Product } from "../../types";
import { Loading } from "../Common/Loading";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
  onViewProduct?: (product: Product) => void;
  showAddToCart?: boolean;
}

export const ProductList = ({
  products,
  isLoading = false,
  emptyMessage = "Nenhum produto encontrado",
  onViewProduct,
  showAddToCart = true,
}: ProductListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" text="Carregando produtos..." />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg
          className="w-16 h-16 mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <p className="text-lg font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onView={onViewProduct}
          showAddToCart={showAddToCart}
        />
      ))}
    </div>
  );
};
