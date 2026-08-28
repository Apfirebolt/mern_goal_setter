import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  register as registerUser,
  resetSuccess,
  resetError,
} from "../features/auth/authSlice";

// MUI Components
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  CircularProgress,
  Fade,
} from "@mui/material";

// MUI Icons
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  const closeSuccess = () => {
    setSuccessSnackbar(false);
  };

  const closeError = () => {
    setErrorSnackbar(false);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isSuccess && message === "User registered successfully, please login") {
      setSuccessSnackbar(true);
      const timer = setTimeout(() => {
        dispatch(resetSuccess());
        navigate("/login");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, dispatch, navigate, message]);

  useEffect(() => {
    if (isError) {
      setErrorSnackbar(true);
      const timer = setTimeout(() => {
        dispatch(resetError());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isError, dispatch]);

  const loadingState = isLoading || isSubmitting;

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fdfbf7",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Fade in timeout={500}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3.5, sm: 4.5 },
              borderRadius: 3.5,
              backgroundColor: "#ffffff",
              border: "1px solid #ede8e1",
              boxShadow: "0 10px 30px -5px rgba(188, 108, 37, 0.08)",
            }}
          >
            {/* Header / Brand Icon */}
            <Box sx={{ textAlign: "center", mb: 3.5 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 52,
                  height: 52,
                  borderRadius: "14px",
                  backgroundColor: "rgba(188, 108, 37, 0.1)",
                  color: "#bc6c25",
                  mb: 1.5,
                }}
              >
                <PersonAddOutlinedIcon sx={{ fontSize: 30 }} />
              </Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: 700, color: "#283618", letterSpacing: "-0.3px" }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#6c757d", mt: 0.5, fontSize: "0.875rem" }}
              >
                Start tracking and achieving your goals today
              </Typography>
            </Box>

            {/* Registration Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Username Field */}
                <div>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: "#495057",
                      display: "block",
                      mb: 0.75,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Username
                  </Typography>
                  <TextField
                    placeholder="johndoe"
                    fullWidth
                    disabled={loadingState}
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                    error={Boolean(errors.username)}
                    helperText={errors.username?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon sx={{ color: "#8c98a4", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#fcfaf8",
                        "&:hover fieldset": { borderColor: "#bc6c25" },
                        "&.Mui-focused fieldset": { borderColor: "#bc6c25" },
                      },
                    }}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: "#495057",
                      display: "block",
                      mb: 0.75,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    placeholder="you@example.com"
                    type="email"
                    fullWidth
                    disabled={loadingState}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email",
                      },
                    })}
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon sx={{ color: "#8c98a4", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#fcfaf8",
                        "&:hover fieldset": { borderColor: "#bc6c25" },
                        "&.Mui-focused fieldset": { borderColor: "#bc6c25" },
                      },
                    }}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: "#495057",
                      display: "block",
                      mb: 0.75,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    disabled={loadingState}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: "#8c98a4", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} />
                            ) : (
                              <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#fcfaf8",
                        "&:hover fieldset": { borderColor: "#bc6c25" },
                        "&.Mui-focused fieldset": { borderColor: "#bc6c25" },
                      },
                    }}
                  />
                </div>

                {/* Submit CTA */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loadingState}
                  endIcon={!loadingState && <ArrowForwardIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    mt: 1.5,
                    py: 1.3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    backgroundColor: "#bc6c25",
                    boxShadow: "0 4px 12px rgba(188, 108, 37, 0.25)",
                    "&:hover": {
                      backgroundColor: "#9b581d",
                      boxShadow: "0 6px 16px rgba(188, 108, 37, 0.35)",
                    },
                  }}
                >
                  {loadingState ? (
                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Box>
            </Box>

            {/* Footer Login Hook */}
            <Divider sx={{ my: 3 }} />

            <Typography
              variant="body2"
              align="center"
              sx={{ color: "#6c757d", fontSize: "0.875rem" }}
            >
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: "#bc6c25",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Paper>
        </Fade>
      </Container>

      {/* Snackbars */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={closeSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {message || "Registered successfully! Redirecting to login..."}
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorSnackbar}
        autoHideDuration={4000}
        onClose={closeError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {message || "Registration failed. Please try again."}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;