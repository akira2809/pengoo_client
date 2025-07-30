// app/components/ui/toastHelper.tsx
import { toast } from 'react-hot-toast';

export const showSuccessToast = (message: string) =>
  toast.success(message, {
    duration: 2500,
    position: 'top-center',
    style: {
      background: "#4ade80",
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
  });

export const showErrorToast = (message: string) =>
  toast.error(message, {
    duration: 2500,
    position: 'top-center',
    style: {
      background: "#ef4444",
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
  });
