import { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Chip,
  Button,
} from '@mui/material';
import { listaServiciosMedicosPorIPS } from '@/../../src/services/serviciosMedicosService';

const IPSFormulario = ({
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [serviciosMedicos, setServiciosMedicos] = useState([]);

  useEffect(() => {
    const fetchServiciosDeLaIPS = async () => {
      if (initialData?.id) {
        try {
          const servicios = await listaServiciosMedicosPorIPS(initialData.id);
          setServiciosMedicos(servicios);
        } catch (error) {
          console.error('Error cargando servicios de la IPS:', error);
        }
      }
    };
    fetchServiciosDeLaIPS();
  }, [initialData?.id]);

  const handleChange = (key) => (e) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (onSubmit) {
        await onSubmit({ ...formData });
      }
    } catch (error) {
      console.error('Error al guardar la IPS:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: 2,
          borderRadius: 2,
          gap: 2,
          flexWrap: 'wrap',
          width: '100%',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Box
          component="img"
          src="https://picsum.photos/300"
          alt="Foto"
          sx={{ width: 150, height: 125, borderRadius: 2, objectFit: 'cover' }}
        />

        <Box sx={{ flex: 1, minWidth: 250, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nombre" value={formData.nombre || ''} onChange={handleChange('nombre')} />
          <TextField label="Código" value={formData.id || ''} onChange={handleChange('id')} />
          <TextField label="Dirección" value={formData.direccion || ''} onChange={handleChange('direccion')} />
          <TextField label="Teléfono" value={formData.telefono || ''} onChange={handleChange('telefono')} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant="contained" color="error" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" variant="outlined">Guardar</Button>
        </Box>

        <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {serviciosMedicos.length > 0 ? (
            serviciosMedicos.map((servicio) => (
              <Chip
                key={servicio.cups}
                label={servicio.nombre}
                color="primary"
                variant="outlined"
              />
            ))
          ) : (
            <Chip label="Sin servicios" variant="outlined" />
          )}
        </Box>
      </Box>
    </form>
  );
};

export default IPSFormulario;
