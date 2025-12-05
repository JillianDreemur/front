import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loading } from "./Loading";

interface RoleBasedRouteProps {
  children: ReactNode;
  requiredRole: "VENDEDOR" | "CLIENTE";
}

export const RoleBasedRoute = ({
  children,
  requiredRole,
}: RoleBasedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Verificando permissões..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== requiredRole) {
    const redirectPath = user.role === "VENDEDOR" ? "/seller" : "/store";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
