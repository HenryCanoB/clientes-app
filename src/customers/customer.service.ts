import type { Customer } from "./customer.types";
import type { CustomerCreateDTO, CustomerUpdateDTO } from "./schemas";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const BASE_URL = `https://${API_TOKEN}.mockapi.io/api/v1/customers`;

export const getCustomer = async (): Promise<Customer[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Error al obtener los clientes");
  }
  return response.json();
};

export const createCustomer = async (
  data: CustomerCreateDTO
): Promise<Customer> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al crear el cliente");
  }
  return response.json();
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("No se obtuvo el cliente");
  return res.json();
};

export const updateCustomer = async (
  id: string,
  data: CustomerUpdateDTO
): Promise<Customer> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar el cliente");
  }
  return response.json();
};

export const deleteCustomer = async (id: string): Promise<boolean> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("No se pudo eliminar cliente");
  return res.json();
};
