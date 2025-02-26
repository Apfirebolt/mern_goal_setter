import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createGoal, getGoals } from "../features/goal/goalSlice";
import GoalForm from "../components/GoalForm";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Modal,
  Button,
} from "@mui/material";

const Goals = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();
  const { goals } = useSelector((state) => state.goals);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const createGoalUtil = (data) => {
    dispatch(createGoal(data));
    dispatch(getGoals());
    handleClose();
  }

  console.log(goals);

  useEffect(() => {
    dispatch(getGoals());
  }, [dispatch]);

  return (
    <Container>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Goals
        </Typography>
        <Button onClick={handleOpen} variant="contained" color="primary">
          Add Goal
        </Button>
      </Box>
      <List>
        {goals.map((goal) => (
          <ListItem key={goal._id}>
            <ListItemText primary={goal.title} secondary={goal.description} />
          </ListItem>
        ))}
      </List>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <GoalForm createGoal={createGoalUtil} closeForm={handleClose} />
        </Box>
      </Modal>
    </Container>
  );
};

export default Goals;
