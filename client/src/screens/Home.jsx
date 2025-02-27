import { useEffect, useState } from "react";
import { resetError, resetSuccess } from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Container, Typography, Box, Snackbar, Alert } from "@mui/material";

const Home = () => {

  const dispatch = useDispatch();
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const closeSuccess = () => setSuccessSnackbar(false);
  const closeError = () => setErrorSnackbar(false);

  const { isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess) {
      setSuccessSnackbar(true);
    }
  }
  , [isSuccess, dispatch]);

  useEffect(() => {
    if (isError) {
      setErrorSnackbar(true);
      setTimeout(() => {
        setErrorSnackbar(false);
        dispatch(resetError());
      }, 3000);
    }
  }
  , [isError, dispatch]);

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Our Application
        </Typography>
        <Typography variant="body1" component="p">
          This is a MERN stack project aimed at helping you set and achieve your
          goals. Explore our features and start your journey today!
        </Typography>
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

export default Home;