import { useEffect, useState, useRef } from 'react';
import {
  Typography,
  Box,
  TextField,
  Chip,
  Button,
  InputAdornment,
  IconButton,
  Slide,
  Snackbar,
  Alert,
} from '@mui/material';
import { listaServiciosMedicosPorIPS } from '@/../../src/services/serviciosMedicosService';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { validateForm } from '@/../../src/utils/Validation';
import ImagenDefault from '@/../../src/assets/Images/placeholder.png';

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const IPSFormulario = ({
  initialData = {},
  onSubmit,
  onCancel,
  isNew = false,
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [serviciosMedicos, setServiciosMedicos] = useState([]);
  const fileInputRef = useRef();

  // Para mostrar y oculatar el contenido de la contraseña.
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // Estado para errores de validación
  const [errors, setErrors] = useState({
    nombre: false,
    direccion: false,
    telefono: false,
    nombreAdministrador: false,
    telefonoAdministrador: false,
    emailAdministrador: false,
    passwordAdministrador: false,
  });

  // Snackbar state y funciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

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
        setFormData({ ...formData, imagen: reader.result.substring(reader.result.indexOf(',') + 1) });
      };
      reader.readAsDataURL(file); // convierte a base64
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rules = {
      nombre: (value) => !value,
      direccion: (value) => !value,
      telefono: (value) => !value || !/^\d+$/.test(value),
    };

    if (isNew) { // Validaciones adicionales si es nueva IPS
      rules.nombreAdministrador = (value) => !value;
      rules.telefonoAdministrador = (value) => !value || !/^\d+$/.test(value);
      rules.emailAdministrador = (value) => !value || !/\S+@\S+\.\S+/.test(value);
      rules.passwordAdministrador = (value) => !value;
    }

    const validationResult = validateForm(formData, rules);
    setErrors(prev => ({ ...prev, ...validationResult.errors }));

    if (!validationResult.isValid) {
      showMessage('Por favor, complete todos los campos obligatorios correctamente.', 'error');
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit({ ...formData });
        showMessage('IPS guardada con éxito.', 'success');
      }
    } catch (error) {
      showMessage('Error al guardar la IPS. Verifique los datos e intente de nuevo.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} TransitionComponent={SlideTransition} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: 2,
          marginBottom: 2,
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
            src={formData && formData.imagen ? `data:image/png;base64,${formData.imagen}` : ImagenDefault}
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

          <Typography
            variant="h6">
            ID: {formData.id || ''}
          </Typography>
          <TextField
            label="Nombre"
            value={formData.nombre || ''}
            error={errors.nombre}
            helperText={errors.nombre ? 'El nombre de la IPS es obligatorio.' : ''}
            onChange={handleChange('nombre')}
          />
          <TextField
            label="Dirección"
            value={formData.direccion || ''}
            error={errors.direccion}
            helperText={errors.direccion ? 'La dirección es obligatoria.' : ''}
            onChange={handleChange('direccion')}
          />
          <TextField
            label="Teléfono"
            value={formData.telefono || ''}
            type="number"
            error={errors.telefono}
            helperText={errors.telefono ? 'El teléfono es obligatorio.' : ''}
            onChange={handleChange('telefono')}
          />

          {/* Campos para creación */}
          {isNew && (
            <>
              <TextField
                label="Nombre Administrador"
                value={formData.nombreAdministrador || ''}
                error={errors.nombreAdministrador}
                helperText={errors.nombreAdministrador ? 'El nombre del admin. es obligatorio.' : ''}
                onChange={handleChange('nombreAdministrador')}
              />
              <TextField
                label="Teléfono Administrador"
                value={formData.telefonoAdministrador || ''}
                type="number"
                error={errors.telefonoAdministrador}
                helperText={errors.telefonoAdministrador ? 'El teléfono del admin. es obligatorio y numérico.' : ''}
                onChange={handleChange('telefonoAdministrador')}
              />
              <TextField
                label="Correo Administrador"
                value={formData.emailAdministrador || ''}
                error={errors.emailAdministrador}
                helperText={errors.emailAdministrador ? 'El correo del admin. es obligatorio y debe ser válido.' : ''}
                onChange={handleChange('emailAdministrador')}
              />
              <TextField
                label='Password Administrador'
                type={showPassword ? "text" : "password"}
                value={formData.passwordAdministrador || ''}
                error={errors.passwordAdministrador}
                helperText={errors.passwordAdministrador ? 'La contraseña del admin. es obligatoria.' : ''}
                onChange={handleChange('passwordAdministrador')}
                slotProps={{
                  input: {
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
                  }
                }}
              />
            </>
          )}
        </Box>

        {/* Botones */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant="contained" color="error" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" variant="contained">Guardar</Button>
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
