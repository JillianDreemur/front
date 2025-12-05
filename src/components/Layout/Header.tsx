import {
  ClipboardList,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Store,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity"
          >
            <Store className="w-7 h-7" />
            <span className="hidden sm:inline">M-Commerce</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {user?.role === "VENDEDOR" ? (
                  <Link
                    to="/seller"
                    className="flex items-center gap-2 hover:text-indigo-200 transition-colors"
                  >
                    <Package className="w-5 h-5" />
                    Meus Produtos
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/store"
                      className="flex items-center gap-2 hover:text-indigo-200 transition-colors"
                    >
                      <Store className="w-5 h-5" />
                      Loja
                    </Link>
                    <Link
                      to="/cart"
                      className="flex items-center gap-2 hover:text-indigo-200 transition-colors relative"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Carrinho
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {cartItemsCount > 9 ? "9+" : cartItemsCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 hover:text-indigo-200 transition-colors"
                    >
                      <ClipboardList className="w-5 h-5" />
                      Pedidos
                    </Link>
                  </>
                )}

                <div className="flex items-center gap-4 pl-4 border-l border-indigo-400">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name}</span>
                      <span className="text-xs text-indigo-200">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 rounded-lg transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 hover:text-indigo-200 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-indigo-500 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-indigo-500">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 pb-3 border-b border-indigo-500">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-indigo-200">{user?.role}</p>
                  </div>
                </div>

                {user?.role === "VENDEDOR" ? (
                  <Link
                    to="/seller"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-500 rounded-lg transition-colors"
                  >
                    <Package className="w-5 h-5" />
                    Meus Produtos
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/store"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-500 rounded-lg transition-colors"
                    >
                      <Store className="w-5 h-5" />
                      Loja
                    </Link>
                    <Link
                      to="/cart"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-500 rounded-lg transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Carrinho
                      {cartItemsCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                          {cartItemsCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/orders"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-500 rounded-lg transition-colors"
                    >
                      <ClipboardList className="w-5 h-5" />
                      Meus Pedidos
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-500 rounded-lg transition-colors text-left w-full mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="px-3 py-2 hover:bg-indigo-500 rounded-lg transition-colors text-center"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="px-3 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-center"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
