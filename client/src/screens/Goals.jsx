import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Fuse from "fuse.js";
import {
  createGoal,
  getGoals,
  deleteGoal,
  updateGoal,
  resetSuccess,
  resetError,
} from "../features/goal/goalSlice";
import GoalForm from "../components/GoalForm";
import Confirm from "../components/Confirm";
import {
  Add as AddIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarIcon,
  TrackChanges as GoalIcon,
} from "@mui/icons-material";
import {
  Container,
  Typography,
  Box,
  Modal,
  Button,
  IconButton,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
  Chip,
  Fade,
  Divider,
  Stack,
  Paper,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 540 },
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  p: 4,
  outline: "none",
};

const Goals = () => {
  const dispatch = useDispatch();
  const { goals = [], isSuccess, isError, message } = useSelector(
    (state) => state.goals
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const closeSuccess = () => setSuccessSnackbar(false);
  const closeError = () => setErrorSnackbar(false);
  const closeDelete = () => setConfirmDelete(false);

  useEffect(() => {
    dispatch(getGoals());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      setSuccessSnackbar(true);
      const timer = setTimeout(() => {
        setSuccessSnackbar(false);
        dispatch(resetSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, dispatch]);

  useEffect(() => {
    if (isError) {
      setErrorSnackbar(true);
      const timer = setTimeout(() => {
        setErrorSnackbar(false);
        dispatch(resetError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isError, dispatch]);

  // Configure Fuse.js instance
  const fuse = useMemo(() => {
    return new Fuse(goals, {
      keys: ["title", "description", "category"],
      threshold: 0.35, // Sensitivity: lower = stricter, higher = fuzzier
      ignoreLocation: true,
    });
  }, [goals]);

  // Compute filtered list based on fuzzy search
  const filteredGoals = useMemo(() => {
    if (!searchQuery.trim()) return goals;
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, fuse, goals]);

  // Action handlers
  const createGoalUtil = async (data) => {
    await dispatch(createGoal(data));
    await dispatch(getGoals());
    handleClose();
  };

  const deleteGoalUtil = async () => {
    await dispatch(deleteGoal(selectedGoal._id));
    setConfirmDelete(false);
    await dispatch(getGoals());
  };

  const updateGoalUtil = async (data) => {
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
    setDeleteMessage(`Are you sure you want to delete "${goal.title}"?`);
    setConfirmDelete(true);
  };

  const createGoalHandler = () => {
    setSelectedGoal(null);
    handleOpen();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            Goal Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage, organize, and track your active milestones
          </Typography>
        </Box>
        <Button
          onClick={createGoalHandler}
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
          }}
        >
          Add Goal
        </Button>
      </Box>

      {/* Search Input Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search goals by title, description, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="clear search"
                  onClick={() => setSearchQuery("")}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2.5,
              backgroundColor: "#f9fafb",
              "&.Mui-focused": {
                backgroundColor: "#fff",
              },
            },
          }}
        />
      </Box>

      {/* Goals Display Grid */}
      {filteredGoals.length > 0 ? (
        <Grid container spacing={3}>
          {filteredGoals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} key={goal._id}>
              <Fade in={true} timeout={300}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 10px 24px rgba(0, 0, 0, 0.08)",
                      borderColor: "primary.light",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <Typography variant="h6" fontWeight={700} noWrap>
                        {goal.title}
                      </Typography>
                      {goal.category && (
                        <Chip
                          label={goal.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 500, borderRadius: 1.5 }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        minHeight: 40,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 2,
                      }}
                    >
                      {goal.description || "No description provided."}
                    </Typography>

                    <Stack spacing={0.8} sx={{ mt: "auto" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarIcon fontSize="inherit" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          <strong>Start:</strong>{" "}
                          {new Date(goal.startDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarIcon fontSize="inherit" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          <strong>End:</strong>{" "}
                          {new Date(goal.endDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>

                  <Divider />

                  <CardActions sx={{ p: 1.5, justifyContent: "flex-end", gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => updateGoalHandler(goal)}
                      sx={{ textTransform: "none" }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteGoalHandler(goal)}
                      sx={{ textTransform: "none" }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Empty State */
        <Paper
          elevation={0}
          sx={{
            py: 8,
            px: 2,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
            backgroundColor: "background.default",
          }}
        >
          <GoalIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
          <Typography variant="h6" fontWeight={600} color="text.secondary">
            {searchQuery ? "No matching goals found" : "No goals yet"}
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
            {searchQuery
              ? "Try tweaking your search term or clearing the filter."
              : "Click 'Add Goal' to create your first goal!"}
          </Typography>
        </Paper>
      )}

      {/* Goal Form Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <GoalForm
            createGoal={createGoalUtil}
            updateGoal={updateGoalUtil}
            closeForm={handleClose}
            goal={selectedGoal}
          />
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Confirm
        open={confirmDelete}
        onClose={closeDelete}
        onConfirm={deleteGoalUtil}
        title="Delete Goal"
        message={deleteMessage}
        confirmText="Delete"
        confirmColor="error"
      />

      {/* Snackbars */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={closeSuccess}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeSuccess}
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
        onClose={closeError}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeError}
          severity="error"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Goals;