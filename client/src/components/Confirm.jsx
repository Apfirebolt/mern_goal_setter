import { Container, Button, Typography, Box, Paper } from "@mui/material";
import PropTypes from "prop-types";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const ConfirmModal = (props) => {
  const { confirmAction, cancelAction, message } = props;

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <WarningAmberIcon
            sx={{ fontSize: 60, color: "warning.main", mb: 1 }}
          />
          <Typography variant="h5" component="h1" fontWeight="bold">
            Confirm Action
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {message}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={cancelAction}
              fullWidth
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={confirmAction}
              fullWidth
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

ConfirmModal.propTypes = {
  confirmAction: PropTypes.func.isRequired,
  cancelAction: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmModal;
