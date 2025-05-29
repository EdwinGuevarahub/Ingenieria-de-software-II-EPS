import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Collapse,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Chip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { listarPacientes } from '../../services/pacientesService';
import { obtenerHistoriasClinicasPorPaciente } from '../../services/historiaClinicaService'; // Importar la función específica

const HistoriaClinica = () => {
  // Estado para el filtro de búsqueda
  const [filtroTexto, setFiltroTexto] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Estado para el modal de detalle
  const [modalAbierto, setModalAbierto] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);

  // Estado para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Estado para los pacientes del backend
  const [pacientes, setPacientes] = useState([]);
  const [cargandoPacientes, setCargandoPacientes] = useState(false);
  const [errorPacientes, setErrorPacientes] = useState(null);

  // Estado para las historias clínicas del paciente seleccionado
  const [historiasClinicas, setHistoriasClinicas] = useState([]);
  const [cargandoHistorias, setCargandoHistorias] = useState(false);
  const [errorHistorias, setErrorHistorias] = useState(null);

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

  // Cargar historias clínicas cuando se selecciona un paciente
  useEffect(() => {
    const cargarHistoriasClinicas = async () => {
      if (!pacienteSeleccionado) {
        setHistoriasClinicas([]);
        return;
      }

      setCargandoHistorias(true);
      setErrorHistorias(null);

      try {
        const resultado = await obtenerHistoriasClinicasPorPaciente(pacienteSeleccionado.dni);
        console.log('Resultado del servicio historias clínicas:', resultado);

        if (resultado.success) {
          console.log('Historias clínicas obtenidas:', resultado.data);
          setHistoriasClinicas(resultado.data);
        } else {
          console.error('Error al cargar historias clínicas:', resultado.message);
          setErrorHistorias(resultado.message);
          setHistoriasClinicas([]);
        }
      } catch (error) {
        console.error('Error inesperado:', error);
        setErrorHistorias('Error inesperado al cargar las historias clínicas');
        setHistoriasClinicas([]);
      } finally {
        setCargandoHistorias(false);
      }
    };

    cargarHistoriasClinicas();
  }, [pacienteSeleccionado]); // Se ejecuta cuando cambia el paciente seleccionado

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

  // Función para formatear fecha completa
  const formatearFechaCompleta = (fechaString) => {
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return fechaString;
    }
  };

  // Función para obtener el primer diagnóstico como texto
  const obtenerDiagnosticoPrincipal = (diagnosticos) => {
    if (!diagnosticos || diagnosticos.length === 0) {
      return 'Sin diagnóstico registrado';
    }
    const principal = diagnosticos[0];
    return `${principal.codigo} - ${principal.nombre}`;
  };

  // Función para obtener medicamentos como texto
  const obtenerTratamiento = (medicamentos) => {
    if (!medicamentos || medicamentos.length === 0) {
      return 'Sin tratamiento registrado';
    }
    return medicamentos.map(med =>
      `${med.nombre} ${med.dosis} - ${med.duracion}`
    ).join(', ');
  };

  // Función para abrir el modal con los detalles
  const abrirModal = (historia) => {
    const detalle = {
      fechaCompleta: formatearFechaCompleta(historia.fecha),
      agendaId: historia.agendaId,
      estado: historia.estado,
      resultado: historia.resultado,
      diagnosticos: historia.diagnosticos || [],
      medicamentos: historia.medicamentos || [],
      examenes: historia.examenes || []
    };
    setDetalleSeleccionado(detalle);
    setModalAbierto(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setDetalleSeleccionado(null);
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

  // Función para seleccionar un paciente
  const seleccionarPaciente = (paciente) => {
    setPacienteSeleccionado(paciente);
    setMostrarResultados(false);
    setFiltroTexto('');
    setPaginaActual(1);
    // Las historias clínicas se cargarán automáticamente por el useEffect
  };

  // Función para manejar la búsqueda
  const handleBuscar = () => {
    if (filtroTexto.trim()) {
      setMostrarResultados(true);
      setPacienteSeleccionado(null);
    }
  };

  // Función para limpiar el filtro
  const limpiarFiltro = () => {
    setFiltroTexto('');
    setMostrarResultados(false);
  };

  // Obtener historias clínicas del paciente seleccionado
  const historialActual = historiasClinicas;

  // Calcular datos de paginación
  const totalRegistros = historialActual.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const registrosPaginaActual = historialActual.slice(indiceInicio, indiceFin);

  // Funciones de paginación
  const irAPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  // Generar números de página para mostrar
  const generarNumerosPagina = () => {
    const numeros = [];
    const maxVisible = 9;

    if (totalPaginas <= maxVisible) {
      for (let i = 1; i <= totalPaginas; i++) {
        numeros.push(i);
      }
    } else {
      const inicio = Math.max(1, paginaActual - 4);
      const fin = Math.min(totalPaginas, paginaActual + 4);

      for (let i = inicio; i <= fin; i++) {
        numeros.push(i);
      }
    }

    return numeros;
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Historia Clínica del Paciente
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {/* Left Section - Search */}
        <Box sx={{ flex: 1, maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Busque por cédula
          </Typography>
          <Typography variant="caption" sx={{ mb: 2, color: 'text.secondary', display: 'block' }}>
            Digite la cédula del paciente a consultar
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
                backgroundColor: '#ff5722',
                '&:hover': { backgroundColor: '#e64a19' },
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
                borderColor: '#ff5722',
                color: '#ff5722',
                '&:hover': { borderColor: '#e64a19', backgroundColor: 'rgba(255, 87, 34, 0.04)' },
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

          {errorHistorias && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              Error historias: {errorHistorias}
            </Typography>
          )}

          {/* Estado de carga de historias específico */}
          {cargandoHistorias && pacienteSeleccionado && (
            <Typography variant="body2" color="info" sx={{ mb: 2 }}>
              Cargando historias clínicas de {pacienteSeleccionado.nombre}...
            </Typography>
          )}

          {/* Resultados de búsqueda */}
          <Collapse in={mostrarResultados && pacientesFiltrados.length > 0}>
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ py: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Pacientes encontrados ({pacientesFiltrados.length}):
                </Typography>
                <List dense>
                  {pacientesFiltrados.map((paciente) => (
                    <ListItem key={paciente.id} disablePadding>
                      <ListItemButton onClick={() => seleccionarPaciente(paciente)}>
                        <ListItemAvatar>
                          <Avatar src={paciente.avatar} sx={{ width: 32, height: 32 }} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={paciente.nombre}
                          secondary={`DNI: ${paciente.dni}`}
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
              No se encontraron pacientes para "{filtroTexto}"
            </Typography>
          )}
        </Box>

        {/* Right Section - Patient Info */}
        <Card sx={{ flex: 1, maxWidth: '50%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Datos de Afiliación
            </Typography>

            {pacienteSeleccionado ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                      Afiliado:
                    </Typography>
                    <Typography variant="body2">
                      {pacienteSeleccionado.nombre}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                      No. Identificación:
                    </Typography>
                    <Typography variant="body2">
                      {pacienteSeleccionado.dni}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                      Estado:
                    </Typography>
                    <Typography variant="body2">
                      {pacienteSeleccionado.estado}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                      Plan:
                    </Typography>
                    <Typography variant="body2">
                      {pacienteSeleccionado.plan}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Cotizante
                  </Typography>
                  <Avatar
                    sx={{ width: 80, height: 80, mb: 1 }}
                    src={pacienteSeleccionado.avatar}
                    alt="Paciente"
                  />
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Busque y seleccione un paciente para ver sus datos de afiliación
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Historial Section */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Histórico
            </Typography>
            {totalRegistros > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Botón anterior */}
                <Button
                  onClick={paginaAnterior}
                  disabled={paginaActual === 1}
                  sx={{
                    minWidth: '30px',
                    width: '30px',
                    height: '30px',
                    p: 0,
                    fontSize: '0.875rem',
                    color: paginaActual === 1 ? '#ccc' : '#666'
                  }}
                >
                  &lt;
                </Button>

                {/* Números de página */}
                {generarNumerosPagina().map((numero) => (
                  <Button
                    key={numero}
                    onClick={() => irAPagina(numero)}
                    sx={{
                      minWidth: '30px',
                      width: '30px',
                      height: '30px',
                      p: 0,
                      fontSize: '0.875rem',
                      backgroundColor: numero === paginaActual ? '#1976d2' : 'transparent',
                      color: numero === paginaActual ? 'white' : '#666',
                      '&:hover': {
                        backgroundColor: numero === paginaActual ? '#1565c0' : '#f0f0f0'
                      }
                    }}
                  >
                    {numero}
                  </Button>
                ))}

                {/* Botón siguiente */}
                <Button
                  onClick={paginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                  sx={{
                    minWidth: '30px',
                    width: '30px',
                    height: '30px',
                    p: 0,
                    fontSize: '0.875rem',
                    color: paginaActual === totalPaginas ? '#ccc' : '#666'
                  }}
                >
                  &gt;
                </Button>

                {/* Información de página */}
                <Typography variant="body2" sx={{ color: 'text.secondary', ml: 2 }}>
                  {indiceInicio + 1}-{Math.min(indiceFin, totalRegistros)} de {totalRegistros}
                </Typography>
              </Box>
            )}
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Agenda ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Diagnóstico</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Tratamiento</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Detalle</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrosPaginaActual.length > 0 ? (
                  registrosPaginaActual.map((historia, index) => (
                    <TableRow key={historia.agendaId || index} hover>
                      <TableCell sx={{ fontSize: '0.875rem' }}>
                        {formatearFecha(historia.fecha)}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>
                        {historia.agendaId}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>
                        <Chip
                          label={historia.estado}
                          size="small"
                          color={historia.estado === 'Completado' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', maxWidth: 200 }}>
                        <Typography variant="body2" sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {obtenerDiagnosticoPrincipal(historia.diagnosticos)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', maxWidth: 200 }}>
                        <Typography variant="body2" sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {obtenerTratamiento(historia.medicamentos)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => abrirModal(historia)}
                          sx={{ color: '#ff9800', p: 0.5 }}
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {!pacienteSeleccionado
                          ? 'Seleccione un paciente para ver su historia clínica'
                          : cargandoHistorias
                          ? 'Cargando historia clínica...'
                          : errorHistorias
                          ? `Error: ${errorHistorias}`
                          : `No hay historia clínica disponible para ${pacienteSeleccionado.nombre}`
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Modal de Detalle */}
      <Modal
        open={modalAbierto}
        onClose={cerrarModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        }}
      >
        <Fade in={modalAbierto}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
            outline: 'none',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Header del Modal */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Detalle del Registro Médico
              </Typography>
              <IconButton onClick={cerrarModal} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Contenido del Modal */}
            <Box sx={{ p: 3 }}>
              {detalleSeleccionado && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                      Fecha:
                    </Typography>
                    <Typography variant="body2">
                      {detalleSeleccionado.fechaCompleta}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                      Agenda ID:
                    </Typography>
                    <Typography variant="body2">
                      {detalleSeleccionado.agendaId}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                      Estado:
                    </Typography>
                    <Chip label={detalleSeleccionado.estado} size="small" />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                      Resultado:
                    </Typography>
                    <Typography variant="body2">
                      {detalleSeleccionado.resultado || 'Sin resultado registrado'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                      Diagnósticos:
                    </Typography>
                    {detalleSeleccionado.diagnosticos.length > 0 ? (
                      detalleSeleccionado.diagnosticos.map((diagnostico, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {diagnostico.codigo} - {diagnostico.nombre}
                          </Typography>
                          {diagnostico.observacion && (
                            <Typography variant="body2" color="text.secondary">
                              {diagnostico.observacion}
                            </Typography>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin diagnósticos registrados
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                      Medicamentos:
                    </Typography>
                    {detalleSeleccionado.medicamentos.length > 0 ? (
                      detalleSeleccionado.medicamentos.map((medicamento, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {medicamento.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Dosis: {medicamento.dosis} | Cantidad: {medicamento.cantidad} | Duración: {medicamento.duracion}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin medicamentos registrados
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                      Exámenes:
                    </Typography>
                    {detalleSeleccionado.examenes.length > 0 ? (
                      detalleSeleccionado.examenes.map((examen, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {examen.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Servicio: {examen.servicio} |
                            Estado: {examen.ordenado ? 'Ordenado' : 'No ordenado'}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin exámenes registrados
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

              {/* Botón del Modal */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={cerrarModal}
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0' }
                  }}
                >
                  Cerrar
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default HistoriaClinica;