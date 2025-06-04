import { Dialog, DialogContent, DialogTitle, Typography, Button, Modal, Fade, Box, Backdrop, CircularProgress } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import { registrarPagos, crearDatosPago } from "../../services/registrarPagos";

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
  idPaciente, // TODO: Incluir extracción de paciente en backend para rol PACIENTE.
  idAgenda,
  montoPago = 0,
  setUsuario = () => {},
  onSuccess = () => {}
}) {

  const [confirmacionOpen, setConfirmacionOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [procesandoPago, setProcesandoPago] = useState(false);

  const confirmarPago = async () => {
    // Validar datos necesarios
    if (!idAgenda || !idPaciente) {
      setErrorMessage('Información incompleta para procesar el pago. Verifique el ID del paciente y la agenda.');
      setConfirmacionOpen(true);
      return;
    }

    setProcesandoPago(true);

    try {
      console.log('Procesando pago:', { idPaciente, idAgenda, montoPago });

      // Crear datos del pago usando la función auxiliar
      const datosPago = crearDatosPago(idAgenda, dayjs().toISOString());

      console.log('Datos de pago creados:', datosPago);

      // Llamar al servicio real de pagos
      const resultado = await registrarPagos(idPaciente, datosPago);
      console.log('resultado', resultado)

      if (resultado.success) {
        console.log('Pago registrado exitosamente:', resultado.data);

        // Actualizar estado local si setUsuario está disponible (para compatibilidad)
        if (setUsuario && typeof setUsuario === 'function') {
          setUsuario(prevUsuario => ({
            ...prevUsuario,
            detallesFacturacion: prevUsuario.detallesFacturacion?.map(detalle =>
              detalle.id === idAgenda
                ? { ...detalle, estado: 'Pagado', accion: null }
                : detalle
            ) || []
          }));
        }

        // Llamar función de éxito
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(resultado.data);
        }

        // Mostrar confirmación de éxito
        setErrorMessage(''); // Limpiar error previo
        setConfirmacionOpen(true);

      } else {
        console.error('Error en el servicio de pagos:', resultado.message);
        setErrorMessage(resultado.message || 'Error al procesar el pago');
        setConfirmacionOpen(true);
      }

    } catch (error) {
      console.error('Error inesperado al procesar el pago:', error);
      setErrorMessage('Error inesperado al procesar el pago. Inténtelo nuevamente.');
      setConfirmacionOpen(true);
    } finally {
      setProcesandoPago(false);
    }
  };

  const handleAceptar = () => {
    setConfirmacionOpen(false);
    setErrorMessage(''); // Limpiar mensaje de error
    onClose();
  };

  const handleCancelar = () => {
    if (!procesandoPago) {
      onClose();
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleCancelar}
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

            {/* Icono */}
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
              {procesandoPago ? (
                <CircularProgress
                  size={40}
                  sx={{ color: '#ff9800' }}
                />
              ) : (
                <Typography sx={{
                  fontSize: '40px',
                  color: '#ff9800',
                  fontWeight: 'bold'
                }}>
                  $
                </Typography>
              )}
            </Box>

            <Typography variant="h6" sx={{
              mb: 1,
              color: '#333',
              fontWeight: 'bold'
            }}>
              {procesandoPago
                ? 'Procesando pago...'
                : '¿Está seguro de que desea realizar el pago?'
              }
            </Typography>

            <Typography variant="h4" sx={{
              mb: 4,
              color: '#333',
              fontWeight: 'bold'
            }}>
              ${montoPago.toLocaleString()}
            </Typography>

            {/* Información adicional */}
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                <strong>Paciente:</strong> {idPaciente}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                <strong>Agenda ID:</strong> {idAgenda}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                <strong>Fecha:</strong> {dayjs().format('DD/MM/YYYY HH:mm')}
              </Typography>
            </Box>

            {/* Botones */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleCancelar}
                disabled={procesandoPago}
                sx={{
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: '#b71c1c',
                    backgroundColor: 'rgba(211, 47, 47, 0.04)'
                  },
                  '&:disabled': {
                    borderColor: '#ccc',
                    color: '#999'
                  }
                }}
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                onClick={confirmarPago}
                disabled={procesandoPago}
                sx={{
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: '#b71c1c'
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc'
                  }
                }}
              >
                {procesandoPago ? 'Procesando...' : 'Confirmar Pago'}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <ConfirmacionDialog
        open={confirmacionOpen}
        onClose={handleAceptar}
        errorMessage={errorMessage}
      />
    </>
  );
}