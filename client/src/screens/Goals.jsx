import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createGoal,
  getGoals,
  deleteGoal,
  updateGoal,
} from "../features/goal/goalSlice";
import GoalForm from "../components/GoalForm";
import ConfirmModal from "../components/Confirm";
import { Container, Typography, Box, Modal, Button, Alert, Snackbar, Grid } from "@mui/material";
import { resetSuccess, resetError } from "../features/goal/goalSlice";

const Goals = () => {
  const [open, setOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const closeDelete = () => setConfirmDelete(false);

  const dispatch = useDispatch();
  const { goals, isSuccess, isError, message } = useSelector((state) => state.goals);

  useEffect(() => {
    if (isSuccess) {
      setSuccessSnackbar(true);
      setTimeout(() => {
        setSuccessSnackbar(false);
        dispatch(resetSuccess());
      }, 3000);
    }
  }, [isSuccess, dispatch]);

  useEffect(() => {
    if (isError) {
      setErrorSnackbar(true);
      setTimeout(() => {
        setErrorSnackbar(false);
        dispatch(resetError());
      }, 3000);
    }
  }, [isError, dispatch]);

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

  const createGoalUtil = async (data) => {
    await dispatch(createGoal(data));
    await dispatch(getGoals());
    handleClose();
  };

  const deleteGoalUtil = async () => {
    // Add delete logic here
    await dispatch(deleteGoal(selectedGoal._id));
    setConfirmDelete(false);
    await dispatch(getGoals());
  };

  const updateGoalUtil = async (data) => {
    // Add update logic here
    await dispatch(updateGoal(data));
    await dispatch(getGoals());
    handleClose();
  };

  const updateGoalHandler = (goal) => {
    setSelectedGoal(goal);
    handleOpen();
  };

  const deleteGoalHandler = (goal) => {
    setSelectedGoal(goal);
    setDeleteMessage(`Are you sure you want to delete ${goal.title}?`);
    setConfirmDelete(true);
  };

  const createGoalHandler = () => {
    setSelectedGoal(null);
    handleOpen();
  };

  useEffect(() => {
    dispatch(getGoals());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      setSuccessSnackbar(true);
      setTimeout(() => {
        setSuccessSnackbar(false);
      }, 3000);
    }
  }
  , [isSuccess]);

  useEffect(() => {
    if (isError) {
      setErrorSnackbar(true);
      setTimeout(() => {
        setErrorSnackbar(false);
      }, 3000);
    }
  }
  , [isError]);

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Goals
        </Typography>
        <Button onClick={createGoalHandler} variant="contained" color="primary">
          Add Goal
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        {goals.length > 0 ? (
          <Grid container spacing={2}>
            {goals.map((goal) => (
              <Grid item xs={12} sm={6} md={4} key={goal._id}>
                <Box
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    backgroundColor: "#fefae0",
                  }}
                >
                  <Typography variant="h6">{goal.title}</Typography>
                  <Typography>{goal.description}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start Date: {new Date(goal.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    End Date: {new Date(goal.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Category: {goal.category}
                  </Typography>
                  <Container
                    sx={{
                      mt: 2,
                      padding: '1rem 0 !important',
                      display: "flex",
                      justifyContent: "center",
                      backgroundColor: "#dda15e",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#333" }}
                      onClick={() => updateGoalHandler(goal)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ ml: 1 }}
                      onClick={() => deleteGoalHandler(goal)}
                    >
                      Delete
                    </Button>
                  </Container>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" color="textSecondary">
            No Goals available
          </Typography>
        )}
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <GoalForm
            createGoal={createGoalUtil}
            updateGoal={updateGoalUtil}
            closeForm={handleClose}
            goal={selectedGoal}
          />
        </Box>
      </Modal>
      <Modal open={confirmDelete} onClose={closeDelete}>
        <Box sx={style}>
          <ConfirmModal
            confirmAction={deleteGoalUtil}
            cancelAction={() => setConfirmDelete(false)}
            message={deleteMessage}
          />
        </Box>
      </Modal>
      <Snackbar open={successSnackbar} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Snackbar open={errorSnackbar} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Goals;