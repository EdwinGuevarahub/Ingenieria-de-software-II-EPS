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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { listarPacientes } from '../../services/pacientesService'; // Importar el servicio

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

  // Cargar pacientes al montar el componente
  useEffect(() => {
    const cargarPacientes = async () => {
      setCargandoPacientes(true);
      setErrorPacientes(null);

      try {
        const resultado = await listarPacientes();
        console.log('Resultado del servicio:', resultado);

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

  // Historial clínico por paciente con los nuevos campos médicos
  const historialPorPaciente = {
    '2001234567': [ // David Alexander Molina
      {
        fecha: '12/02/2023',
        anamnesis: 'Cuidado de dientes por comer',
        diagnostico: 'A021 - Septicemia debida a salmonella',
        tratamiento: 'Medicamento contra la salmonela',
        medicoTratante: 'Dr. Meschia',
        detalle: {
          fechaCompleta: '12 de febrero de 2023',
          anamnesis: 'Paciente refiere dolor dental al masticar alimentos duros. Presenta sensibilidad aumentada en molares superiores.',
          diagnostico: 'A021 - Septicemia debida a salmonella - Diagnóstico diferencial por sintomatología gastrointestinal asociada',
          tratamiento: 'Medicamento contra la salmonela - Ciprofloxacina 500mg cada 12 horas por 7 días',
          medicoTratante: 'Dr. Meschia - Medicina Interna',
          observaciones: 'Control en 48 horas. Hidratación abundante. Dieta blanda.'
        }
      },
      {
        fecha: '01/02/2024',
        anamnesis: 'Valoración por consulta médica',
        diagnostico: 'Paciente recuperado satisfactoriamente',
        tratamiento: 'Ninguno',
        medicoTratante: 'Dra. Quinto',
        detalle: {
          fechaCompleta: '1 de febrero de 2024',
          anamnesis: 'Paciente asiste a control médico. Refiere mejoría completa de síntomas previos.',
          diagnostico: 'Paciente recuperado satisfactoriamente - Sin hallazgos patológicos',
          tratamiento: 'Ninguno - Continuar con medidas preventivas',
          medicoTratante: 'Dra. Quinto - Medicina General',
          observaciones: 'Próximo control en 6 meses. Mantener hábitos saludables.'
        }
      },
      {
        fecha: '15/06/2024',
        anamnesis: 'Dolor abdominal en la parte baja',
        diagnostico: 'A023 - Infección por comer empanadas',
        tratamiento: 'Sal de frutas y agua de limón',
        medicoTratante: 'Dr. Galindo',
        detalle: {
          fechaCompleta: '15 de junio de 2024',
          anamnesis: 'Paciente presenta dolor abdominal en hipogastrio, tipo cólico, asociado a náuseas después de ingesta de empanadas en la calle.',
          diagnostico: 'A023 - Infección gastrointestinal por alimentos contaminados',
          tratamiento: 'Sal de frutas (citrato de sodio) cada 8 horas, agua de limón abundante, dieta líquida por 24 horas',
          medicoTratante: 'Dr. Galindo - Gastroenterología',
          observaciones: 'Evolución favorable esperada en 48-72 horas. Regresar si persisten síntomas.'
        }
      }
    ],
    '2002345678': [ // María José García
      {
        fecha: '15/01/2024',
        anamnesis: 'Control ginecológico anual',
        diagnostico: 'Examen normal - Sin hallazgos',
        tratamiento: 'Continuar controles anuales',
        medicoTratante: 'Dra. Martínez',
        detalle: {
          fechaCompleta: '15 de enero de 2024',
          anamnesis: 'Paciente asiste a control ginecológico de rutina. Sin síntomas. Última menstruación hace 10 días.',
          diagnostico: 'Examen ginecológico normal - Sin hallazgos patológicos',
          tratamiento: 'Continuar controles anuales - Citología al día',
          medicoTratante: 'Dra. Martínez - Ginecología',
          observaciones: 'Próximo control en 12 meses. Autoexamen mensual.'
        }
      },
      {
        fecha: '20/03/2024',
        anamnesis: 'Dolor pélvico intermitente',
        diagnostico: 'Quiste ovárico funcional',
        tratamiento: 'Analgésicos y observación',
        medicoTratante: 'Dra. Martínez',
        detalle: {
          fechaCompleta: '20 de marzo de 2024',
          anamnesis: 'Paciente refiere dolor pélvico intermitente del lado derecho, más intenso durante la ovulación.',
          diagnostico: 'Quiste ovárico funcional de 3cm en ovario derecho',
          tratamiento: 'Ibuprofeno 400mg cada 8 horas por dolor. Control ecográfico en 2 meses',
          medicoTratante: 'Dra. Martínez - Ginecología',
          observaciones: 'Quiste funcional. Resolución espontánea esperada en 2-3 ciclos.'
        }
      }
    ]
  };

  // Función para abrir el modal con los detalles
  const abrirModal = (item) => {
    setDetalleSeleccionado(item.detalle);
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

    // Usar pacientes del backend si están disponibles, sino usar mock
    const listaPacientes = pacientes.length > 0 ? pacientes : [];

    return listaPacientes.filter(paciente =>
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
    setPaginaActual(1); // Resetear a la primera página al seleccionar nuevo paciente
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

  // Obtener historial del paciente seleccionado
  const historialActual = pacienteSeleccionado ? historialPorPaciente[pacienteSeleccionado.dni] || [] : [];

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
    const maxVisible = 9; // Máximo 9 números visibles

    if (totalPaginas <= maxVisible) {
      // Si hay 9 páginas o menos, mostrar todas
      for (let i = 1; i <= totalPaginas; i++) {
        numeros.push(i);
      }
    } else {
      // Lógica más compleja para muchas páginas
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
              Enviar
            </Button>
          </Box>

          {/* Mostrar error si existe */}
          {errorPacientes && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {errorPacientes}
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
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Anamnesis</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Diagnóstico</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Tratamiento</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Médico tratante</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Detalle</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historialActual.length > 0 ? (
                  historialActual.map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell sx={{ fontSize: '0.875rem' }}>{row.fecha}</TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', maxWidth: 200 }}>
                        <Typography variant="body2" sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {row.anamnesis}
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
                          {row.diagnostico}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', maxWidth: 150 }}>
                        <Typography variant="body2" sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {row.tratamiento}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>{row.medicoTratante}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => abrirModal(row)}
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
                        {pacienteSeleccionado
                          ? `No hay historia clínica disponible para ${pacienteSeleccionado.nombre}`
                          : 'Seleccione un paciente para ver su historia clínica'
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
            width: 600,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
            outline: 'none'
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
                      Anamnesis:
                    </Typography>
                    <Typography variant="body2">
                      {detalleSeleccionado.anamnesis}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                      Diagnóstico:
                    </Typography>
                    <Typography variant="body2">
                      {detalleSeleccionado.diagnostico}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                      Tratamiento:
                    </Typography>
                    <Typography variant="body2">
                      {detalleSeleccionado.tratamiento}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                      Médico Tratante:
                    </Typography>
                    <Typography variant="body2">
                      {detalleSeleccionado.medicoTratante}
                    </Typography>
                  </Box>

                  {detalleSeleccionado.observaciones && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                        Observaciones:
                      </Typography>
                      <Typography variant="body2">
                        {detalleSeleccionado.observaciones}
                      </Typography>
                    </Box>
                  )}
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