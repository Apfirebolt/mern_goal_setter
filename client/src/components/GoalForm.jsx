import { useForm } from "react-hook-form";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";

const GoalForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createGoal, closeForm } = props;

  const onSubmit = (data) => {
    // Add validation and submit logic here
    console.log(data);
    createGoal(data);
    // dispatch(createGoal(data));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Goal
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Title"
            name="title"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ""}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            {...register("description", {
              required: "Description is required",
            })}
            rows={4}
            multiline
            error={!!errors.description}
            helperText={errors.description ? errors.description.message : ""}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Category"
            name="category"
            {...register("category", { required: "Category is required" })}
            error={!!errors.category}
            helperText={errors.category ? errors.category.message : ""}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            {...register("startDate", { required: "Start Date is required" })}
            error={!!errors.startDate}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            {...register("endDate", { required: "End Date is required" })}
            error={!!errors.endDate}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Goal
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => closeForm()}
          >
            Cancel
          </Button>
        </form>
      </Box>
    </Container>
  );
};

GoalForm.propTypes = {
  createGoal: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
};

export default GoalForm;
