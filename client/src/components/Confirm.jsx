import { Container, Button, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";

const ConfirmModal = (props) => {
  const { confirmAction, cancelAction, message } = props;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {message}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={confirmAction}
          style={{ marginRight: "1rem" }}
        >
          Confirm
        </Button>
        <Button variant="contained" color="error" onClick={cancelAction}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

ConfirmModal.propTypes = {
  confirmAction: PropTypes.func.isRequired,
  cancelAction: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmModal;
