import { Dialog, DialogContent, DialogTitle, Typography, Button, Modal, Fade, Box, Backdrop } from "@mui/material";
import { useState } from "react";

import dayjs from "dayjs";

function ConfirmacionDialog({ open, onClose, errorMessage }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center', bgcolor: 'primary.dark', color: 'primary.contrastText', pb: 2 }}>
        {errorMessage ? 'Error' : 'Confirmación de Pago'}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mt: 2, mb: 1, color: 'text.primary', textAlign: 'center' }}>
          {errorMessage || 'El pago se ha realizado correctamente.'}
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

export default function ConfirmacionPagoModal ({
  open,
  onClose,
  usuario,
  idAgenda,
  montoPago = 0,
  setUsuario = () => {}, // TODO: Eliminar cuando método para procesar el pago esté implementado.
  onSuccess = () => {} // TODO: Eliminar cuando método para procesar el pago esté implementado.
}) {

  const [confirmacionOpen, setConfirmacionOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const payload = () => ({
    idAgenda: idAgenda,
    fechaPago: dayjs()
  });

  const confirmarPago = async () => {

    // Actualizar el estado del detalle específico a "Pagado"
    if (!idAgenda || !usuario) { 
      setErrorMessage('Información incompleta para procesar el pago.');
      setConfirmacionOpen(true);
      return;
    };

    try {
      // TODO: await metodoParaProcesarElPago(payload());
      throw new Error('Método para procesar el pago no implementado'); // Simulación de error

      // TODO: Eliminar cuando método para procesar el pago esté implementado.
      onSuccess();
      setUsuario(prevUsuario => ({
        ...prevUsuario,
        detallesFacturacion: prevUsuario.detallesFacturacion.map(detalle =>
          detalle.id === idAgenda
            ? { ...detalle, estado: 'Pagado', accion: null }
            : detalle
        )
      }));

      setConfirmacionOpen(true);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setErrorMessage(error.message || 'Error al procesar el pago');
      setConfirmacionOpen(true);
    }
  };

  const handleAceptar = () => {
    setConfirmacionOpen(false);
    onClose();
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        }}
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            outline: 'none',
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#333'
            }}>
              Realizar Pago
            </Typography>

            {/* Icono de check */}
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '3px solid #ff9800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              backgroundColor: 'transparent'
            }}>
              <Typography sx={{
                fontSize: '40px',
                color: '#ff9800',
                fontWeight: 'bold'
              }}>
                ✓
              </Typography>
            </Box>

            <Typography variant="h6" sx={{
              mb: 1,
              color: '#333',
              fontWeight: 'bold'
            }}>
              ¿Está seguro de que desea realizar el pago?
            </Typography>

            <Typography variant="h4" sx={{
              mb: 4,
              color: '#333',
              fontWeight: 'bold'
            }}>
              ${montoPago.toLocaleString()}
            </Typography>

            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#b71c1c'
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={confirmarPago}
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#b71c1c'
                }
              }}
            >
              Aceptar
            </Button>
          </Box>
        </Fade>
      </Modal>
      <ConfirmacionDialog
        open={confirmacionOpen}
        onClose={handleAceptar}
        errorMessage={errorMessage}
      />
    </>
  )
};
