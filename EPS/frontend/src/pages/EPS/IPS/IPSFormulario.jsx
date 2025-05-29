import { useEffect, useState, useRef } from 'react';
import {
  Typography,
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
  const fileInputRef = useRef();

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagen: reader.result });
      };
      reader.readAsDataURL(file); // convierte a base64
    }
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
        {/* Imagen cargada o placeholder */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={formData.imagen}
            alt="Foto"
            sx={{ width: 150, height: 125, borderRadius: 2, objectFit: 'cover' }}
          />
          <Button variant="outlined" size="small" onClick={() => fileInputRef.current.click()}>
            Cargar Imagen
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </Box>

        {/* Campos de texto */}
        <Box sx={{ flex: 1, minWidth: 250, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1">{formData.id || ''}</Typography>
          <TextField label="Nombre" value={formData.nombre || ''} onChange={handleChange('nombre')} />
          <TextField label="Dirección" value={formData.direccion || ''} onChange={handleChange('direccion')} />
          <TextField label="Teléfono" value={formData.telefono || ''} onChange={handleChange('telefono')} />
        </Box>

        {/* Botones */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant="contained" color="error" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" variant="outlined">Guardar</Button>
        </Box>

        {/* Servicios médicos */}
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
