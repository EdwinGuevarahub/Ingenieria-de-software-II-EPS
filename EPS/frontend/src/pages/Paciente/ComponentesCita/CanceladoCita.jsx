import {CheckBox, Close} from "@mui/icons-material";
import {Box, Button, Dialog, DialogContent, DialogTitle, Typography} from "@mui/material";
import {useState} from "react";

function ConfirmacionDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center', bgcolor: 'primary.dark', color: 'primary.contrastText', pb: 2 }}>
        Éxito
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mt: 2, mb: 1, color: 'text.primary', textAlign: 'center' }}>
          Cita cancelada con éxito.
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={onClose}
          >
            Aceptar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function ErrorDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center', bgcolor: 'primary.dark', color: 'primary.contrastText', pb: 2 }}>
        Error
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mt: 2, mb: 1, color: 'text.primary', textAlign: 'center' }}>
          Ha ocurrido un error en la cancelación de la cita.
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={onClose}
          >
            Aceptar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default function CanceladoCitaModal({ open, onClose, idAgenda }) {

  const [confirmacionOpen, setConfirmacionOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const handleConfirm = () => {
    // TODO: Implementar llamado a servicio para eliminación de la agenda.
    console.log(`Estoy haciendo vainas raras de back con la agenda ${idAgenda}`);
    if (true)
      setConfirmacionOpen(true);
    else
      setErrorOpen(true);
  };

  const handleAceptar = () => {
    setConfirmacionOpen(false);
    setErrorOpen(false);
    onClose();
  }


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center', bgcolor: 'primary.dark', color: 'primary.contrastText', pb: 2 }}>
        Cancelar Cita
      </DialogTitle>

      <DialogContent>

        <Typography variant="body1" sx={{ mt: 2, mb: 1, color: 'text.primary', textAlign: 'center' }}>
          ¿Está seguro de que desea cancelar esta cita?
        </Typography>

        <Typography variant="body1" sx={{ mt: 2, mb: 1, color: 'red', textAlign: 'center' }}>
          ¡¡Esta acción no puede deshacerse!!
        </Typography>

        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            startIcon={<Close />}
          >
            Cancelar
          </Button>

          <Button
            variant="red"
            onClick={handleConfirm}
            startIcon={<CheckBox />}
          >
            Confirmar
          </Button>
        </Box>
      </DialogContent>

      <ConfirmacionDialog
        open={confirmacionOpen}
        onClose={handleAceptar}
      />
      <ErrorDialog
        open={errorOpen}
        onClose={handleAceptar}
      />
    </Dialog>
  );
}
