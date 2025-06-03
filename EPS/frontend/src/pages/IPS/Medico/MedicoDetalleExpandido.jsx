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
import { estadoMedico } from '@/../../src/services/medicosService';

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

const IPSDetalleExpandido = ({ 
    detalle, 
    onEditar, 
    setEditandoMedico, 
    setModalHorarioAbierto 
}) => {
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
            await estadoMedico(detalle[0].dni);
            setActivo((prev) => !prev);
            showMessage(`Médico ${activo ? 'desactivado' : 'activado'} correctamente.`, 'success');
        } catch (error) {
            console.error('Error al cambiar estado del médico:', error);
            showMessage('Error al cambiar el estado del médico.', 'error');
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
                alt="Imagen del médico"
                sx={{ width: 150, height: 125, objectFit: 'cover', borderRadius: 2 }}
            />
            <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="h6">{detalle[0].nombre}</Typography>
                <Typography variant="body2">ID: {detalle[0].dni}</Typography>
                <Typography variant="body2">Correo: {detalle[0].email}</Typography>
                <Typography variant="body2">Teléfono: {detalle[0].telefono}</Typography>
                <Typography variant="body2">
                    Estado: {detalle[0].activo ? 'Activo' : 'Inactivo'}
                </Typography>
            </Box>



            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => onEditar(detalle[0])}
                >
                    Editar
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        setEditandoMedico(detalle[0]);
                        setModalHorarioAbierto(true);
                    }}
                >
                    Horario
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
                        ? '¿Estás seguro de que quieres desactivar este médico?'
                        : '¿Estás seguro de que quieres activar este médico?'
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
