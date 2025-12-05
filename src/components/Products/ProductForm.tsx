import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Product, ProductFormData } from "../../types";

const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.number().min(0.01, "Preço deve ser maior que zero"),
  stock: z.number().int().min(0, "Estoque não pode ser negativo"),
});

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>; // Sem 'Product' como tipo de retorno
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductForm = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
        }
      : {
          name: "",
          description: "",
          price: 0,
          stock: 0,
        },
  });

  const isEditing = !!product;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditing ? "Editar Produto" : "Novo Produto"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto *
            </label>
            <input
              {...register("name")}
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                ${errors.name ? "border-red-500" : "border-gray-300"}`}
              placeholder="Ex: Notebook Dell Inspiron"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none
                ${errors.description ? "border-red-500" : "border-gray-300"}`}
              placeholder="Descreva seu produto..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Preço e Estoque */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$) *
              </label>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                  ${errors.price ? "border-red-500" : "border-gray-300"}`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estoque *
              </label>
              <input
                {...register("stock", { valueAsNumber: true })}
                type="number"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                  ${errors.stock ? "border-red-500" : "border-gray-300"}`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isLoading
                ? "Salvando..."
                : isEditing
                ? "Salvar Alterações"
                : "Criar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};