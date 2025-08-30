import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const useNotifications = () => {
  return {
    info: (msg: string) => toast.info(msg),
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    warn: (msg: string) => toast.warn(msg),
    confirm: async (title: string, text: string) => {
      const res = await Swal.fire({
        title,
        text,
      });
      return res.isConfirmed;
    },
  };
};