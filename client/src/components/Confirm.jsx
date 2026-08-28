import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  IconButton,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import {
  WarningAmberRounded as WarningIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const Confirm = ({
  open,
  onConfirm,
  onClose,
  title = "Delete Goal",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmColor = "error",
  loading = false,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 3,
          p: 1.5,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Top right close button */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        disabled={loading}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          color: "text.disabled",
          "&:hover": { color: "text.primary" },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Header with Icon and Title */}
      <DialogTitle sx={{ pt: 2, pb: 1, px: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: alpha(theme.palette[confirmColor].main, 0.1),
              color: `${confirmColor}.main`,
              flexShrink: 0,
            }}
          >
            <WarningIcon />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      {/* Message Content */}
      <DialogContent sx={{ px: 2, py: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 2, pt: 2, pb: 1, gap: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={loading}
          fullWidth
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "divider",
            color: "text.secondary",
            "&:hover": {
              borderColor: "text.primary",
              backgroundColor: "action.hover",
            },
          }}
        >
          {cancelText}
        </Button>

        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={loading}
          fullWidth
          disableElevation
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: `0 4px 12px ${alpha(theme.palette[confirmColor].main, 0.3)}`,
          }}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Confirm.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmColor: PropTypes.oneOf(["error", "warning", "primary", "secondary", "info", "success"]),
  loading: PropTypes.bool,
};

export default Confirm;