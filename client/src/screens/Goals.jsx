import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const Goals = () => {
  const goals = [
    "Learn React",
    "Build a MERN stack application",
    "Deploy the application",
    "Improve coding skills",
  ];

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Goals
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          Here are your current goals. Keep track of your progress and stay
          motivated!
        </Typography>
        <List>
          {goals.map((goal, index) => (
            <ListItem key={index}>
              <ListItemText primary={goal} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Goals;
