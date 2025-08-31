import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createCustomer,
  getCustomerById,
  updateCustomer,
} from "../customer.service";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  customerUpdateSchema,
  customerCreateSchema,
  type CustomerCreateDTO,
  type CustomerUpdateDTO,
} from "../schemas";
import { FormField } from "../common/FormField";
//import Swal from "sweetalert2";
//import { useNotifications } from "../../shared/useNotifications";
import {
  withNotifications,
  type WithNotificationsProps,
} from "../../shared/withNotifications";

type Props = {
  customerId?: string;
} & WithNotificationsProps;

export const CustomerFormImpl = ({ customerId, notify }: Props) => {
  const navigate = useNavigate();
  //const notificacion = useNotifications();
  const isEdit = Boolean(customerId);
  const schema = isEdit ? customerUpdateSchema : customerCreateSchema;

  type CustomerFormData = typeof schema extends typeof customerCreateSchema
    ? CustomerCreateDTO
    : CustomerUpdateDTO;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (customerId) {
        await updateCustomer(customerId, data);
        //notificacion.success("Cliente actualizado exitosamente!");
        /*
        Swal.fire({
          title: "Actualización de cliente!",
          text: "Cliente actualizado exitosamente!",
          icon: "success",
        });*/
        notify.success("Cliente fue actualizado!");
      } else {
        await createCustomer(data);
        /*
        Swal.fire({
          title: "Registro de cliente!",
          text: "Cliente creado exitosamente!",
          icon: "success",
        });
        */
        //notificacion.success("Cliente creado exitosamente!");
        notify.success("Cliente fue creado");
      }

      navigate("/", {
        state: customerId
          ? { updateCustomer: { id: customerId, ...data } }
          : undefined,
      });
    } catch (error) {
      notify.error("No se pudo registrar al cliente");
    }
  };

  const onCancel = () => {
    navigate("/"); // Redirige al listado de clientes
  };

  useEffect(() => {
    if (customerId) {
      getCustomerById(customerId).then((data) => {
        reset({
          name: data.name,
          lastname: data.lastname,
          email: data.email,
          phone: data.phone,
          user: data.user,
          password: data.password,
        });
      });
    }
  }, [customerId, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto mt-10 bg-white py-4 px-6 rounded-xl border border-gray-200 shadow-lg"
    >
      <h2 className="text-2x1 font-bold mb-6">
        {customerId ? "Actualizar del cliente" : "Registro de cliente"}
      </h2>

      <FormField
        label="Nombre"
        registration={register("name")}
        errors={errors.name}
        placeholder="Ingresa el nombre"
      />
      <FormField
        label="Apellido"
        registration={register("lastname")}
        errors={errors.lastname}
        placeholder="Ingresa el apellido"
      />
      <FormField
        label="Email"
        type="email"
        registration={register("email")}
        errors={errors.email}
        placeholder="Ingresa el email"
      />
      <FormField
        label="Telefono"
        type="number"
        registration={register("phone")}
        errors={errors.phone}
        placeholder="Ingresa el telefono"
      />
      <FormField
        label="Usuario"
        registration={register("user")}
        errors={errors.user}
        placeholder="Ingresa el usuario"
      />
      <FormField
        label="Password"
        type="password"
        registration={register("password")}
        errors={errors.password}
        placeholder="Ingresa la contraseña"
      />
      {/* <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium">Nombre</label>
        <input type="text" {...register("name")} className="input border    " />
        {errors.name && (
          <p className="text-red-500 text-sm"> {errors.name.message}</p>
        )}
      </div> 
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium">Apellido</label>
        <input type="text" {...register("lastname")} className="input" />
        {errors.lastname && (
          <p className="text-red-500 text-sm"> {errors.lastname.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium">Email</label>
        <input type="text" {...register("email")} className="input" />
        {errors.email && (
          <p className="text-red-500 text-sm"> {errors.email.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium">Teléfono</label>
        <input type="text" {...register("phone")} className="input" />
        {errors.phone && (
          <p className="text-red-500 text-sm"> {errors.phone.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium">Usuario</label>
        <input type="text" {...register("user")} className="input" />
        {errors.user && (
          <p className="text-red-500 text-sm"> {errors.user.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium">Password</label>
        <input type="text" {...register("password")} className="input" />
        {errors.password && (
          <p className="text-red-500 text-sm"> {errors.password.message}</p>
        )}
      </div>*/}
      <div className="flex justify-center gap-4 py-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm shadow-sm transition"
        >
          {customerId ? "Actualizar cliente" : "Registrar cliente"}
        </button>
         <button
          type="button"
          onClick={onCancel}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm shadow-sm transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
export const CustomerForm = withNotifications(CustomerFormImpl);
