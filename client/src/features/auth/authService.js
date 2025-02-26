import axiosInstance from "../../plugins/interceptor";
import { toast } from "react-toastify";

// Register user
const register = async (userData) => {
  try {
    const response = await axiosInstance.post("register", userData);

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Registered successfully");
      // redirect to login
      window.location.href = "/login";
    }
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
    }
    if (err.response.status === 400) {
      errorMessage = err.response.data.detail;
    }
    if (err.response.status === 409) {
      errorMessage = err.response.data.detail;
    }
    toast.error(errorMessage);
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axiosInstance.post("login", userData);

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Logged in successfully");
    }
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response.status === 400) {
      errorMessage = err.response.data.detail;
    }
    if (err.response.status === 404) {
      errorMessage = err.response.data.detail;
    }
    if (err.response.status === 401) {
      errorMessage = err.response.data.detail;
    }
    toast.error(errorMessage);
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem("user")
};

// Get user profile
const getUserProfile = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axiosInstance.get("profile", config);
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response.status === 401) {
      errorMessage = err.response.data.detail;
      localStorage.removeItem("user")
      // redirect to login
      window.location.href = "/login";
    }
    if (err.response.status === 404) {
      errorMessage = err.response.data.detail;
    }
    toast.error(errorMessage);
  }
};

const authService = {
  register,
  logout,
  login,
  getUserProfile,
};

export default authService;