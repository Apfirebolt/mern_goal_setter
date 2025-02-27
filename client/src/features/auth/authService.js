import axiosInstance from "../../plugins/interceptor";
import Cookies from 'js-cookie';

// Register user
const register = async (userData) => {
  try {
    const response = await axiosInstance.post("users", userData);
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
    console.error(errorMessage);
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axiosInstance.post("users/login", userData);

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      // set cookie
      Cookies.set('token', response.data.token, { expires: 30 });
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
    console.error(errorMessage);
  }
};

// Logout user
const logout = () => {
  Cookies.remove('token');
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
    console.error(errorMessage);
  }
};

const authService = {
  register,
  logout,
  login,
  getUserProfile,
};

export default authService;