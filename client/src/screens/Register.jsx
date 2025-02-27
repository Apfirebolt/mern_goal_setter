import { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  register as registerUser,
  resetSuccess,
  resetError,
} from "../features/auth/authSlice";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const closeSuccess = () => setSuccessSnackbar(false);
  const closeError = () => setErrorSnackbar(false);

  const { user, isError, isSuccess, message } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Add validation and submit logic here
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isSuccess && message === "User registered successfully, please login") {
      setSuccessSnackbar(true);
      dispatch(resetSuccess());
      setTimeout(() => {
        setSuccessSnackbar(false);
        navigate("/login");
      }, 1000);
    }
  }, [isSuccess, dispatch, navigate, message]);

  useEffect(() => {
    if (isError) {
      setErrorSnackbar(true);
      setTimeout(() => {
        setErrorSnackbar(false);
        dispatch(resetError());
      }, 3000);
    }
  }, [isError, dispatch]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Username"
            name="username"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
            helperText={errors.username ? errors.username.message : ""}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
      </Box>
      <Snackbar
        open={successSnackbar}
        autoHideDuration={6000}
        onClose={closeSuccess}
      >
        <Alert
          onClose={closeSuccess}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={6000}
        onClose={closeError}
      >
        <Alert
          onClose={closeError}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
