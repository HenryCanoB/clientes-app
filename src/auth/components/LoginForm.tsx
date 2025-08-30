import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "../schemas";
import { FormField } from "../../customers/common/FormField";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      await login(data);
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error de autenticación";
      onError?.(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Galaxy</h2>
      </div>

      <div className="space-y-6">
        <FormField
          label="Correo Electrónico"
          type="email"
          registration={register("email")}
          errors={errors.email}
          placeholder="usuario@gmail.com"
        />

        <FormField
          label="Contraseña"
          type="password"
          registration={register("password")}
          errors={errors.password}
          placeholder="Ingresa tu contraseña"
        />

        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            {...register("rememberMe")}
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
            Recordarme
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-8 w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        }`}
      >
        {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>
    </form>
  );
};