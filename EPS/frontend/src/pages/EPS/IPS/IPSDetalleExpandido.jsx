import { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Slide,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmDialog from '@/../../src/components/ConfirmDialog';
import ImagenDefault from '@/../../src/assets/Images/placeholder.png';
import { estadoIPS } from '@/../../src/services/ipsService';

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const IPSDetalleExpandido = ({ detalle, onEditar }) => {
  const [activo, setActivo] = useState(detalle[0].activo);
  const [cargando, setCargando] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  // Snackbar state y funciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleToggleConfirm = () => {
    setOpenConfirm(true);
  };
  const handleCancelConfirm = () => {
    setOpenConfirm(false);
  };

  const handleConfirmarToggle = async () => {
    setOpenConfirm(false);
    setCargando(true);
    try {
      await estadoIPS(detalle[0].id);
      setActivo((prev) => !prev);
      showMessage(`IPS ${activo ? 'desactivada' : 'activada'} correctamente.`, 'success');
    } catch (error) {
      console.error('Error al cambiar estado de la IPS:', error);
      showMessage('Error al cambiar el estado de la IPS.', 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, p: 2 }}>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} TransitionComponent={SlideTransition} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box
        component="img"
        src={detalle[0].imagen ? `data:image/png;base64,${detalle[0].imagen}` : ImagenDefault}
        alt="Imagen de la IPS"
        sx={{ width: 150, height: 125, objectFit: 'cover', borderRadius: 2 }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6">{detalle[0].nombre}</Typography>
        <Typography variant="body2">ID: {detalle[0].id}</Typography>
        <Typography variant="body2">Dirección: {detalle[0].direccion}</Typography>
        <Typography variant="body2">Teléfono: {detalle[0].telefono}</Typography>
        <Typography variant="body2">Fecha de creación: {detalle[0].fechaRegistro}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => onEditar(detalle[0])}
        >
          Editar
        </Button>

        <FormControlLabel
          control={
            <Switch
              checked={activo}
              onChange={handleToggleConfirm}
              disabled={cargando}
              color="primary"
            />
          }
          label={activo ? 'Activa' : 'Inactiva'}
        />
      </Box>


      <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Array.isArray(detalle[1]) && detalle[1].length > 0 ? (
          detalle[1].map((servicio, idx) => (
            <Chip key={idx} label={servicio.nombre} color="primary" variant="outlined" />
          ))
        ) : (
          <Chip label="Sin servicios" color="default" variant="outlined" />
        )}
      </Box>

      <ConfirmDialog
        open={openConfirm}
        title={activo ? 'Confirmar Desactivación' : 'Confirmar Activación'}
        message={
          activo
            ? '¿Estás seguro de que quieres desactivar esta IPS?'
            : '¿Estás seguro de que quieres activar esta IPS?'
        }
        confirmText={activo ? 'Sí, Desactivar' : 'Sí, Activar'}
        cancelText="Cancelar"
        onConfirm={handleConfirmarToggle}
        onCancel={handleCancelConfirm}
      />
    </Box>
  );
};

export default IPSDetalleExpandido;
