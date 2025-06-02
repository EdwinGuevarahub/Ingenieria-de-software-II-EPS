// src/components/consultorios/ConsultorioFormulario.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  MenuItem,
} from '@mui/material';

// Asumiendo que este servicio está disponible para poblar el selector de CUPS.
import { listaServiciosMedicos } from '@/../../src/services/serviciosMedicosService.js';

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
        backgroundColor: isEditing ? undefined : '#f9f9f9',
        borderRadius: isEditing ? undefined : 2, // Bordes redondeados
        boxShadow: isEditing ? undefined : 1, // Sombra sutil
      }}
    >
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
            required
            disabled={isEditing} // Generalmente el ID propio del consultorio no se cambia
            helperText={isEditing ? "Nº Identificador (no editable)" : "Nº único del consultorio en esta IPS"}
            type="number"
          />
        </Grid>
        {/* Campo para Servicio Médico */}
        <Grid size={{ xs: 12 }}>
          <TextField
            select
            label="CUPS del Servicio Médico *"
            name="cupsServicioMedico"
            value={formData.cupsServicioMedico}
            onChange={handleChange}
            fullWidth
            required
            helperText="Seleccione el servicio médico principal del consultorio"
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
