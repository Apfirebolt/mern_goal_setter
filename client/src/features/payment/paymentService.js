import axiosInstance from "../../plugins/interceptor";
import { toast } from "react-toastify";

// Create Stripe Checkout Session
const createCheckoutSession = async (checkoutData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.post(
      "payments/create-checkout-session",
      checkoutData,
      config
    );

    return response.data; // Expects { url: session.url }
  } catch (err) {
    const errorMessage =
      err.response?.data?.error || "Failed to initiate payment session";
    toast.error(errorMessage);
    throw err;
  }
};

const paymentService = {
  createCheckoutSession,
};

export default paymentService;