import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Button,
  alpha,
  useTheme,
} from "@mui/material";
import {
  TrackChanges as TrackChangesIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  AutoAwesome as AutoAwesomeIcon,
} from "@mui/icons-material";

const techStack = [
  { label: "React.js", category: "Frontend" },
  { label: "Redux Toolkit", category: "State Management" },
  { label: "Material UI", category: "UI Library" },
  { label: "Fuse.js", category: "Fuzzy Search" },
  { label: "Node.js", category: "Runtime" },
  { label: "Express.js", category: "Backend" },
  { label: "MongoDB", category: "Database" },
  { label: "JWT", category: "Authentication" },
];

const pillars = [
  {
    icon: <TrackChangesIcon fontSize="large" color="primary" />,
    title: "Action-Oriented Goal Setting",
    description:
      "Break down ambitious milestones into actionable, time-bound targets with clean categorization.",
  },
  {
    icon: <TimelineIcon fontSize="large" color="primary" />,
    title: "Clarity & Progress Tracking",
    description:
      "Track your start and end dates with structured views designed to keep daily momentum going.",
  },
  {
    icon: <SecurityIcon fontSize="large" color="primary" />,
    title: "Secure & Cloud-Backed",
    description:
      "Your personal milestones are persisted securely using industry-standard JWT authentication and cloud storage.",
  },
];

const About = () => {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "90vh", pb: 8 }}>
      {/* Header / Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, transparent 100%)`,
          pt: { xs: 6, md: 9 },
          pb: { xs: 6, md: 8 },
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
            OUR MISSION
          </Typography>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.2rem", md: "3rem" },
              letterSpacing: "-0.5px",
              mb: 2,
            }}
          >
            Empowering You to Achieve What Matters Most
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 680,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            We built this workspace to simplify goal management. No clutter, no
            friction—just clear milestones and lightning-fast search to keep you
            moving forward.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        {/* Core Pillars Grid */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {pillars.map((item, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.06)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tech Stack Breakdown Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            mb: 8,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <CodeIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>
              Technology Architecture
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Crafted on a modern full-stack architecture ensuring speed, scalability, and seamless user experience.
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {techStack.map((tech) => (
              <Chip
                key={tech.label}
                label={`${tech.label} • ${tech.category}`}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  fontWeight: 500,
                  borderColor: "divider",
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Bottom CTA Card */}
        <Box
          sx={{
            textAlign: "center",
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.06),
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.15),
          }}
        >
          <AutoAwesomeIcon color="primary" sx={{ fontSize: 36, mb: 1.5 }} />
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Ready to track your goals?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 500, mx: "auto", mb: 3 }}
          >
            Start mapping out your next milestones today and experience effortless progress tracking.
          </Typography>
          <Button
            component={RouterLink}
            to="/goals"
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1.3,
            }}
          >
            Get Started
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default About;