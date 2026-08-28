import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Grid,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  CancelOutlined,
  AddCircleOutline,
  EditOutlined,
  Title as TitleIcon,
  CategoryOutlined,
  EventNoteOutlined,
  CalendarMonthOutlined,
} from "@mui/icons-material";

const CATEGORY_OPTIONS = [
  "Career & Professional",
  "Health & Fitness",
  "Personal Development",
  "Finance",
  "Learning & Skills",
  "Other",
];

const GoalForm = ({ goal, createGoal, updateGoal, closeForm }) => {
  const isEditing = Boolean(goal);

  const formatInitialDate = (dateVal) => {
    if (!dateVal) return "";
    return dateVal.includes("T") ? dateVal.split("T")[0] : dateVal;
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: goal?.title || "",
      description: goal?.description || "",
      category: goal?.category || "",
      startDate: formatInitialDate(goal?.startDate),
      endDate: formatInitialDate(goal?.endDate),
    },
  });

  const startDateVal = watch("startDate");

  useEffect(() => {
    reset({
      title: goal?.title || "",
      description: goal?.description || "",
      category: goal?.category || "",
      startDate: formatInitialDate(goal?.startDate),
      endDate: formatInitialDate(goal?.endDate),
    });
  }, [goal, reset]);

  const onSubmit = (data) => {
    if (isEditing) {
      updateGoal?.({ ...data, id: goal._id });
    } else {
      createGoal?.(data);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        border: "1px solid #ede8e1",
        backgroundColor: "#ffffff",
        maxWidth: "600px",
        mx: "auto",
        boxShadow: "0 8px 24px -4px rgba(188, 108, 37, 0.08)",
      }}
    >
      {/* Form Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 700, color: "#283618", letterSpacing: "-0.3px" }}
        >
          {isEditing ? "Edit Goal" : "Create New Goal"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#6c757d", mt: 0.5 }}>
          {isEditing
            ? "Update your milestones and timeline parameters"
            : "Define your target milestone, timelines, and action plan"}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Form Fields */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2.5}>
          {/* Title */}
          <Grid item xs={12}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "#495057",
                display: "block",
                mb: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Goal Title
            </Typography>
            <TextField
              placeholder="e.g., Complete AWS Solutions Architect Certification"
              fullWidth
              disabled={isSubmitting}
              {...register("title", {
                required: "Goal title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon sx={{ color: "#8c98a4", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#fcfaf8",
                  "&:hover fieldset": { borderColor: "#bc6c25" },
                  "&.Mui-focused fieldset": { borderColor: "#bc6c25" },
                },
              }}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "#495057",
                display: "block",
                mb: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Category
            </Typography>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  disabled={isSubmitting}
                  error={Boolean(errors.category)}
                  helperText={errors.category?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryOutlined sx={{ color: "#8c98a4", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fcfaf8",
                      "&:hover fieldset": { borderColor: "#bc6c25" },
                      "&.Mui-focused fieldset": { borderColor: "#bc6c25" },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select a category</em>
                  </MenuItem>
                  {CATEGORY_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "#495057",
                display: "block",
                mb: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Description & Action Plan
            </Typography>
            <TextField
              placeholder="Outline specific objectives, measurable metrics, and milestones..."
              fullWidth
              multiline
              rows={4}
              disabled={isSubmitting}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description should be at least 10 characters",
                },
              })}
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#fcfaf8",
                  "&:hover fieldset": { borderColor: "#bc6c25" },
                  "&.Mui-focused fieldset": { borderColor: "#bc6c25" },
                },
              }}
            />
          </Grid>

          {/* Start Date */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "#495057",
                display: "block",
                mb: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Start Date
            </Typography>
            <TextField
              type="date"
              fullWidth
              disabled={isSubmitting}
              {...register("startDate", { required: "Start date is required" })}
              error={Boolean(errors.startDate)}
              helperText={errors.startDate?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthOutlined sx={{ color: "#8c98a4", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#fcfaf8",
                  "&:hover fieldset": { borderColor: "#bc6c25" },
                  "&.Mui-focused fieldset": { borderColor: "#bc6c25" },
                },
              }}
            />
          </Grid>

          {/* End Date */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "#495057",
                display: "block",
                mb: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Target Completion Date
            </Typography>
            <TextField
              type="date"
              fullWidth
              disabled={isSubmitting}
              {...register("endDate", {
                required: "End date is required",
                validate: (value) =>
                  !startDateVal ||
                  value >= startDateVal ||
                  "End date cannot be prior to start date",
              })}
              error={Boolean(errors.endDate)}
              helperText={errors.endDate?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventNoteOutlined sx={{ color: "#8c98a4", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#fcfaf8",
                  "&:hover fieldset": { borderColor: "#bc6c25" },
                  "&.Mui-focused fieldset": { borderColor: "#bc6c25" },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Action Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<CancelOutlined />}
            onClick={closeForm}
            disabled={isSubmitting}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              borderColor: "#d5d5d5",
              "&:hover": { borderColor: "#999", backgroundColor: "#f8f9fa" },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isEditing ? (
                <EditOutlined sx={{ fontSize: 18 }} />
              ) : (
                <AddCircleOutline sx={{ fontSize: 18 }} />
              )
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3.5,
              fontWeight: 600,
              backgroundColor: "#bc6c25",
              boxShadow: "0 4px 12px rgba(188, 108, 37, 0.25)",
              "&:hover": {
                backgroundColor: "#9b581d",
                boxShadow: "0 6px 16px rgba(188, 108, 37, 0.35)",
              },
            }}
          >
            {isEditing ? "Save Changes" : "Create Goal"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

GoalForm.propTypes = {
  createGoal: PropTypes.func,
  updateGoal: PropTypes.func,
  closeForm: PropTypes.func.isRequired,
  goal: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
};

export default GoalForm;