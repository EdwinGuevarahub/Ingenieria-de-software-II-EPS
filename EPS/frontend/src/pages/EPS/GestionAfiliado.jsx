import React, { useState } from 'react';
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
import { crearPaciente } from '../../services/pacientesService'; // Importar el servicio

const GestionAfiliado = () => {
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

    // Datos administrador registrador
    emailAdmRegistrador: '',
    nombreAdmRegistrador: '',
    passwordAdmRegistrador: '',
    telefonoAdmRegistrador: '',

    // Beneficiarios (array de beneficiarios) - Por defecto vacío
    beneficiarios: []
  });

  // Estados para la UI
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('success'); // 'success', 'error', 'warning'
  const [mostrarValidacion, setMostrarValidacion] = useState(false); // Para mostrar errores visuales

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

  // Función para verificar si un campo es obligatorio y está vacío
  const esCampoObligatorioVacio = (valor) => {
    return mostrarValidacion && (!valor || valor.toString().trim() === '');
  };

  // Función para obtener los estilos de input con validación
  const getInputStyles = (esObligatorio, valor) => {
    const baseStyles = { backgroundColor: 'white' };

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

  // Función para obtener estilos de FormControl con validación
  const getFormControlStyles = (esObligatorio, valor) => {
    const baseStyles = { backgroundColor: 'white' };

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

  // Función para obtener el label con asterisco para campos obligatorios
  const getLabelConAsterisco = (label, esObligatorio = true) => {
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
    // Solo permitir máximo 3 beneficiarios
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
    // Ocultar mensaje después de 5 segundos
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
    setMostrarValidacion(false); // Resetear validación visual
    limpiarFormulario();
  };

  const cerrarModalError = () => {
    setModalErrorAbierto(false);
    setMensajeError('');
  };

  const limpiarFormulario = () => {
    setDatosAfiliado({
      dniCotizante: '',
      nombreCotizante: '',
      fechaNacimientoCotizante: '',
      emailCotizante: '',
      passwordCotizante: '',
      telefonoCotizante: '',
      sexoCotizante: '',
      direccionCotizante: '',
      emailAdmRegistrador: '',
      nombreAdmRegistrador: '',
      passwordAdmRegistrador: '',
      telefonoAdmRegistrador: '',
      beneficiarios: []
    });
  };

  const validarFormulario = () => {
    setMostrarValidacion(true); // Activar validación visual

    // Validar cotizante
    if (!datosAfiliado.dniCotizante || !datosAfiliado.nombreCotizante ||
        !datosAfiliado.emailCotizante || !datosAfiliado.passwordCotizante) {
      mostrarModalError('Por favor complete todos los campos requeridos del cotizante');
      return false;
    }

    // Validar beneficiarios si existen
    for (let i = 0; i < datosAfiliado.beneficiarios.length; i++) {
      const beneficiario = datosAfiliado.beneficiarios[i];
      if (!beneficiario.dni || !beneficiario.nombre || !beneficiario.email || !beneficiario.password) {
        mostrarModalError(`Por favor complete todos los campos requeridos del beneficiario ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const construirJSONRequest = () => {
    // Construir objeto principal del cotizante
    const cotizante = {
      dni: parseInt(datosAfiliado.dniCotizante),
      beneficiario: null, // El cotizante no tiene beneficiario
      nombre: datosAfiliado.nombreCotizante,
      fechaNacimiento: datosAfiliado.fechaNacimientoCotizante,
      email: datosAfiliado.emailCotizante,
      password: datosAfiliado.passwordCotizante,
      telefono: datosAfiliado.telefonoCotizante,
      sexo: datosAfiliado.sexoCotizante,
      direccion: datosAfiliado.direccionCotizante,
      admRegistrador: {
        email: datosAfiliado.emailAdmRegistrador,
        nombre: datosAfiliado.nombreAdmRegistrador,
        password: datosAfiliado.passwordAdmRegistrador,
        telefono: datosAfiliado.telefonoAdmRegistrador
      },
      fechaAfiliacion: new Date().toISOString()
    };

    // Construir array de beneficiarios
    const beneficiarios = datosAfiliado.beneficiarios.map(beneficiario => ({
      dni: parseInt(beneficiario.dni),
      beneficiario: datosAfiliado.dniCotizante, // DNI del cotizante como beneficiario
      nombre: beneficiario.nombre,
      fechaNacimiento: beneficiario.fechaNacimiento,
      email: beneficiario.email,
      password: beneficiario.password,
      telefono: beneficiario.telefono,
      sexo: beneficiario.sexo,
      parentesco: beneficiario.parentesco,
      direccion: beneficiario.direccion,
      admRegistrador: {
        email: datosAfiliado.emailAdmRegistrador,
        nombre: datosAfiliado.nombreAdmRegistrador,
        password: datosAfiliado.passwordAdmRegistrador,
        telefono: datosAfiliado.telefonoAdmRegistrador
      },
      fechaAfiliacion: new Date().toISOString()
    }));

    return {
      cotizante,
      beneficiarios
    };
  };

  const handleValidar = () => {
    const requestData = construirJSONRequest();
    console.log('Validando datos:', requestData);

    if (validarFormulario()) {
      mostrarMensaje('Formulario validado correctamente', 'success');
      setMostrarValidacion(false); // Ocultar errores visuales si todo está bien
    }
  };

  const handleRegistrar = async () => {
    if (!validarFormulario()) {
      return;
    }

    setCargando(true);
    setMensaje(null);

    try {
      const requestData = construirJSONRequest();
      console.log('JSON para el request POST:', requestData);

      // Crear cotizante primero
      const resultadoCotizante = await crearPaciente(requestData.cotizante);

      if (!resultadoCotizante.success) {
        mostrarModalError(resultadoCotizante.message);
        setCargando(false);
        return;
      }

      console.log('Cotizante creado exitosamente:', resultadoCotizante.data);

      // Crear beneficiarios si existen
      if (requestData.beneficiarios.length > 0) {
        const resultadosBeneficiarios = [];
        let erroresBeneficiarios = [];

        for (const beneficiario of requestData.beneficiarios) {
          const resultadoBeneficiario = await crearPaciente(beneficiario);

          if (resultadoBeneficiario.success) {
            resultadosBeneficiarios.push(resultadoBeneficiario.data);
            console.log('Beneficiario creado exitosamente:', resultadoBeneficiario.data);
          } else {
            console.error('Error creando beneficiario:', resultadoBeneficiario.message);
            erroresBeneficiarios.push(resultadoBeneficiario.message);
          }
        }

        if (erroresBeneficiarios.length > 0) {
          mostrarModalError(`Cotizante creado pero hubo errores con beneficiarios: ${erroresBeneficiarios.join(', ')}`);
        } else {
          mostrarModalExito();
        }
      } else {
        mostrarModalExito();
      }

    } catch (error) {
      console.error('Error inesperado:', error);
      mostrarModalError('Error inesperado al registrar el afiliado');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Registro de Usuario
      </Typography>

      {/* Nota sobre campos obligatorios */}
      <Alert severity="info" sx={{ mb: 3, maxWidth: 1200, margin: '0 auto 24px auto' }}>
        Los campos marcados con asterisco (*) son obligatorios
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
                label={getLabelConAsterisco("DNI")}
                variant="outlined"
                size="small"
                type="number"
                value={datosAfiliado.dniCotizante}
                onChange={(e) => handleInputChange('Cotizante', 'dni', e.target.value)}
                sx={getInputStyles(true, datosAfiliado.dniCotizante)}
                error={esCampoObligatorioVacio(datosAfiliado.dniCotizante)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={getLabelConAsterisco("Nombre completo")}
                variant="outlined"
                size="small"
                value={datosAfiliado.nombreCotizante}
                onChange={(e) => handleInputChange('Cotizante', 'nombre', e.target.value)}
                sx={getInputStyles(true, datosAfiliado.nombreCotizante)}
                error={esCampoObligatorioVacio(datosAfiliado.nombreCotizante)}
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
                  style={{minWidth: '100px'}}
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
                label={getLabelConAsterisco("Email")}
                type="email"
                variant="outlined"
                size="small"
                value={datosAfiliado.emailCotizante}
                onChange={(e) => handleInputChange('Cotizante', 'email', e.target.value)}
                sx={getInputStyles(true, datosAfiliado.emailCotizante)}
                error={esCampoObligatorioVacio(datosAfiliado.emailCotizante)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={getLabelConAsterisco("Password")}
                type="password"
                variant="outlined"
                size="small"
                value={datosAfiliado.passwordCotizante}
                onChange={(e) => handleInputChange('Cotizante', 'password', e.target.value)}
                sx={getInputStyles(true, datosAfiliado.passwordCotizante)}
                error={esCampoObligatorioVacio(datosAfiliado.passwordCotizante)}
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

          {/* Header de Beneficiarios con botón para agregar */}
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

          {/* Mostrar mensaje si no hay beneficiarios */}
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
                    label={getLabelConAsterisco("DNI")}
                    variant="outlined"
                    size="small"
                    type="number"
                    value={beneficiario.dni}
                    onChange={(e) => handleInputChange('beneficiarios', 'dni', e.target.value, index)}
                    sx={getInputStyles(true, beneficiario.dni)}
                    error={esCampoObligatorioVacio(beneficiario.dni)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={getLabelConAsterisco("Nombre completo")}
                    variant="outlined"
                    size="small"
                    value={beneficiario.nombre}
                    onChange={(e) => handleInputChange('beneficiarios', 'nombre', e.target.value, index)}
                    sx={getInputStyles(true, beneficiario.nombre)}
                    error={esCampoObligatorioVacio(beneficiario.nombre)}
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
                      style={{minWidth: '100px'}}
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
                      style={{minWidth: '100px'}}
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
                    label={getLabelConAsterisco("Email")}
                    type="email"
                    variant="outlined"
                    size="small"
                    value={beneficiario.email}
                    onChange={(e) => handleInputChange('beneficiarios', 'email', e.target.value, index)}
                    sx={getInputStyles(true, beneficiario.email)}
                    error={esCampoObligatorioVacio(beneficiario.email)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={getLabelConAsterisco("Password")}
                    type="password"
                    variant="outlined"
                    size="small"
                    value={beneficiario.password}
                    onChange={(e) => handleInputChange('beneficiarios', 'password', e.target.value, index)}
                    sx={getInputStyles(true, beneficiario.password)}
                    error={esCampoObligatorioVacio(beneficiario.password)}
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
              onClick={handleRegistrar}
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
              {cargando ? 'Registrando...' : 'Registrar'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Modal de Registro Exitoso */}
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
              Registro exitoso
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

      {/* Modal de Registro Erróneo */}
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
              Registro no exitoso
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

export default GestionAfiliado;