import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  MenuItem, // Para usar con TextField select
} from '@mui/material';

// Asumiendo que tienes un servicio para listar todos los CUPS (Servicios Médicos)
// Este es el mismo que se usa en MedicoFormulario para poblar el modal.
import { listaServiciosMedicos } from '../../services/serviciosMedicosService'; // Ajusta esta ruta!

const ConsultorioFormulario = ({
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    idIps: '', // Podría ser un número
    cupsServicioMedico: '', // Este será el CUPS principal
  });
  const [todosServicios, setTodosServicios] = useState([]); // Para el selector de CUPS

  // Efecto para cargar datos iniciales cuando se edita
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        nombre: initialData.nombre || '',
        telefono: initialData.telefono || '',
        direccion: initialData.direccion || '',
        idIps: initialData.idIps || '',
        cupsServicioMedico: initialData.cupsServicioMedico || '',
        id: initialData.id || null, // Importante para la actualización
      });
    } else {
      // Reset para formulario de creación
      setFormData({
        nombre: '',
        telefono: '',
        direccion: '',
        idIps: '',
        cupsServicioMedico: '',
        id: null,
      });
    }
  }, [initialData]);

  // Efecto para cargar todos los servicios médicos para el selector
  useEffect(() => {
    const fetchTodosServicios = async () => {
      try {
        const data = await listaServiciosMedicos();
        // Asumiendo que la respuesta es como en MedicoFormulario: { servicio: [{ nombre, cups }] } o directamente un array
        const serviciosArray = data.servicio || data || []; 
        const opciones = serviciosArray.map((s) => ({
          label: s.nombre,
          value: s.cups,
        }));
        setTodosServicios(opciones);
      } catch (error) {
        console.error('Error cargando todos los servicios médicos:', error);
      }
    };
    fetchTodosServicios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (onSubmit) {
        // El objeto formData ya contiene el 'id' si es una edición
        // y todos los campos necesarios para crear o actualizar.
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Error al guardar el consultorio:', error);
      // Aquí podrías añadir feedback al usuario
    }
  };

  const isEditing = Boolean(formData.id);

  return (
    <Box
      component="form"
      onSubmit={handleSubmitForm}
      sx={{
        mb: 4,
        p: 3, // Aumentado padding
        border: '1px solid #e0e0e0', // Borde más suave
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)', // Sombra sutil
        backgroundColor: 'background.paper', // Usar color de fondo del tema
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}> {/* Título más prominente */}
        {isEditing ? 'Editar Consultorio' : 'Crear Nuevo Consultorio'}
      </Typography>
      
      <Grid container spacing={3}> {/* Aumentado spacing */}
        {/* No he añadido la imagen como en MedicoFormulario, ya que no parece ser un campo del consultorio */}
        {/* Si necesitas una imagen, puedes añadirla aquí de forma similar */}

        <Grid item xs={12} md={6}>
          <TextField
            label="Nombre del Consultorio"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined" // Estilo estándar
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="ID de la IPS"
            name="idIps"
            // type="number" // Descomenta si es estrictamente numérico y quieres validación del navegador
            value={formData.idIps}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            helperText="ID numérico de la Institución Prestadora de Salud"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select // Esto lo convierte en un selector
            label="Servicio Médico Principal (CUPS)"
            name="cupsServicioMedico"
            value={formData.cupsServicioMedico}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            helperText="Seleccione el código CUPS principal del consultorio"
          >
            <MenuItem value="">
              <em>Ninguno</em>
            </MenuItem>
            {todosServicios.map((servicio) => (
              <MenuItem key={servicio.value} value={servicio.value}>
                {servicio.label} ({servicio.value})
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}> {/* Separación y gap */}
        <Button onClick={onCancel} variant="outlined" color="secondary"> {/* Estilo más estándar */}
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? 'Actualizar Consultorio' : 'Crear Consultorio'}
        </Button>
      </Box>
    </Box>
  );
};

export default ConsultorioFormulario;