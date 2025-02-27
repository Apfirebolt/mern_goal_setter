import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";

const GoalForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      title: props.goal ? props.goal.title : "",
      description: props.goal ? props.goal.description : "",
      category: props.goal ? props.goal.category : "",
      startDate: props.goal ? props.goal.startDate : "",
      endDate: props.goal ? props.goal.endDate : "",
    },
  });

  useEffect(() => {
    if (props.goal) {
      setValue("title", props.goal.title);
      setValue("description", props.goal.description);
      setValue("category", props.goal.category);
      setValue("startDate", props.goal.startDate.split("T")[0]);
      setValue("endDate", props.goal.endDate.split("T")[0]);
    }
  }, [props.goal, setValue]);

  const { createGoal, closeForm } = props;

  const onSubmit = (data) => {
    // Add validation and submit logic here
    if (props.goal) {
      props.updateGoal({ ...data, id: props.goal._id });
    } else {
      createGoal(data);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {props.goal ? "Update Goal" : "Create Goal"}
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
          <Container sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 2 }}
            >
              {props.goal ? "Update" : "Create"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={closeForm}
            >
              Cancel
            </Button>
          </Container>
        </form>
      </Box>
    </Container>
  );
};

GoalForm.propTypes = {
  createGoal: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  goal: PropTypes.object,
  updateGoal: PropTypes.func,
};

export default GoalForm;
