import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { resetError, resetSuccess } from "../features/auth/authSlice";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Snackbar,
  Alert,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import {
  TrackChanges as GoalIcon,
  Search as SearchIcon,
  TrendingUp as ProgressIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircleOutline as CheckIcon,
} from "@mui/icons-material";

const Home = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);

  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess) {
      setSuccessSnackbar(true);
      const timer = setTimeout(() => {
        setSuccessSnackbar(false);
        dispatch(resetSuccess());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, dispatch]);

  useEffect(() => {
    if (isError) {
      setErrorSnackbar(true);
      const timer = setTimeout(() => {
        setErrorSnackbar(false);
        dispatch(resetError());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isError, dispatch]);

  const features = [
    {
      icon: <GoalIcon fontSize="large" color="primary" />,
      title: "Goal Management",
      description:
        "Create, categorize, and prioritize your personal and professional milestones with target deadlines.",
    },
    {
      icon: <SearchIcon fontSize="large" color="primary" />,
      title: "Smart Fuzzy Search",
      description:
        "Instantly find relevant goals even with typos or partial keywords using fast, client-side indexing.",
    },
    {
      icon: <ProgressIcon fontSize="large" color="primary" />,
      title: "Track Progress",
      description:
        "Organize timelines and ensure consistent step-by-step momentum towards your core targets.",
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: "Secure & Cloud-Backed",
      description:
        "Your data is persisted in a reliable MongoDB database with secure token-based user authentication.",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "90vh", pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, transparent 100%)`,
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              letterSpacing: 1.5,
              color: "primary.main",
              display: "inline-block",
              mb: 1,
            }}
          >
            MERN GOAL TRACKER
          </Typography>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.25rem", md: "3.5rem" },
              letterSpacing: "-0.5px",
              mb: 2,
            }}
          >
            Turn Big Ambitions Into{" "}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main || "#1976d2"} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Daily Progress
            </Box>
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 650,
              mx: "auto",
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            A streamlined workspace to structure your goals, monitor your
            timelines, and execute with clarity.
          </Typography>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            {user ? (
              <Button
                component={RouterLink}
                to="/goals"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
                }}
              >
                Go to My Goals
              </Button>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.5,
                    px: 3.5,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 3.5,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Button>
              </>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ mt: -4 }}>
        <Grid container spacing={3}>
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
                  },
                }}
              >
                <CardContent sx={{ p: 1.5 }}>
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Highlights / Banner */}
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: alpha(theme.palette.primary.main, 0.03),
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Built for consistency and speed
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Keep all your personal targets organized in one reliable place with
                instant search, category tags, and status tracking.
              </Typography>
              <Stack spacing={1}>
                {["Intuitive modern layout", "Instant search indexing", "Clean REST API backend"].map((text, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckIcon fontSize="small" color="primary" />
                    <Typography variant="body2" fontWeight={500}>
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ textAlign: { xs: "left", md: "right" } }}>
              <Button
                component={RouterLink}
                to={user ? "/goals" : "/register"}
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                }}
              >
                {user ? "View Dashboard" : "Create an Account"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Snackbars */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorSnackbar}
        autoHideDuration={4000}
        onClose={() => setErrorSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setErrorSnackbar(false)}
          severity="error"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;