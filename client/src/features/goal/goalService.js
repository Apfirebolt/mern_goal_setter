import axiosInstance from "../../plugins/interceptor";
import { toast } from "react-toastify";
import authService from "../auth/authService";
import Cookies from "js-cookie";

// Create new goal
const createGoal = async (goalData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.post("goals", goalData, config);

    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
      authService.logout();
    }
    if (err.response.status === 400) {
      errorMessage = "";
      err.response.data.non_field_errors.map((error) => {
        errorMessage += error + "\n";
      });
    }
    toast.error(errorMessage);
  }
};

// Get user goals
const getGoals = async () => {
  try {
    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.get("goals/mine", config);
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
      authService.logout();
    }
    toast.error(errorMessage);
  }
};

// Get single goal
const getGoal = async (goalId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axiosInstance.get("goals/" + goalId, config);

    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
      authService.logout();
    }
    toast.error(errorMessage);
  }
};

// Update goal
const updateGoal = async (data, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Extract the ID from the data payload
    const response = await axiosInstance.put(
      "goals/" + data.id,
      data,
      config
    );

    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
    }
    toast.error(errorMessage);
  }
};

// Delete single goal
const deleteGoal = async (goalId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axiosInstance.delete("goals/" + goalId, config);

    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
      authService.logout();
    }
    toast.error(errorMessage);
  }
};

const goalService = {
  createGoal,
  getGoal,
  updateGoal,
  deleteGoal,
  getGoals,
};

export default goalService;
