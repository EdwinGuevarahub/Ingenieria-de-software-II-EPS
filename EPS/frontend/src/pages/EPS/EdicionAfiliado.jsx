import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { listarPacientes, actualizarPaciente } from '../../services/pacientesService';

const EdicionAfiliado = () => {
  const { afiliadoId } = useParams();
  const navigate = useNavigate();

  // Estados para el formulario
  const [datosAfiliado, setDatosAfiliado] = useState({
    // Datos cotizante (titular)
    dniCotizante: '',
    nombreCotizante: '',
    fechaNacimientoCotizante: '',
    emailCotizante: '',
    passwordCotizante: '',
    telefonoCotizante: '',
    sexoCotizante: '',
    direccionCotizante: '',

    // Beneficiarios (array de beneficiarios)
    beneficiarios: []
  });

  // Estados para la UI
  const [cargando, setCargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('success');
  const [mostrarValidacion, setMostrarValidacion] = useState(false);

  // Estados para modales de resultado
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
  const [modalErrorAbierto, setModalErrorAbierto] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const opcionesSexo = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' }
  ];

  const opcionesParentesco = [
    { value: 'Conyuge', label: 'Cónyuge' },
    { value: 'Hijo', label: 'Hijo' },
    { value: 'Hija', label: 'Hija' },
    { value: 'Padre', label: 'Padre' },
    { value: 'Madre', label: 'Madre' },
    { value: 'Hermano', label: 'Hermano' },
    { value: 'Hermana', label: 'Hermana' }
  ];

  // Cargar datos del afiliado al montar el componente
  useEffect(() => {
    const cargarDatosAfiliado = async () => {
      setCargandoDatos(true);

      try {
        const resultado = await listarPacientes();

        if (resultado.success) {
          // Buscar el afiliado específico
          const afiliadoEncontrado = resultado.data.find(p => p.dni.toString() === afiliadoId);

          if (afiliadoEncontrado) {
            // Poblar datos del formulario solo con datos reales
            setDatosAfiliado({
              dniCotizante: afiliadoEncontrado.dni.toString(),
              nombreCotizante: afiliadoEncontrado.nombre || '',
              fechaNacimientoCotizante: afiliadoEncontrado.fechaNacimiento || '',
              emailCotizante: afiliadoEncontrado.email || '',
              passwordCotizante: '********', // Password oculto
              telefonoCotizante: afiliadoEncontrado.telefono || '',
              sexoCotizante: afiliadoEncontrado.sexo || '',
              direccionCotizante: afiliadoEncontrado.direccion || '',

              // Solo beneficiarios reales si existen
              beneficiarios: afiliadoEncontrado.beneficiarios || []
            });
          } else {
            setMensajeError(`Afiliado con ID ${afiliadoId} no encontrado`);
            setModalErrorAbierto(true);
          }
        } else {
          setMensajeError('Error al cargar datos del afiliado');
          setModalErrorAbierto(true);
        }
      } catch (error) {
        console.error('Error:', error);
        setMensajeError('Error inesperado al cargar datos');
        setModalErrorAbierto(true);
      } finally {
        setCargandoDatos(false);
      }
    };

    if (afiliadoId) {
      cargarDatosAfiliado();
    }
  }, [afiliadoId]);

  // Función para verificar si un campo es obligatorio y está vacío (solo para validación)
  const esCampoObligatorioVacio = (valor) => {
    return mostrarValidacion && (!valor || valor.toString().trim() === '');
  };

  // Función para obtener estilos de campos obligatorios (bloqueados)
  const getInputStyles = (esObligatorio, valor, esBloqueado = false) => {
    const baseStyles = { backgroundColor: esBloqueado ? '#f5f5f5' : 'white' };

    if (esBloqueado) {
      return {
        ...baseStyles,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#e0e0e0'
          }
        },
        '& .MuiInputLabel-root': {
          color: '#999'
        }
      };
    }

    if (esObligatorio && esCampoObligatorioVacio(valor)) {
      return {
        ...baseStyles,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#d32f2f',
            borderWidth: '2px'
          },
          '&:hover fieldset': {
            borderColor: '#d32f2f'
          },
          '&.Mui-focused fieldset': {
            borderColor: '#d32f2f'
          }
        },
        '& .MuiInputLabel-root': {
          color: '#d32f2f',
          '&.Mui-focused': {
            color: '#d32f2f'
          }
        }
      };
    }

    return baseStyles;
  };

  // Función para obtener estilos de FormControl
  const getFormControlStyles = (esObligatorio, valor, esBloqueado = false) => {
    const baseStyles = { backgroundColor: esBloqueado ? '#f5f5f5' : 'white' };

    if (esBloqueado) {
      return {
        ...baseStyles,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#e0e0e0'
          }
        },
        '& .MuiInputLabel-root': {
          color: '#999'
        }
      };
    }

    if (esObligatorio && esCampoObligatorioVacio(valor)) {
      return {
        ...baseStyles,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#d32f2f',
            borderWidth: '2px'
          },
          '&:hover fieldset': {
            borderColor: '#d32f2f'
          },
          '&.Mui-focused fieldset': {
            borderColor: '#d32f2f'
          }
        },
        '& .MuiInputLabel-root': {
          color: '#d32f2f',
          '&.Mui-focused': {
            color: '#d32f2f'
          }
        }
      };
    }

    return baseStyles;
  };

  // Función para obtener el label con indicador de campo bloqueado
  const getLabelConIndicador = (label, esObligatorio = true, esBloqueado = false) => {
    if (esBloqueado) {
      return `${label} (No editable)`;
    }
    return esObligatorio ? `${label} *` : label;
  };

  const handleInputChange = (seccion, campo, valor, index = null) => {
    setDatosAfiliado(prev => {
      if (seccion === 'beneficiarios' && index !== null) {
        const nuevosBeneficiarios = [...prev.beneficiarios];
        nuevosBeneficiarios[index] = {
          ...nuevosBeneficiarios[index],
          [campo]: valor
        };
        return {
          ...prev,
          beneficiarios: nuevosBeneficiarios
        };
      } else {
        return {
          ...prev,
          [`${campo}${seccion}`]: valor
        };
      }
    });
  };

  const agregarBeneficiario = () => {
    if (datosAfiliado.beneficiarios.length < 3) {
      setDatosAfiliado(prev => ({
        ...prev,
        beneficiarios: [
          ...prev.beneficiarios,
          {
            dni: '',
            nombre: '',
            fechaNacimiento: '',
            email: '',
            password: '',
            telefono: '',
            sexo: '',
            parentesco: '',
            direccion: ''
          }
        ]
      }));
    }
  };

  const eliminarBeneficiario = (index) => {
    setDatosAfiliado(prev => ({
      ...prev,
      beneficiarios: prev.beneficiarios.filter((_, i) => i !== index)
    }));
  };

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje(null);
    }, 5000);
  };

  const mostrarModalExito = () => {
    setModalExitoAbierto(true);
  };

  const mostrarModalError = (mensajeError) => {
    setMensajeError(mensajeError);
    setModalErrorAbierto(true);
  };

  const cerrarModalExito = () => {
    setModalExitoAbierto(false);
    navigate(-1);
  };

  const cerrarModalError = () => {
    setModalErrorAbierto(false);
    setMensajeError('');
  };

  const validarFormulario = () => {
    setMostrarValidacion(true);

    // Validar beneficiarios nuevos si existen
    for (let i = 0; i < datosAfiliado.beneficiarios.length; i++) {
      const beneficiario = datosAfiliado.beneficiarios[i];
      // Solo validar beneficiarios que no tengan datos completos (nuevos)
      if (beneficiario.dni && (!beneficiario.nombre || !beneficiario.email)) {
        mostrarModalError(`Por favor complete todos los campos del beneficiario ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleValidar = () => {
    if (validarFormulario()) {
      mostrarMensaje('Formulario validado correctamente', 'success');
      setMostrarValidacion(false);
    }
  };

  const handleActualizar = async () => {
    if (!validarFormulario()) {
      return;
    }

    setCargando(true);
    setMensaje(null);

    try {
      // Construir datos para actualización (solo campos editables)
      const datosActualizacion = {
        dni: parseInt(datosAfiliado.dniCotizante),
        telefono: datosAfiliado.telefonoCotizante,
        direccion: datosAfiliado.direccionCotizante,
        // Otros campos editables...
      };

      console.log('Actualizando afiliado:', datosActualizacion);

      // Aquí harías la llamada al servicio de actualización
      // const resultado = await actualizarPaciente(datosActualizacion);

      // Simular éxito por ahora
      setTimeout(() => {
        mostrarModalExito();
        setCargando(false);
      }, 1500);

    } catch (error) {
      console.error('Error inesperado:', error);
      mostrarModalError('Error inesperado al actualizar el afiliado');
      setCargando(false);
    }
  };

  const handleVolver = () => {
    navigate(-1);
  };

  if (cargandoDatos) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6">Cargando datos del afiliado...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleVolver}
          sx={{
            borderColor: '#d32f2f',
            color: '#d32f2f',
            '&:hover': {
              borderColor: '#b71c1c',
              backgroundColor: 'rgba(211, 47, 47, 0.04)'
            }
          }}
        >
          ← Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Edición de Afiliado
        </Typography>
      </Box>

      {/* Nota sobre campos no editables */}
      <Alert severity="warning" sx={{ mb: 3, maxWidth: 1200, margin: '0 auto 24px auto' }}>
        Los campos marcados como "No editable" no pueden ser modificados. Solo se pueden editar campos opcionales y agregar/eliminar beneficiarios.
      </Alert>

      <Card sx={{ maxWidth: 1200, margin: '0 auto' }}>
        <CardContent sx={{ p: 4 }}>

          {/* Mostrar mensaje de estado */}
          {mensaje && (
            <Alert severity={tipoMensaje} sx={{ mb: 3 }}>
              {mensaje}
            </Alert>
          )}

          {/* Sección Datos Cotizante */}
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
            Datos cotizante
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={getLabelConIndicador("DNI", true, true)}
                variant="outlined"
                size="small"
                type="number"
                value={datosAfiliado.dniCotizante}
                sx={getInputStyles(true, datosAfiliado.dniCotizante, true)}
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={getLabelConIndicador("Nombre completo", true, true)}
                variant="outlined"
                size="small"
                value={datosAfiliado.nombreCotizante}
                sx={getInputStyles(true, datosAfiliado.nombreCotizante, true)}
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                type="date"
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={datosAfiliado.fechaNacimientoCotizante}
                onChange={(e) => handleInputChange('Cotizante', 'fechaNacimiento', e.target.value)}
                sx={getInputStyles(false, datosAfiliado.fechaNacimientoCotizante)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                size="small"
                sx={getFormControlStyles(false, datosAfiliado.sexoCotizante)}
              >
                <InputLabel>Sexo</InputLabel>
                <Select
                  value={datosAfiliado.sexoCotizante}
                  label="Sexo"
                  onChange={(e) => handleInputChange('Cotizante', 'sexo', e.target.value)}
                >
                  {opcionesSexo.map((opcion) => (
                    <MenuItem key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={getLabelConIndicador("Email", true, true)}
                type="email"
                variant="outlined"
                size="small"
                value={datosAfiliado.emailCotizante}
                sx={getInputStyles(true, datosAfiliado.emailCotizante, true)}
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={getLabelConIndicador("Password", true, true)}
                type="password"
                variant="outlined"
                size="small"
                value={datosAfiliado.passwordCotizante}
                sx={getInputStyles(true, datosAfiliado.passwordCotizante, true)}
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                variant="outlined"
                size="small"
                value={datosAfiliado.telefonoCotizante}
                onChange={(e) => handleInputChange('Cotizante', 'telefono', e.target.value)}
                sx={getInputStyles(false, datosAfiliado.telefonoCotizante)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dirección"
                variant="outlined"
                size="small"
                value={datosAfiliado.direccionCotizante}
                onChange={(e) => handleInputChange('Cotizante', 'direccion', e.target.value)}
                sx={getInputStyles(false, datosAfiliado.direccionCotizante)}
              />
            </Grid>
          </Grid>

          {/* Sección Beneficiarios */}
          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Beneficiarios {datosAfiliado.beneficiarios.length > 0 && `(${datosAfiliado.beneficiarios.length}/3)`}
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#d32f2f',
                '&:hover': { backgroundColor: '#b71c1c' }
              }}
              onClick={agregarBeneficiario}
              disabled={datosAfiliado.beneficiarios.length >= 3}
            >
              Agregar Beneficiario
            </Button>
          </Box>

          {datosAfiliado.beneficiarios.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No hay beneficiarios agregados. Haga clic en "Agregar Beneficiario" para añadir uno.
            </Typography>
          )}

          {datosAfiliado.beneficiarios.map((beneficiario, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Datos beneficiario {index + 1}
                  {beneficiario.dni && beneficiario.nombre && (
                    <Typography component="span" sx={{ fontWeight: 'normal', color: '#666', ml: 1 }}>
                      (Existente)
                    </Typography>
                  )}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => eliminarBeneficiario(index)}
                >
                  Eliminar
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={getLabelConIndicador("DNI", true, beneficiario.dni && beneficiario.nombre)}
                    variant="outlined"
                    size="small"
                    type="number"
                    value={beneficiario.dni}
                    onChange={(e) => handleInputChange('beneficiarios', 'dni', e.target.value, index)}
                    sx={getInputStyles(true, beneficiario.dni, beneficiario.dni && beneficiario.nombre)}
                    disabled={beneficiario.dni && beneficiario.nombre}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={getLabelConIndicador("Nombre completo", true, beneficiario.dni && beneficiario.nombre)}
                    variant="outlined"
                    size="small"
                    value={beneficiario.nombre}
                    onChange={(e) => handleInputChange('beneficiarios', 'nombre', e.target.value, index)}
                    sx={getInputStyles(true, beneficiario.nombre, beneficiario.dni && beneficiario.nombre)}
                    disabled={beneficiario.dni && beneficiario.nombre}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Nacimiento"
                    type="date"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={beneficiario.fechaNacimiento}
                    onChange={(e) => handleInputChange('beneficiarios', 'fechaNacimiento', e.target.value, index)}
                    sx={getInputStyles(false, beneficiario.fechaNacimiento)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={getFormControlStyles(false, beneficiario.sexo)}
                  >
                    <InputLabel>Sexo</InputLabel>
                    <Select
                      value={beneficiario.sexo}
                      label="Sexo"
                      onChange={(e) => handleInputChange('beneficiarios', 'sexo', e.target.value, index)}
                    >
                      {opcionesSexo.map((opcion) => (
                        <MenuItem key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={getFormControlStyles(false, beneficiario.parentesco)}
                  >
                    <InputLabel>Parentesco</InputLabel>
                    <Select
                      value={beneficiario.parentesco}
                      label="Parentesco"
                      onChange={(e) => handleInputChange('beneficiarios', 'parentesco', e.target.value, index)}
                    >
                      {opcionesParentesco.map((opcion) => (
                        <MenuItem key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={getLabelConIndicador("Email", true, beneficiario.dni && beneficiario.email && beneficiario.email !== '')}
                    type="email"
                    variant="outlined"
                    size="small"
                    value={beneficiario.email}
                    onChange={(e) => handleInputChange('beneficiarios', 'email', e.target.value, index)}
                    sx={getInputStyles(true, beneficiario.email, beneficiario.dni && beneficiario.email && beneficiario.email !== '')}
                    disabled={beneficiario.dni && beneficiario.email && beneficiario.email !== ''}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={getLabelConIndicador("Password", true, true)}
                    type="password"
                    variant="outlined"
                    size="small"
                    value={beneficiario.password}
                    sx={getInputStyles(true, beneficiario.password, true)}
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    variant="outlined"
                    size="small"
                    value={beneficiario.telefono}
                    onChange={(e) => handleInputChange('beneficiarios', 'telefono', e.target.value, index)}
                    sx={getInputStyles(false, beneficiario.telefono)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    variant="outlined"
                    size="small"
                    value={beneficiario.direccion}
                    onChange={(e) => handleInputChange('beneficiarios', 'direccion', e.target.value, index)}
                    sx={getInputStyles(false, beneficiario.direccion)}
                  />
                </Grid>
              </Grid>

              {index < datosAfiliado.beneficiarios.length - 1 && (
                <Divider sx={{ mt: 4 }} />
              )}
            </Box>
          ))}

          {/* Botones de Acción */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 4,
            pt: 3,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Button
              variant="outlined"
              onClick={handleValidar}
              disabled={cargando}
              sx={{
                px: 4,
                py: 1.5,
                borderColor: '#d32f2f',
                color: '#d32f2f',
                '&:hover': {
                  borderColor: '#b71c1c',
                  backgroundColor: 'rgba(211, 47, 47, 0.04)'
                }
              }}
            >
              Validar
            </Button>
            <Button
              variant="contained"
              onClick={handleActualizar}
              disabled={cargando}
              sx={{
                px: 4,
                py: 1.5,
                backgroundColor: '#d32f2f',
                '&:hover': { backgroundColor: '#b71c1c' },
                position: 'relative'
              }}
            >
              {cargando && (
                <CircularProgress
                  size={20}
                  sx={{
                    color: 'white',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginLeft: '-10px',
                    marginTop: '-10px',
                  }}
                />
              )}
              {cargando ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Modal de Actualización Exitosa */}
      <Modal
        open={modalExitoAbierto}
        onClose={cerrarModalExito}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        }}
      >
        <Fade in={modalExitoAbierto}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            outline: 'none',
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#333'
            }}>
              Actualización exitosa
            </Typography>

            {/* Icono de check */}
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '3px solid #ff9800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              backgroundColor: 'transparent'
            }}>
              <Typography sx={{
                fontSize: '40px',
                color: '#ff9800',
                fontWeight: 'bold'
              }}>
                ✓
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
              Los datos del afiliado han sido actualizados correctamente
            </Typography>

            <Button
              variant="contained"
              onClick={cerrarModalExito}
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#b71c1c'
                }
              }}
            >
              Cerrar
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Modal de Error */}
      <Modal
        open={modalErrorAbierto}
        onClose={cerrarModalError}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        }}
      >
        <Fade in={modalErrorAbierto}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            outline: 'none',
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#333'
            }}>
              Error en la actualización
            </Typography>

            {/* Icono de X */}
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '3px solid #d32f2f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              backgroundColor: 'transparent'
            }}>
              <Typography sx={{
                fontSize: '40px',
                color: '#d32f2f',
                fontWeight: 'bold'
              }}>
                ✕
              </Typography>
            </Box>

            {/* Mensaje de error */}
            {mensajeError && (
              <Typography variant="body1" sx={{
                mb: 3,
                color: '#666',
                textAlign: 'center'
              }}>
                {mensajeError}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={cerrarModalError}
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#b71c1c'
                }
              }}
            >
              Cerrar
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default EdicionAfiliado;