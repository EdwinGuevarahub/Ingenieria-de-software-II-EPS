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
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    idIps: '',
    idConsultorio: '', 
    cupsServicioMedico: '',     // Para la relación con ServicioMedico
  });
  const [isEditing, setIsEditing] = useState(false);
  const [todosServiciosCUPS, setTodosServiciosCUPS] = useState([]);

  useEffect(() => {
    // Cargar todos los servicios médicos (CUPS) para el selector
    const fetchTodosCUPS = async () => {
      try {
        const data = await listaServiciosMedicos();
        const serviciosArray = data.servicio || data || []; // Ajusta según la respuesta real
        const opciones = serviciosArray.map((s) => ({
          label: s.nombre,
          value: s.cups,
        }));
        setTodosServiciosCUPS(opciones);
      } catch (error) {
        console.error('Error cargando la lista de servicios CUPS:', error);
      }
    };
    fetchTodosCUPS();
  }, []);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setIsEditing(true);
      setFormData({

        idIps: initialData.id?.ips?.id || initialData.idIps || '',
        idConsultorioPropio: initialData.id?.idConsultorio || initialData.idConsultorio || '',
        cupsServicioMedico: initialData.servicioMedico?.cupsSermed || initialData.cupsServicioMedico || '',
      });
    } else {
      setIsEditing(false);
      setFormData({
        idIps: '',
        idConsultorio: '',
        cupsServicioMedico: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    // Construir el payload según la estructura esperada por el backend (con ID compuesto)
    const payload = {
      // Asumiendo que el backend espera el ID de IPS y el CUPS como números/strings directos
      // en el DTO, o anidados si se mapea directamente a la entidad.
      // Para el ID compuesto y la relación:
      id: {
        ips: { id: parseInt(formData.idIps, 10) }, // Ajusta si idIps no es numérico o la estructura es distinta
        idConsultorio: parseInt(formData.idConsultorioPropio, 10) // Ajusta si idConsultorioPropio no es numérico
      },
      servicioMedico: {
        cupsSermed: formData.cupsServicioMedico
      }
    };
    console.log('Payload que se enviará:', payload);
    // Si no se está editando, puede que el backend no espere el objeto 'id' completo,
    // sino los componentes del ID para que él los ensamble, o puede que sí lo espere.
    // Esto depende de tu DTO de creación.
    // Si al crear, el backend espera idIps y idConsultorioPropio como campos separados,
    // y no dentro de un objeto 'id', deberás ajustar el payload de creación.
    // Lo mismo para servicioMedico, podría esperar solo el cupsSermed.

    // Para simplificar, este payload asume que el DTO de backend es flexible
    // o que tienes un DTO de envío que se parece a esto.
    // Es CRUCIAL que este payload coincida con lo que tu API Spring Boot espera.

    onSubmit(payload);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmitForm}
      sx={{
        p: 3,
        backgroundColor: 'background.paper', // Usa colores del tema
        borderRadius: 2,
        boxShadow: 1, // Sombra sutil
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        {isEditing ? 'Editar Consultorio' : 'Crear Nuevo Consultorio'}
      </Typography>
      
      <Grid container spacing={2}>
        {/* Campos para el ID Compuesto */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="ID de la IPS *"
            name="idIps"
            value={formData.idIps}
            onChange={handleChange}
            fullWidth
            required
            disabled={isEditing} // Generalmente el ID de la IPS no se cambia en edición
            helperText={isEditing ? "ID de la IPS (no editable)" : "Ingrese el ID numérico de la IPS"}
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nº Identificador del Consultorio *"
            name="idConsultorioPropio"
            value={formData.idConsultorioPropio}
            onChange={handleChange}
            fullWidth
            required
            disabled={isEditing} // Generalmente el ID propio del consultorio no se cambia
            helperText={isEditing ? "Nº Identificador (no editable)" : "Nº único del consultorio en esta IPS"}
            type="number"
          />
        </Grid>
        {/* Campo para Servicio Médico */}
        <Grid item xs={12}>
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
            <MenuItem value="">
              <em>Seleccionar Servicio...</em>
            </MenuItem>
            {todosServiciosCUPS.map((servicio) => (
              <MenuItem key={servicio.value} value={servicio.value}>
                {servicio.label} ({servicio.value})
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      
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