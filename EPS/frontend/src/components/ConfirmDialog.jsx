// ConfirmDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
} from '@mui/material';

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Sí',
  cancelText = 'Cancelar',
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'background.default',
          borderRadius: 3,
          boxShadow: theme.shadows[10],
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.2rem' }}>{title}</DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', mt: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{ borderRadius: 2, textTransform: 'none', color: '#fff' }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
