import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Avatar,
  Modal,
  Backdrop,
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Collapse,
  Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { listarPacientes } from '../../services/pacientesService';
import { useNavigate } from 'react-router-dom';

const EstadoAfiliacion = () => {
  const navigate = useNavigate();

  // Estado para el filtro de búsqueda
  const [filtroTexto, setFiltroTexto] = useState('');
  const [afiliadoSeleccionado, setAfiliadoSeleccionado] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Estado para los pacientes del backend
  const [pacientes, setPacientes] = useState([]);
  const [cargandoPacientes, setCargandoPacientes] = useState(false);
  const [errorPacientes, setErrorPacientes] = useState(null);

  // Estado para el modal de certificado
  const [modalCertificadoAbierto, setModalCertificadoAbierto] = useState(false);

  // Cargar pacientes al montar el componente
  useEffect(() => {
    const cargarPacientes = async () => {
      setCargandoPacientes(true);
      setErrorPacientes(null);

      try {
        const resultado = await listarPacientes();
        console.log('Resultado del servicio pacientes:', resultado);

        if (resultado.success) {
          console.log('Pacientes obtenidos:', resultado.data);
          setPacientes(resultado.data);
        } else {
          console.error('Error al cargar pacientes:', resultado.message);
          setErrorPacientes(resultado.message);
        }
      } catch (error) {
        console.error('Error inesperado:', error);
        setErrorPacientes('Error inesperado al cargar los pacientes');
      } finally {
        setCargandoPacientes(false);
      }
    };

    cargarPacientes();
  }, []);

  // Función para determinar si es cotizante o beneficiario
  const esCotizante = (usuario) => {
    return usuario.beneficiario === null;
  };

  // Función para obtener el tipo de usuario
  const getTipoUsuario = (usuario) => {
    return esCotizante(usuario) ? 'Cotizante' : 'Beneficiario';
  };

  // Función para obtener color del chip según tipo
  const getColorTipo = (usuario) => {
    return esCotizante(usuario) ? 'primary' : 'secondary';
  };

  // Función para formatear fecha
  const formatearFecha = (fechaString) => {
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return fechaString;
    }
  };

  // Filtrar pacientes según el texto de búsqueda
  const pacientesFiltrados = useMemo(() => {
    if (!filtroTexto.trim()) {
      return [];
    }

    const textoFiltro = filtroTexto.toLowerCase().trim();

    return pacientes.filter(paciente =>
      paciente.nombre?.toLowerCase().includes(textoFiltro) ||
      paciente.dni?.toString().includes(textoFiltro) ||
      paciente.email?.toLowerCase().includes(textoFiltro)
    );
  }, [filtroTexto, pacientes]);

  // Función para seleccionar un afiliado
  const seleccionarAfiliado = (afiliado) => {
    setAfiliadoSeleccionado(afiliado);
    setMostrarResultados(false);
    setFiltroTexto('');
  };

  // Función para manejar la búsqueda
  const handleBuscar = () => {
    if (filtroTexto.trim()) {
      setMostrarResultados(true);
      setAfiliadoSeleccionado(null);
    }
  };

  // Función para limpiar el filtro
  const limpiarFiltro = () => {
    setFiltroTexto('');
    setMostrarResultados(false);
    setAfiliadoSeleccionado(null);
  };

  // Datos de beneficiarios mock (basados en el afiliado seleccionado)
  const obtenerBeneficiarios = (titular) => {
    if (!titular) return [];

    // Buscar otros usuarios que tengan como beneficiario al titular seleccionado
    const beneficiarios = pacientes.filter(paciente =>
      paciente.beneficiario && paciente.beneficiario.dni === titular.dni
    );

    // Si no hay beneficiarios reales, usar datos mock
    if (beneficiarios.length === 0) {
      const apellido = titular.nombre.split(' ').pop();
      return [
        {
          id: 1,
          nombre: `María Antonia ${apellido}`,
          relacion: 'Cónyuge',
          documento: '98765243',
          fechaNacimiento: '22/03/1987',
          afiliadoDesde: '19/03/2018'
        },
        {
          id: 2,
          nombre: `Andrea ${apellido}`,
          relacion: 'Hijo (a)',
          documento: '1122334455',
          fechaNacimiento: '11/09/2010',
          afiliadoDesde: '22/03/2018'
        }
      ];
    }

    // Transformar beneficiarios reales
    return beneficiarios.map((beneficiario, index) => ({
      id: index + 1,
      nombre: beneficiario.nombre,
      relacion: beneficiario.parentezco || 'Beneficiario',
      documento: beneficiario.dni.toString(),
      fechaNacimiento: formatearFecha(beneficiario.fechaNacimiento),
      afiliadoDesde: formatearFecha(beneficiario.fechaAfiliacion)
    }));
  };

  // Función para abrir el modal de certificado
  const abrirModalCertificado = () => {
    setModalCertificadoAbierto(true);
  };

  // Función para cerrar el modal de certificado
  const cerrarModalCertificado = () => {
    setModalCertificadoAbierto(false);
  };

  const handleEditarAfiliados = () => {
    if (afiliadoSeleccionado) {
      navigate(`/editar-afiliado/${afiliadoSeleccionado.dni}`);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
        Estado de afiliación
      </Typography>

      {/* Sección de Búsqueda */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {/* Left Section - Search */}
        <Box sx={{ flex: 1, maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Busque por cédula
          </Typography>
          <Typography variant="caption" sx={{ mb: 2, color: 'text.secondary', display: 'block' }}>
            Digite la cédula del afiliado a consultar
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              placeholder="Buscar por cédula o nombre"
              variant="outlined"
              size="small"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleBuscar();
                }
              }}
              disabled={cargandoPacientes}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#d32f2f',
                '&:hover': { backgroundColor: '#b71c1c' },
                minWidth: 'auto',
                px: 2
              }}
              onClick={handleBuscar}
              disabled={cargandoPacientes}
            >
              {cargandoPacientes ? 'Cargando...' : 'Buscar'}
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#d32f2f',
                color: '#d32f2f',
                '&:hover': { borderColor: '#b71c1c', backgroundColor: 'rgba(211, 47, 47, 0.04)' },
                minWidth: 'auto',
                px: 2
              }}
              onClick={limpiarFiltro}
            >
              Limpiar
            </Button>
          </Box>

          {/* Mostrar errores si existen */}
          {errorPacientes && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              Error pacientes: {errorPacientes}
            </Typography>
          )}

          {/* Resultados de búsqueda */}
          <Collapse in={mostrarResultados && pacientesFiltrados.length > 0}>
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ py: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Afiliados encontrados ({pacientesFiltrados.length}):
                </Typography>
                <List dense>
                  {pacientesFiltrados.map((paciente) => (
                    <ListItem key={paciente.dni} disablePadding>
                      <ListItemButton onClick={() => seleccionarAfiliado(paciente)}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: getColorTipo(paciente) === 'primary' ? '#1976d2' : '#9c27b0' }}>
                            {esCotizante(paciente) ? <PersonIcon /> : <FamilyRestroomIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={paciente.nombre}
                          secondary={`DNI: ${paciente.dni} - ${getTipoUsuario(paciente)}`}
                          primaryTypographyProps={{ fontSize: '0.875rem' }}
                          secondaryTypographyProps={{ fontSize: '0.75rem' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Collapse>

          {/* Mensaje cuando no hay resultados */}
          {mostrarResultados && pacientesFiltrados.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No se encontraron afiliados para "{filtroTexto}"
            </Typography>
          )}
        </Box>

        {/* Right Section - Info Rápida */}
        <Card sx={{ flex: 1, maxWidth: '50%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Información del Afiliado
            </Typography>

            {afiliadoSeleccionado ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                      Afiliado:
                    </Typography>
                    <Typography variant="body2">
                      {afiliadoSeleccionado.nombre}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                      No. Identificación:
                    </Typography>
                    <Typography variant="body2">
                      {afiliadoSeleccionado.tipoDni} {afiliadoSeleccionado.dni}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                      Tipo:
                    </Typography>
                    <Chip
                      label={getTipoUsuario(afiliadoSeleccionado)}
                      color={getColorTipo(afiliadoSeleccionado)}
                      size="small"
                      icon={esCotizante(afiliadoSeleccionado) ? <PersonIcon /> : <FamilyRestroomIcon />}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {getTipoUsuario(afiliadoSeleccionado)}
                  </Typography>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      mb: 1,
                      bgcolor: getColorTipo(afiliadoSeleccionado) === 'primary' ? '#1976d2' : '#9c27b0'
                    }}
                    alt="Afiliado"
                  >
                    {esCotizante(afiliadoSeleccionado) ? <PersonIcon /> : <FamilyRestroomIcon />}
                  </Avatar>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Busque y seleccione un afiliado para ver su estado de afiliación
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Card Principal - Datos de Afiliación (solo si hay afiliado seleccionado) */}
      {afiliadoSeleccionado && (
        <>
          {/* Card Beneficiarios */}
          <Card sx={{ backgroundColor: 'white', boxShadow: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontSize: '1.1rem' }}>
                Beneficiarios
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2 }}>
                        Nombre
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2 }}>
                        Relación
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2 }}>
                        No Documento
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2 }}>
                        Fecha de nacimiento
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2 }}>
                        Afiliado desde
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {obtenerBeneficiarios(afiliadoSeleccionado).map((beneficiario, index) => (
                      <TableRow
                        key={beneficiario.id}
                        sx={{
                          '&:hover': { backgroundColor: '#f9f9f9' }
                        }}
                      >
                        <TableCell sx={{ fontSize: '0.9rem', py: 2 }}>
                          {beneficiario.nombre}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.9rem', py: 2 }}>
                          {beneficiario.relacion}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.9rem', py: 2 }}>
                          {beneficiario.documento}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.9rem', py: 2 }}>
                          {beneficiario.fechaNacimiento}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.9rem', py: 2 }}>
                          {beneficiario.afiliadoDesde}
                        </TableCell>
                      </TableRow>
                    ))}
                    {obtenerBeneficiarios(afiliadoSeleccionado).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No hay beneficiarios registrados para este afiliado
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Botones de acción */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={abrirModalCertificado}
                  sx={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    py: 1,
                    px: 3,
                    '&:hover': { backgroundColor: '#b71c1c' }
                  }}
                >
                  Enviar Certificado
                </Button>
                <Button
                  variant="contained"
                  onClick={handleEditarAfiliados}
                  sx={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    py: 1,
                    px: 3,
                    '&:hover': { backgroundColor: '#b71c1c' }
                  }}
                >
                  Editar Afiliados
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {/* Modal de Certificado Exitoso */}
      <Modal
        open={modalCertificadoAbierto}
        onClose={cerrarModalCertificado}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        }}
      >
        <Fade in={modalCertificadoAbierto}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
            outline: 'none'
          }}>
            {/* Contenido del Modal */}
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.primary' }}>
               <b>Su certificado ha sido enviado a su correo electrónico registrado.</b>
              </Typography>

              {/* Icono de éxito */}
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

              {/* Botón Cerrar */}
              <Button
                variant="contained"
                onClick={cerrarModalCertificado}
                sx={{
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  '&:hover': { backgroundColor: '#b71c1c' }
                }}
              >
                Cerrar
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default EstadoAfiliacion;