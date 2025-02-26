import { Container, Typography, Box } from "@mui/material";

const Home = () => {
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
    </Container>
  );
};

export default Home;
