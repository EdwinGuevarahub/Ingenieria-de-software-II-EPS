import { useEffect, useState, useRef } from 'react';
import {
  Box,
  TextField,
  Typography,
  Chip,
  Button,
  Modal,
  Fade,
  Backdrop,
  InputAdornment,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import {
  listaServiciosMedicosPorMedico,
  listaServiciosMedicos,
  agregarServiciosMedicosPorMedico,
  eliminarServiciosMedicosPorMedico,
} from '@/../../src/services/serviciosMedicosService';
import Horario from '@/../../src/pages/IPS/Horario/Horario';
import {Visibility, VisibilityOff} from '@mui/icons-material';


const MedicoFormulario = ({
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [serviciosMedicos, setServiciosMedicos] = useState([]);
  const [todosServicios, setTodosServicios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalHorarioAbierto, setModalHorarioAbierto] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const fileInputRef = useRef();
  
  // Para mostrar y oculatar el contenido de la contraseña.
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    const fetchServiciosDelMedico = async () => {
      if (initialData?.dni) {
        try {
          const servicios = await listaServiciosMedicosPorMedico(initialData.dni);
          setServiciosMedicos(servicios);
        } catch (error) {
          console.error('Error cargando servicios del médico:', error);
        }
      }
    };
    fetchServiciosDelMedico();
  }, [initialData?.dni]);

  useEffect(() => {
    const fetchTodosServicios = async () => {
      try {
        const servicios = await listaServiciosMedicos();
        const opciones = servicios.map((s) => ({
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

  const handleChange = (key) => (e) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleEliminarServicio = async (cups) => {
    try {
      if (formData.dni) {
        await eliminarServiciosMedicosPorMedico(formData.dni, cups);
      }
      setServiciosMedicos(serviciosMedicos.filter(s => s.cups !== cups));
    } catch (error) {
      console.error('Error eliminando servicio del médico:', error);
    }
  };

  const handleAgregarServicio = async () => {
    const nuevo = todosServicios.find(s => s.value === servicioSeleccionado);
    if (!nuevo || serviciosMedicos.some(s => s.cups === nuevo.value)) return;

    try {
      if (formData.dni) {
        await agregarServiciosMedicosPorMedico(formData.dni, nuevo.value);
      }
      setServiciosMedicos([
        ...serviciosMedicos,
        { cups: nuevo.value, nombre: nuevo.label },
      ]);
    } catch (error) {
      console.error('Error agregando servicio al médico:', error);
    }

    setModalAbierto(false);
    setServicioSeleccionado('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (onSubmit) {
        await onSubmit({ ...formData });
      }
    } catch (error) {
      console.error('Error al guardar el médico:', error);
    }
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

        <Box sx={{ flex: 1, minWidth: 250, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nombre" value={formData.nombre || ''} onChange={handleChange('nombre')} />
          <TextField
            label='Password'
            type={showPassword ? "text" : "password"}
            value={formData.password || ''}
            onChange={handleChange('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField label="DNI" value={formData.dni || ''} onChange={handleChange('dni')} />
          <TextField label="Correo" value={formData.email || ''} onChange={handleChange('email')} />
          <TextField label="Teléfono" value={formData.telefono || ''} onChange={handleChange('telefono')} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant="contained" color="error" onClick={onCancel}>Cancelar</Button>
          <Button variant="contained" onClick={() => setModalHorarioAbierto(true)}>Horario</Button>
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
                onDelete={() => handleEliminarServicio(servicio.cups)}
                deleteIcon={<DeleteIcon />}
              />
            ))
          ) : (
            <Chip label="Sin servicios" variant="outlined" />
          )}

          <Chip
            icon={<AddIcon />}
            label="Agregar"
            clickable
            color="success"
            onClick={() => setModalAbierto(true)}
            variant="outlined"
          />
        </Box>
      </Box>

      <Modal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={modalAbierto}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            <Typography variant="h6">Agregar servicio médico</Typography>
            <TextField
              select
              label="Seleccionar servicio"
              value={servicioSeleccionado}
              onChange={(e) => setServicioSeleccionado(e.target.value)}
            >
              {todosServicios.map((servicio) => (
                <option key={servicio.value} value={servicio.value}>
                  {servicio.label}
                </option>
              ))}
            </TextField>
            <Button variant="contained" onClick={handleAgregarServicio} disabled={!servicioSeleccionado}>
              Agregar
            </Button>
          </Box>
        </Fade>
      </Modal>
      <Horario open={modalHorarioAbierto} onClose={() => setModalHorarioAbierto(false)} />

    </form>
  );
};

export default MedicoFormulario;
