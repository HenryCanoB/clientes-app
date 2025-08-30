import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  type?: string;
  placeholder?: string;
  errors?: FieldError;
}

export const FormField = ({
  label,
  type = "text",
  placeholder,
  registration,
  errors,
}: FormFieldProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors ? "border-red-500" : "border-gray-300"
        }`}
        {...registration}
      />
      {errors && (
        <p className="mt-2 text-sm text-red-600 italic">{errors.message}</p>
      )}
    </div>
  );
};
