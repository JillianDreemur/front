import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import type { CartContextType } from "../types";

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return context;
};
