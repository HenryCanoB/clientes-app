import { z } from "zod";

const onlySpaces = /^\s*$/;

export const loginSchema = z.object({
  email: z
    .email({ message: "Email invalido" })
    .regex(/^[\w.%+-]+@galaxy.com$/, "Solo se permiten dominios galaxy")
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(6, "Minimo 6 caracteres")
    .regex(/[A-Z]/, { message: "Incluye una mayuscula" })
    .transform((v) => v.trim())
    .refine((v) => !onlySpaces.test(v), "Campo no vacio"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const loginFormDefaults: LoginFormData = {
  email: "",
  password: "",
  rememberMe: false,
};