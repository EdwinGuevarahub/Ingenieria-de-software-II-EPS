import React, { useState, useMemo } from 'react';
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

const GestionPagos = () => {
  // Estado para el filtro de búsqueda
  const [filtroTexto, setFiltroTexto] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Estado para los modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [montoPago, setMontoPago] = useState(0);
  const [tipoPago, setTipoPago] = useState('');

  // Base de datos de pacientes
  const pacientes = [
    {
      id: 1,
      nombre: 'David Alexander Molina',
      dni: '1010321515',
      estado: 'Activo',
      plan: 'Básico',
      pendientePagar: 370000,
      avatar: 'https://via.placeholder.com/60x60/9c27b0/ffffff?text=DM'
    },
    {
      id: 2,
      nombre: 'María José García',
      dni: '1020304050',
      estado: 'Activo',
      plan: 'Premium',
      pendientePagar: 125000,
      avatar: 'https://via.placeholder.com/60x60/2196f3/ffffff?text=MG'
    },
    {
      id: 3,
      nombre: 'Carlos Eduardo López',
      dni: '1030405060',
      estado: 'Activo',
      plan: 'Básico',
      pendientePagar: 25000,
      avatar: 'https://via.placeholder.com/60x60/4caf50/ffffff?text=CL'
    },
    {
      id: 4,
      nombre: 'Ana Patricia Ruiz',
      dni: '1040506070',
      estado: 'Activo',
      plan: 'Premium',
      pendientePagar: 0,
      avatar: 'https://via.placeholder.com/60x60/ff9800/ffffff?text=AR'
    }
  ];

  // Historial de pagos por paciente
  const historialPorPaciente = {
    1: [ // David Alexander Molina
      {
        fecha: '12/02/2023',
        concepto: 'Examen',
        estado: 'Pagado',
        valor: '50,000',
        detalle: {
          conceptoPago: 'Examen de lípidos por gammografía',
          fechaExamen: '12/02/2023',
          horaLugar: '8:00 A.M. IPS XXX Consultorio 302',
          valorPagar: '50,000',
          estadoPago: 'Pagado'
        }
      },
      {
        fecha: '01/02/2024',
        concepto: 'Cita',
        estado: 'Pendiente',
        valor: '80,000',
        detalle: {
          conceptoPago: 'Consulta especializada en cardiología',
          fechaExamen: '01/02/2024',
          horaLugar: '10:30 A.M. IPS ABC Consultorio 105',
          valorPagar: '80,000',
          estadoPago: 'Pendiente por pagar'
        }
      },
      {
        fecha: '15/06/2024',
        concepto: 'Medicamentos',
        estado: 'Pendiente',
        valor: '25,000',
        detalle: {
          conceptoPago: 'Medicamentos recetados - Tratamiento cardiovascular',
          fechaExamen: '15/06/2024',
          horaLugar: 'Farmacia Central - Sede Principal',
          valorPagar: '25,000',
          estadoPago: 'Pendiente por pagar'
        }
      },
      {
        fecha: '01/02/2024',
        concepto: 'Afiliación',
        estado: 'Pendiente',
        valor: '70,000',
        detalle: {
          conceptoPago: 'Proceso de afiliación a la EPS',
          fechaExamen: '01/02/2024',
          horaLugar: 'Oficina Principal',
          valorPagar: '70,000',
          estadoPago: 'Pendiente por pagar'
        }
      },
      {
        fecha: '01/02/2024',
        concepto: 'Afiliación',
        estado: 'Pagado',
        valor: '70,000',
        detalle: {
          conceptoPago: 'Proceso de afiliación a la EPS',
          fechaExamen: '01/02/2024',
          horaLugar: 'Oficina Principal',
          valorPagar: '70,000',
          estadoPago: 'Pagado'
        }
      }
    ],
    2: [ // María José García
      {
        fecha: '05/01/2024',
        concepto: 'Consulta ginecología',
        estado: 'Pagado',
        valor: '80,000',
        detalle: {
          conceptoPago: 'Consulta ginecológica de control',
          fechaExamen: '05/01/2024',
          horaLugar: '2:00 P.M. IPS XXX Consultorio 201',
          valorPagar: '80,000',
          estadoPago: 'Pagado'
        }
      },
      {
        fecha: '20/02/2024',
        concepto: 'Exámenes de laboratorio',
        estado: 'Pendiente',
        valor: '45,000',
        detalle: {
          conceptoPago: 'Exámenes de laboratorio - Perfil hormonal',
          fechaExamen: '20/02/2024',
          horaLugar: '7:00 A.M. Laboratorio Central',
          valorPagar: '45,000',
          estadoPago: 'Pendiente por pagar'
        }
      }
    ],
    3: [ // Carlos Eduardo López
      {
        fecha: '10/12/2023',
        concepto: 'Fisioterapia',
        estado: 'Pendiente',
        valor: '25,000',
        detalle: {
          conceptoPago: 'Sesión de fisioterapia - Rehabilitación',
          fechaExamen: '10/12/2023',
          horaLugar: '4:00 P.M. Centro de Rehabilitación',
          valorPagar: '25,000',
          estadoPago: 'Pendiente por pagar'
        }
      }
    ],
    4: [ // Ana Patricia Ruiz
      {
        fecha: '01/02/2024',
        concepto: 'Consulta general',
        estado: 'Pagado',
        valor: '70,000',
        detalle: {
          conceptoPago: 'Consulta médica general',
          fechaExamen: '01/02/2024',
          horaLugar: '9:00 A.M. IPS XXX Consultorio 101',
          valorPagar: '70,000',
          estadoPago: 'Pagado'
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
    console.log(`Procesando pago de $${montoPago.toLocaleString()} - Tipo: ${tipoPago}`);
    cerrarModalPago();
  };

  // Filtrar pacientes según el texto de búsqueda
  const pacientesFiltrados = useMemo(() => {
    if (!filtroTexto.trim()) {
      return [];
    }

    const textoFiltro = filtroTexto.toLowerCase().trim();

    return pacientes.filter(paciente =>
      paciente.nombre.toLowerCase().includes(textoFiltro) ||
      paciente.dni.includes(textoFiltro)
    );
  }, [filtroTexto]);

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
  const historialActual = pacienteSeleccionado ? historialPorPaciente[pacienteSeleccionado.id] || [] : [];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Pagos
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {/* Left Section - Search */}
        <Box sx={{ flex: 1, maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Busque por número de documento o nombre los pagos
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
              sx={{ flex: 1, backgroundColor: 'white' }}
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleBuscar}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Buscar
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
            {pacienteSeleccionado ? (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Datos de Afiliación
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ fontSize: '0.875rem', lineHeight: 1.4, mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Afiliado:</strong> {pacienteSeleccionado.nombre}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>No. Identificación:</strong> {pacienteSeleccionado.dni}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Estado:</strong> {pacienteSeleccionado.estado}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Plan:</strong> {pacienteSeleccionado.plan}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Pendiente por pagar:</strong> {pacienteSeleccionado.pendientePagar.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{
                    width: 120,
                    height: 120,
                    backgroundColor: '#e3f2fd',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Avatar
                      src={pacienteSeleccionado.avatar}
                      sx={{ width: 80, height: 80, fontSize: '2rem' }}
                    />
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, color: '#1976d2' }}>
                  Cotizante
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Busque y seleccione un paciente para ver su información de pagos
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
              Historial
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
                          ? `No hay historial de pagos disponible para ${pacienteSeleccionado.nombre}`
                          : 'Seleccione un paciente para ver su historial de pagos'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {historialActual.length > 0 && (
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>
                      Total a pagar: ${historialActual
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
            {/* Header del Modal */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 3,
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#f5f5f5'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Detalle Pago
              </Typography>
              <IconButton onClick={cerrarModal} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

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
                      cerrarModal();
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

export default GestionPagos;