import { CustomerForm } from "../components/CustomerForm";
import { useParams } from "react-router-dom";

export const CustomerFormPage = () => {
  const { id } = useParams();

  return (
    <div>
      <CustomerForm customerId={id} />
    </div>
  );
};
