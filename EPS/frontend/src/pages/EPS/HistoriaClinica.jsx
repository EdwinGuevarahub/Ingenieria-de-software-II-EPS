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
  Chip,
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

  // Estado para el modal de confirmación de pago
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [montoPago, setMontoPago] = useState(0);
  const [tipoPago, setTipoPago] = useState(''); // 'individual' o 'total'

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

  // Base de datos de pacientes (datos mock como respaldo)
  const pacientesMock = [
    {
      id: 1,
      nombre: 'David Alexander Molina',
      cedula: '1010321515',
      estado: 'Activo',
      plan: 'Básico',
      pendientePagar: 370000,
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 2,
      nombre: 'María José García',
      cedula: '1020304050',
      estado: 'Activo',
      plan: 'Premium',
      pendientePagar: 125000,
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 3,
      nombre: 'Carlos Eduardo López',
      cedula: '1030405060',
      estado: 'Inactivo',
      plan: 'Básico',
      pendientePagar: 25000,
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 4,
      nombre: 'Ana Patricia Ruiz',
      cedula: '1040506070',
      estado: 'Activo',
      plan: 'Premium',
      pendientePagar: 0,
      avatar: '/api/placeholder/60/60'
    }
  ];

  // Historial clínico por paciente con detalles completos (basado en DNIs reales)
  const historialPorPaciente = {
    2001234567: [ // Ana María López
      {
        fecha: '15/01/2024',
        concepto: 'Consulta ginecológica',
        estado: 'Pagado',
        valor: '85,000',
        detalle: {
          conceptoPago: 'Consulta ginecológica de control anual',
          fechaExamen: '15/01/2024',
          horaLugar: '9:00 A.M. IPS Central Consultorio 201',
          valorPagar: '85,000',
          estadoPago: 'Pagado'
        }
      },
      {
        fecha: '20/02/2024',
        concepto: 'Exámenes de laboratorio',
        estado: 'Pendiente',
        valor: '120,000',
        detalle: {
          conceptoPago: 'Exámenes completos - Perfil lipídico y hormonal',
          fechaExamen: '20/02/2024',
          horaLugar: '7:30 A.M. Laboratorio Clínico Central',
          valorPagar: '120,000',
          estadoPago: 'Pendiente por pagar'
        }
      },
      {
        fecha: '10/03/2024',
        concepto: 'Ecografía pélvica',
        estado: 'Pendiente',
        valor: '150,000',
        detalle: {
          conceptoPago: 'Ecografía pélvica transvaginal',
          fechaExamen: '10/03/2024',
          horaLugar: '2:00 P.M. Centro de Imágenes Diagnósticas',
          valorPagar: '150,000',
          estadoPago: 'Pendiente por pagar'
        }
      }
    ],
    2002345678: [ // Roberto Sánchez
      {
        fecha: '05/01/2024',
        concepto: 'Consulta cardiología',
        estado: 'Pagado',
        valor: '95,000',
        detalle: {
          conceptoPago: 'Consulta cardiológica especializada',
          fechaExamen: '05/01/2024',
          horaLugar: '10:30 A.M. IPS Cardiovascular Consultorio 305',
          valorPagar: '95,000',
          estadoPago: 'Pagado'
        }
      },
      {
        fecha: '15/02/2024',
        concepto: 'Electrocardiograma',
        estado: 'Pendiente',
        valor: '60,000',
        detalle: {
          conceptoPago: 'Electrocardiograma de reposo y esfuerzo',
          fechaExamen: '15/02/2024',
          horaLugar: '8:00 A.M. Centro Cardiológico',
          valorPagar: '60,000',
          estadoPago: 'Pendiente por pagar'
        }
      },
      {
        fecha: '25/02/2024',
        concepto: 'Medicamentos',
        estado: 'Pendiente',
        valor: '180,000',
        detalle: {
          conceptoPago: 'Medicamentos antihipertensivos - 3 meses',
          fechaExamen: '25/02/2024',
          horaLugar: 'Farmacia EPS - Sede Principal',
          valorPagar: '180,000',
          estadoPago: 'Pendiente por pagar'
        }
      }
    ],
    2003456789: [ // Carmen López (Beneficiaria de Ana)
      {
        fecha: '12/02/2024',
        concepto: 'Consulta pediatría',
        estado: 'Pagado',
        valor: '70,000',
        detalle: {
          conceptoPago: 'Consulta pediátrica - Control de crecimiento',
          fechaExamen: '12/02/2024',
          horaLugar: '3:00 P.M. IPS Infantil Consultorio 102',
          valorPagar: '70,000',
          estadoPago: 'Pagado'
        }
      },
      {
        fecha: '28/02/2024',
        concepto: 'Vacunación',
        estado: 'Pendiente',
        valor: '45,000',
        detalle: {
          conceptoPago: 'Esquema de vacunación - Refuerzo anual',
          fechaExamen: '28/02/2024',
          horaLugar: '4:00 P.M. Centro de Vacunación',
          valorPagar: '45,000',
          estadoPago: 'Pendiente por pagar'
        }
      }
    ],
    2004567890: [ // Diego Ramírez
      {
        fecha: '08/01/2024',
        concepto: 'Consulta medicina general',
        estado: 'Pagado',
        valor: '55,000',
        detalle: {
          conceptoPago: 'Consulta médica general - Chequeo preventivo',
          fechaExamen: '08/01/2024',
          horaLugar: '11:00 A.M. IPS General Consultorio 401',
          valorPagar: '55,000',
          estadoPago: 'Pagado'
        }
      },
      {
        fecha: '22/02/2024',
        concepto: 'Odontología',
        estado: 'Pendiente',
        valor: '90,000',
        detalle: {
          conceptoPago: 'Limpieza dental y fluorización',
          fechaExamen: '22/02/2024',
          horaLugar: '9:30 A.M. Clínica Odontológica',
          valorPagar: '90,000',
          estadoPago: 'Pendiente por pagar'
        }
      },
      {
        fecha: '05/03/2024',
        concepto: 'Fisioterapia',
        estado: 'Pendiente',
        valor: '75,000',
        detalle: {
          conceptoPago: 'Sesiones de fisioterapia - Rehabilitación lumbar',
          fechaExamen: '05/03/2024',
          horaLugar: '2:30 P.M. Centro de Rehabilitación',
          valorPagar: '75,000',
          estadoPago: 'Pendiente por pagar'
        }
      }
    ],
    2005678901: [ // Patricia Sánchez (Beneficiaria de Roberto)
      {
        fecha: '18/01/2024',
        concepto: 'Consulta pediatría',
        estado: 'Pagado',
        valor: '70,000',
        detalle: {
          conceptoPago: 'Consulta pediátrica - Control rutinario',
          fechaExamen: '18/01/2024',
          horaLugar: '10:00 A.M. IPS Infantil Consultorio 103',
          valorPagar: '70,000',
          estadoPago: 'Pagado'
        }
      },
      {
        fecha: '14/02/2024',
        concepto: 'Exámenes de laboratorio',
        estado: 'Pendiente',
        valor: '85,000',
        detalle: {
          conceptoPago: 'Exámenes de laboratorio pediátricos',
          fechaExamen: '14/02/2024',
          horaLugar: '8:00 A.M. Laboratorio Pediátrico',
          valorPagar: '85,000',
          estadoPago: 'Pendiente por pagar'
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

  // Funciones para el modal de pago
  const abrirModalPago = (monto, tipo) => {
    setMontoPago(monto);
    setTipoPago(tipo);
    setModalPagoAbierto(true);
  };

  const cerrarModalPago = () => {
    setModalPagoAbierto(false);
    setMontoPago(0);
    setTipoPago('');
  };

  const confirmarPago = () => {
    // Aquí iría la lógica real de procesamiento de pago
    console.log(`Procesando pago de ${montoPago.toLocaleString()} - Tipo: ${tipoPago}`);

    // Cerrar modal de pago y mostrar confirmación
    cerrarModalPago();

    // Aquí podrías actualizar el estado de los pagos, hacer llamada a API, etc.
  };

  // Filtrar pacientes según el texto de búsqueda
  const pacientesFiltrados = useMemo(() => {
    if (!filtroTexto.trim()) {
      return [];
    }

    const textoFiltro = filtroTexto.toLowerCase().trim();

    // Usar pacientes del backend si están disponibles, sino usar mock
    const listaPacientes = pacientes.length > 0 ? pacientes : pacientesMock;

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

  const getEstadoColor = (estado) => {
    return estado === 'Pagado' ? 'success' : 'warning';
  };

  const getEstadoVariant = (estado) => {
    return estado === 'Pagado' ? 'contained' : 'outlined';
  };

  // Obtener historial del paciente seleccionado
  const historialActual = pacienteSeleccionado ? historialPorPaciente[pacienteSeleccionado.dni] || [] : [];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Historia Clínica
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {/* Left Section - Search */}
        <Box sx={{ flex: 1, maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Busque paciente por número de documento o nombre
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
              color="error"
              onClick={handleBuscar}
              disabled={cargandoPacientes}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              {cargandoPacientes ? 'Cargando...' : 'Buscar'}
            </Button>
            {filtroTexto && (
              <Button
                variant="outlined"
                onClick={limpiarFiltro}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Limpiar
              </Button>
            )}
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
                          secondary={`DNI: ${paciente.dni} | ${paciente.beneficiario ? `Beneficiario de: ${paciente.beneficiario.nombre}` : 'Titular'}`}
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
            {pacienteSeleccionado ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{ width: 60, height: 60 }}
                  src={pacienteSeleccionado.avatar}
                  alt="Paciente"
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Paciente Seleccionado
                  </Typography>
                  <Box sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                    <Typography variant="caption" display="block">
                      <strong>Nombre:</strong> {pacienteSeleccionado.nombre}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>DNI:</strong> {pacienteSeleccionado.dni}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Email:</strong> {pacienteSeleccionado.email}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Teléfono:</strong> {pacienteSeleccionado.telefono}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Tipo:</strong> {pacienteSeleccionado.beneficiario ? `Beneficiario de ${pacienteSeleccionado.beneficiario.nombre}` : 'Titular'}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Fecha Afiliación:</strong> {new Date(pacienteSeleccionado.fechaAfiliacion).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Busque y seleccione un paciente para ver su historia clínica
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
              Historia Clínica
              {pacienteSeleccionado && (
                <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  - {pacienteSeleccionado.nombre} ({historialActual.length} registros)
                </Typography>
              )}
            </Typography>
            {historialActual.length > 0 && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                &lt;1 2 3 4 5 6 7 8 9 &gt; 1 de {Math.ceil(historialActual.length / 10)}
              </Typography>
            )}
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell><strong>Fecha</strong></TableCell>
                  <TableCell><strong>Concepto</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                  <TableCell><strong>Valor</strong></TableCell>
                  <TableCell><strong>Detalle</strong></TableCell>
                  <TableCell><strong>Acción</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historialActual.length > 0 ? (
                  historialActual.map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{row.fecha}</TableCell>
                      <TableCell>{row.concepto}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.estado}
                          color={getEstadoColor(row.estado)}
                          variant={getEstadoVariant(row.estado)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{row.valor}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => abrirModal(row)}
                          sx={{ color: 'orange' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {row.estado === 'Pendiente' && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => {
                              const valor = parseInt(row.valor.replace(',', ''));
                              abrirModalPago(valor, 'individual');
                            }}
                            sx={{ fontSize: '0.75rem', px: 1.5 }}
                          >
                            Pagar
                          </Button>
                        )}
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

                {historialActual.length > 0 && (
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>
                      Total pendiente: ${historialActual
                        .filter(item => item.estado === 'Pendiente')
                        .reduce((total, item) => {
                          return total + parseInt(item.valor.replace(',', ''));
                        }, 0).toLocaleString()}
                    </TableCell>
                    <TableCell colSpan={3} align="right">
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => {
                          const totalPendiente = historialActual
                            .filter(item => item.estado === 'Pendiente')
                            .reduce((total, item) => {
                              return total + parseInt(item.valor.replace(',', ''));
                            }, 0);
                          abrirModalPago(totalPendiente, 'total');
                        }}
                        sx={{ fontSize: '0.75rem', px: 2 }}
                        disabled={!historialActual.some(item => item.estado === 'Pendiente')}
                      >
                        Pagar Todo
                      </Button>
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
            width: 500,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
            outline: 'none'
          }}>

            {/* Contenido del Modal */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{
                textAlign: 'center',
                mb: 3,
                fontWeight: 'bold',
                textDecoration: 'underline'
              }}>
                Detalle Concepto
              </Typography>

              {detalleSeleccionado && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Concepto de pago:
                    </Typography>
                    <Typography variant="body2">
                      {detalleSeleccionado.conceptoPago}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Fecha de examen:
                    </Typography>
                    <Typography variant="body2">
                      {detalleSeleccionado.fechaExamen}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Hora y lugar:
                    </Typography>
                    <Typography variant="body2">
                      {detalleSeleccionado.horaLugar}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Valor a pagar:
                    </Typography>
                    <Typography variant="body2">
                      ${detalleSeleccionado.valorPagar} de cuota moderadora.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Estado:
                    </Typography>
                    <Typography variant="body2">
                      {detalleSeleccionado.estadoPago}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Botones del Modal */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {detalleSeleccionado?.estadoPago !== 'Pagado' && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      const valor = parseInt(detalleSeleccionado.valorPagar.replace(',', ''));
                      abrirModalPago(valor, 'individual');
                      cerrarModal(); // Cerrar el modal de detalle
                    }}
                  >
                    Pagar
                  </Button>
                )}
                <Button
                  variant="outlined"
                  onClick={cerrarModal}
                >
                  Cerrar
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Modal de Confirmación de Pago */}
      <Modal
        open={modalPagoAbierto}
        onClose={cerrarModalPago}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        }}
      >
        <Fade in={modalPagoAbierto}>
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
              Pago realizado
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

            <Typography variant="h6" sx={{
              mb: 1,
              color: '#333',
              fontWeight: 'bold'
            }}>
              Se ha pagado
            </Typography>

            <Typography variant="h4" sx={{
              mb: 4,
              color: '#333',
              fontWeight: 'bold'
            }}>
              ${montoPago.toLocaleString()}
            </Typography>

            <Button
              variant="contained"
              onClick={confirmarPago}
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
              Aceptar
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default HistoriaClinica;