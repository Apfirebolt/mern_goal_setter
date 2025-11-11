import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: 8,
        px: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === "light" ? "#fefae0" : "#2d2d2d",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "flex-start" },
            gap: 3,
            mb: 3,
          }}
        >
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Goals Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={300}>
              Track your goals, achieve your dreams. Stay organized and
              motivated on your journey to success.
            </Typography>
          </Box>

          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="600">
              Quick Links
            </Typography>
            <Typography variant="body2" color="text.secondary">
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Privacy Policy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Terms of Service
            </Typography>
          </Box>

          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="600">
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              support@goalstracker.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Follow us on social media
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {"© "}
            {new Date().getFullYear()}
            {" Goals Tracker. All rights reserved."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
