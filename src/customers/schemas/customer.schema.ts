/*
 * REGLAS DEL NEGOCIO
 * */
import { z } from "zod";

const onlySpaces = /^\s*$/;

export const customerBaseScheme = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(),
  name: z
    .string()
    .min(2, "Nombre requerido")
    .transform((v) => v.trim())
    .refine((v) => !onlySpaces.test(v), "Campo no vacio"),
  lastname: z
    .string()
    .min(2, "Apellido requerido")
    .transform((v) => v.trim())
    .refine((v) => !onlySpaces.test(v), "Campo no vacio"),
  email: z
    .email("email invalido")
    .regex(/^[\w.%+-]+@gmail.com$/, "Solo se permiten dominios Galaxy")
    .transform((v) => v.trim().toLowerCase()),
  phone: z
    .string()
    .min(9, "Telefono invalido")
    .transform((v) => v.trim())
    .refine((v) => !onlySpaces.test(v), "Campo no vacio"),
  user: z
    .string()
    .min(3, "Usuario requerido")
    .transform((v) => v.trim())
    .refine((v) => !onlySpaces.test(v), "Campo no vacio"),
  password: z
    .string()
    .min(6, "Minimo 6 caracteres")
    .transform((v) => v.trim())
    .refine((v) => !onlySpaces.test(v), "Campo no vacio"),
});

export const customerCreateSchema = customerBaseScheme.omit({
  id: true,
  createdAt: true,
});

export const customerUpdateSchema = customerCreateSchema;

export type CustomerCreateDTO = z.infer<typeof customerCreateSchema>;
export type CustomerUpdateDTO = z.infer<typeof customerUpdateSchema>;

export const customerFormDefaults: CustomerCreateDTO = {
  name: "",
  lastname: "",
  email: "",
  phone: "",
  user: "",
  password: "",
};
