import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute, RoleBasedRoute } from "./components/Common";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import {
  CartPage,
  CheckoutPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  OrdersPage,
  ProductPage,
  RegisterPage,
  SellerDashboard,
  StoreFront,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rotas do Cliente */}
            <Route
              path="/store"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute requiredRole="CLIENTE">
                    <StoreFront />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            {/* Rotas do Vendedor */}
            <Route
              path="/seller"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute requiredRole="VENDEDOR">
                    <SellerDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
