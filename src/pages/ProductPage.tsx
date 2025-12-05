import {
  ArrowLeft,
  Heart,
  Minus,
  Package,
  Plus,
  Share2,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loading } from "../components/Common";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { productService } from "../services/productService";
import type { Product } from "../types";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadProduct = async (productId: string) => {
      setIsLoading(true);
      try {
        const data = await productService.getById(productId);
        setProduct(data);

        // Carregar produtos relacionados (mesma categoria)
        const allProducts = await productService.getAll();
        const related = allProducts
          .filter((p) => p.category === data.category && p.id !== productId)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        navigate("/404");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct(id);
    }
  }, [id, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, quantity);
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 300);
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loading size="lg" text="Carregando produto..." />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Produto não encontrado
          </h1>
          <Link to="/store" className="text-indigo-600 hover:underline mt-4">
            Voltar para a loja
          </Link>
        </div>
      </Layout>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/store" className="hover:text-indigo-600 transition-colors">
            Loja
          </Link>
          <span>/</span>
          <Link
            to={`/store?category=${product.category}`}
            className="hover:text-indigo-600 transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        {/* Botão Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        {/* Produto Principal */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Imagem */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-xl object-cover aspect-square"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/600x600?text=Produto";
                }}
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                  <span className="bg-red-500 text-white px-8 py-4 rounded-lg font-semibold text-xl">
                    Esgotado
                  </span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-indigo-600 text-white text-sm px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Ações */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Informações */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>

              {/* Rating (Mock) */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= 4
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-500">(4.0) · 24 avaliações</span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Preço */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-indigo-600">
                  {formatPrice(product.price)}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  ou 12x de {formatPrice(product.price / 12)} sem juros
                </p>
              </div>

              {/* Estoque */}
              <div className="flex items-center gap-2 mb-6">
                <Package
                  className={`w-5 h-5 ${
                    isOutOfStock ? "text-red-500" : "text-green-500"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isOutOfStock ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {isOutOfStock
                    ? "Produto esgotado"
                    : `${product.stock} unidades em estoque`}
                </span>
              </div>

              {/* Vendedor */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500">Vendido por</p>
                <p className="font-medium text-gray-800">
                  {product.sellerName}
                </p>
              </div>

              {/* Entrega */}
              <div className="flex items-center gap-3 mb-6 p-4 border border-green-200 bg-green-50 rounded-lg">
                <Truck className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Frete Grátis</p>
                  <p className="text-sm text-green-600">
                    Entrega em até 5 dias úteis
                  </p>
                </div>
              </div>

              {/* Quantidade e Adicionar ao Carrinho */}
              {user?.role === "CLIENTE" && !isOutOfStock && (
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  {/* Seletor de Quantidade */}
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Botão Adicionar */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isAdding ? (
                      <Loading size="sm" />
                    ) : showSuccess ? (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Adicionado!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Adicionar ao Carrinho
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Mensagem de sucesso */}
              {showSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  ✓ Produto adicionado ao carrinho!{" "}
                  <Link
                    to="/cart"
                    className="font-semibold underline hover:no-underline"
                  >
                    Ver carrinho
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  to={`/product/${related.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/300x300?text=Produto";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 line-clamp-1">
                      {related.name}
                    </h3>
                    <p className="text-lg font-bold text-indigo-600 mt-1">
                      {formatPrice(related.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;
