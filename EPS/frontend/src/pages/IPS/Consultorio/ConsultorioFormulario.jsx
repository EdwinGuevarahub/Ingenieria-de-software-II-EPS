import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  MenuItem,
  Slide,
  Snackbar,
  Alert,
} from '@mui/material';
import { validateForm } from '@/../../src/utils/Validation';

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const ConsultorioFormulario = ({
  initialData = {}, // Espera una estructura que refleje el DTO/entidad del backend
  serviciosMedicos = [], // Lista de servicios médicos para el selector
  onSubmit,
  onCancel,
}) => {

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    idIps: '',
    idConsultorio: '',
    cupsServicioMedico: '',
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({
    idConsultorio: false,
    cupsServicioMedico: false,
  });

  // Snackbar state y funciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setIsEditing(true);
      setFormData({
        idIps: initialData.id?.ips?.id || initialData.idIps || '',
        idConsultorio: initialData.id?.idConsultorio || initialData.idConsultorio || '',
        cupsServicioMedico: initialData.servicioMedico?.cupsSermed || initialData.cupsServicioMedico || '',
      });
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const rules = {
      idConsultorio: (value) => !value,
      cupsServicioMedico: (value) => !value || value === '',
    };

    const validationResult = validateForm(formData, rules);
    setErrors(prev => ({ ...prev, ...validationResult.errors }));

    if (!validationResult.isValid) {
      showMessage('Por favor, complete todos los campos obligatorios correctamente.', 'error');
      return;
    }

    // Construir el payload según la estructura esperada por el backend (con ID compuesto)
    const payload = {
      id: {
        ips: {
          id: null, // Ajustar desde ConsultorioLista.
        }, // Ajusta si idIps no es numérico o la estructura es distinta
        idConsultorio: parseInt(formData.idConsultorio, 10) // Ajusta si idConsultorio no es numérico
      },
      servicioMedico: {
        cups: formData.cupsServicioMedico
      }
    };

    onSubmit(payload);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmitForm}
      sx={{
        p: 3,
        marginBottom: 2,
        backgroundColor: isEditing ? undefined : '#f9f9f9',
        borderRadius: isEditing ? undefined : 2, // Bordes redondeados
        boxShadow: isEditing ? undefined : 1, // Sombra sutil
      }}
    >
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} TransitionComponent={SlideTransition} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        {isEditing ? 'Editar Consultorio' : 'Crear Nuevo Consultorio'}
      </Typography>

      <Box display='flex' flexDirection="column" gap={2}>
        {/* Campos para el ID Compuesto */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Nº Identificador del Consultorio *"
            name="idConsultorio"
            value={formData.idConsultorio}
            onChange={handleChange}
            fullWidth
            error={errors.idConsultorio}
            helperText={errors.idConsultorio ? 'El identificador del consultorio es obligatorio.' : ''}
            disabled={isEditing} // Generalmente el ID propio del consultorio no se cambia
            type="number"
          />
        </Grid>
        {/* Campo para Servicio Médico */}
        <Grid size={{ xs: 12 }}>
          <TextField
            select
            label="Seleccione el servicio médico principal del consultorio *"
            name="cupsServicioMedico"
            value={formData.cupsServicioMedico}
            error={errors.cupsServicioMedico}
            helperText={errors.cupsServicioMedico ? 'El nombre de la IPS es obligatorio.' : ''}
            onChange={handleChange}
            fullWidth
          >
            {!formData.cupsServicioMedico && (
              <MenuItem value="">
                <em>Seleccionar Servicio...</em>
              </MenuItem>
            )}

            {serviciosMedicos.map((servicio) => (
              <MenuItem key={servicio.value} value={servicio.value}>
                {servicio.label} ({servicio.value})
              </MenuItem>
            ))}

          </TextField>
        </Grid>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </Box>
    </Box>
  );
};

export default ConsultorioFormulario;
