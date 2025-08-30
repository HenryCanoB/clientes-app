import { useEffect, useState } from "react";
import { deleteCustomer, getCustomer } from "../customer.service";
import type { Customer } from "../customer.types";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/context/useAuth";

import Swal from "sweetalert2";
import { useNotifications } from "../../shared/useNotifications";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { usePDF } from "react-to-pdf";
import React from "react";
import { exportToExcel } from "../common/exportToExcel";

export const CustomerListPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toPDF, targetRef } = usePDF({ filename: "clientes.pdf" });

  const handleLogout = async () => {
    await logout();
  };

  const notificacion = useNotifications();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Número de elementos por página
  const totalItems = customers.length;

  // Calcular el número total de páginas
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calcular el índice de inicio y fin de los elementos actuales
  const startIndex = (currentPage - 1) * itemsPerPage;
  let currentItems = customers.slice(startIndex, startIndex + itemsPerPage);

  // Función para manejar la navegación a la página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Función para manejar la navegación a la siguiente página
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Función para manejar la navegación a una página específica
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const exportableData = customers.map(
    ({ name, lastname, email, phone, user, id }) => ({
      ID: id,
      Nombre: name,
      Apellido: lastname,
      Email: email,
      Teléfono: phone,
      Usuario: user,
    })
  );

  useEffect(() => {
    getCustomer()
      .then((customers) => {
        setCustomers(customers);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
  }, []);

  useEffect(() => {
    const updated = location.state?.updatedCustomer;
    if (updated) {
      setCustomers((prev) =>
        prev.map((cli) =>
          cli.id === updated.id ? { ...cli, ...updated } : cli
        )
      );
      currentItems = customers.slice(startIndex, startIndex + itemsPerPage);
    }
  }, []);

  const handleEliminar = async (id: string) => {
    try {
      Swal.fire({
        title: "¿Estás seguro que deseas eliminar el registro?",
        text: "No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteCustomer(id);
          /*
      Swal.fire({
        title: "Eliminación de cliente!",
        text: "Cliente eliminado correctamente!",
        icon: "success",
      });*/
          notificacion.success("Cliente eliminado exitosamente!");

          getCustomer().then((customers) => {
            setCustomers(customers);
          });

          currentItems = customers.slice(startIndex, startIndex + itemsPerPage);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Lista de Clientes
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <span className="text-sm text-gray-600">
              Bienvenido,{" "}
              <strong>
                {user?.name} {user?.lastname}
              </strong>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition w-full sm:w-auto"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <button
              onClick={(e) => {
                e.preventDefault();
                toPDF();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition w-full sm:w-auto"
            >
              Descargar PDF
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                exportToExcel(exportableData, "ListaClientes");
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition w-full sm:w-auto"
            >
              Exportar a Excel
            </button>
          </div>

          <Link
            to="/customers/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition w-full sm:w-auto text-center"
          >
            Registrar Cliente
          </Link>
        </div>

        <div className="overflow-x-auto shadow">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-100 text-left text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2 border text-center">#</th>
                <th className="px-4 py-2 border text-center">Nombre</th>
                <th className="px-4 py-2 border text-center">Apellido</th>
                <th className="px-4 py-2 border text-center">Email</th>
                <th className="px-4 py-2 border text-center">Teléfono</th>
                <th className="px-4 py-2 border text-center">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((customer, index) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{startIndex + index + 1}</td>
                  <td className="px-4 py-2">{customer.name}</td>
                  <td className="px-4 py-2">{customer.lastname}</td>
                  <td className="px-4 py-2">{customer.email}</td>
                  <td className="px-4 py-2">{customer.phone}</td>
                  <td className="px-4 py-2 flex justify-center items-center flex-wrap gap-2">
                    <Link
                      to={`/customer/edit/${customer.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleEliminar(customer.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={goToPreviousPage}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={goToNextPage}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{startIndex + 1}</span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, totalItems)}
                </span>{" "}
                de <span className="font-medium">{totalItems}</span> resultados
              </p>
            </div>
            <div>
              <nav
                aria-label="Pagination"
                className="isolate inline-flex -space-x-px rounded-md shadow-xs"
              >
                <button
                  onClick={goToPreviousPage}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
                </button>

                {/* Páginas numeradas */}
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      page === currentPage
                        ? "bg-indigo-600 text-white"
                        : "text-gray-900"
                    } inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={goToNextPage}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
        <div style={{ left: "-9999px", position: "absolute" }}>
          <div
            ref={targetRef as React.RefObject<HTMLDivElement>}
            style={{
              padding: "20px",
              paddingLeft: "50px",
              backgroundColor: "#ffffff",
            }}
          >
            <h1 className="text-2xl font-bold text-center">
              Lista de Clientes
            </h1>
            <table className="w-full text-sm mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">#</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Lastname</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Phone</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => {
                  const rowNumber = index + 1;

                  return (
                    <React.Fragment key={customer.id}>
                      <tr className="border hover:bg-gray-50">
                        <td className="border p-3">{rowNumber}</td>
                        <td className="border p-3">{customer.name}</td>
                        <td className="border p-3">{customer.lastname}</td>
                        <td className="border p-3">{customer.email}</td>
                        <td className="border p-3">{customer.phone}</td>
                      </tr>

                      {rowNumber % 22 == 0 && (
                        <tr
                          key={rowNumber * 2000}
                          style={{
                            border: 0,
                            borderBlockColor: "transparent",
                            backgroundColor: "#FFF",
                          }}
                        >
                          <td
                            className="p-2"
                            style={{ visibility: "hidden", height: "110px" }}
                            colSpan={5}
                          >
                            &nbsp;
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
