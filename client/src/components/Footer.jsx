import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        py: 3,
        px: 2,
        mt: "2.5rem",
        backgroundColor: "#fefae0",
        textAlign: "center",
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1">Welcome to Goals Tracker</Typography>
        <Typography variant="body2" color="text.secondary">
          {"© "}
          {new Date().getFullYear()}
          {" Goals Tracker"}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
