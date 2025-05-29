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

  // Base de datos de pacientes (mock como respaldo)
  const pacientesMock = [
    {
      id: 1,
      nombre: 'David Alexander Molina',
      dni: '1010321515',
      estado: 'Activo',
      plan: 'Básico',
      pendientePagar: 370000,
      email: 'david.molina@email.com',
      telefono: '3001234567',
      fechaAfiliacion: '2023-01-15',
      avatar: 'https://via.placeholder.com/60x60/9c27b0/ffffff?text=DM'
    },
    {
      id: 2,
      nombre: 'María José García',
      dni: '1020304050',
      estado: 'Activo',
      plan: 'Premium',
      pendientePagar: 125000,
      email: 'maria.garcia@email.com',
      telefono: '3002345678',
      fechaAfiliacion: '2023-02-20',
      avatar: 'https://via.placeholder.com/60x60/2196f3/ffffff?text=MG'
    },
    {
      id: 3,
      nombre: 'Carlos Eduardo López',
      dni: '1030405060',
      estado: 'Activo',
      plan: 'Básico',
      pendientePagar: 25000,
      email: 'carlos.lopez@email.com',
      telefono: '3003456789',
      fechaAfiliacion: '2023-03-10',
      avatar: 'https://via.placeholder.com/60x60/4caf50/ffffff?text=CL'
    },
    {
      id: 4,
      nombre: 'Ana Patricia Ruiz',
      dni: '1040506070',
      estado: 'Activo',
      plan: 'Premium',
      pendientePagar: 0,
      email: 'ana.ruiz@email.com',
      telefono: '3004567890',
      fechaAfiliacion: '2023-04-25',
      avatar: 'https://via.placeholder.com/60x60/ff9800/ffffff?text=AR'
    }
  ];

  // Historial de pagos por paciente (expandido con más registros)
  const historialPorPaciente = {
    '2001234567': [ // David Alexander Molina
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
      },
      {
        fecha: '22/03/2024',
        concepto: 'Laboratorio',
        estado: 'Pagado',
        valor: '45,000',
        detalle: {
          conceptoPago: 'Exámenes de laboratorio completos',
          fechaExamen: '22/03/2024',
          horaLugar: '7:00 A.M. Laboratorio Central',
          valorPagar: '45,000',
          estadoPago: 'Pagado'
        }
      },
      {
        fecha: '10/04/2024',
        concepto: 'Radiología',
        estado: 'Pendiente',
        valor: '120,000',
        detalle: {
          conceptoPago: 'Radiografía de tórax y abdomen',
          fechaExamen: '10/04/2024',
          horaLugar: '2:00 P.M. Centro de Imágenes',
          valorPagar: '120,000',
          estadoPago: 'Pendiente por pagar'
        }
      },
      {
        fecha: '25/04/2024',
        concepto: 'Consulta especializada',
        estado: 'Pendiente',
        valor: '95,000',
        detalle: {
          conceptoPago: 'Consulta con endocrinología',
          fechaExamen: '25/04/2024',
          horaLugar: '11:00 A.M. IPS Especializada',
          valorPagar: '95,000',
          estadoPago: 'Pendiente por pagar'
        }
      },
      {
        fecha: '15/05/2024',
        concepto: 'Fisioterapia',
        estado: 'Pagado',
        valor: '35,000',
        detalle: {
          conceptoPago: 'Sesión de fisioterapia rehabilitación',
          fechaExamen: '15/05/2024',
          horaLugar: '4:00 P.M. Centro de Rehabilitación',
          valorPagar: '35,000',
          estadoPago: 'Pagado'
        }
      },
      {
        fecha: '02/06/2024',
        concepto: 'Medicamentos',
        estado: 'Pendiente',
        valor: '55,000',
        detalle: {
          conceptoPago: 'Medicamentos control diabetes',
          fechaExamen: '02/06/2024',
          horaLugar: 'Farmacia EPS Principal',
          valorPagar: '55,000',
          estadoPago: 'Pendiente por pagar'
        }
      },
      {
        fecha: '18/06/2024',
        concepto: 'Odontología',
        estado: 'Pendiente',
        valor: '75,000',
        detalle: {
          conceptoPago: 'Limpieza dental y consulta',
          fechaExamen: '18/06/2024',
          horaLugar: '9:00 A.M. Clínica Dental',
          valorPagar: '75,000',
          estadoPago: 'Pendiente por pagar'
        }
      },
      {
        fecha: '05/07/2024',
        concepto: 'Ecografía',
        estado: 'Pagado',
        valor: '85,000',
        detalle: {
          conceptoPago: 'Ecografía abdominal completa',
          fechaExamen: '05/07/2024',
          horaLugar: '1:00 P.M. Centro Diagnóstico',
          valorPagar: '85,000',
          estadoPago: 'Pagado'
        }
      },
      {
        fecha: '20/07/2024',
        concepto: 'Consulta general',
        estado: 'Pendiente',
        valor: '40,000',
        detalle: {
          conceptoPago: 'Consulta médica general control',
          fechaExamen: '20/07/2024',
          horaLugar: '10:00 A.M. IPS Principal',
          valorPagar: '40,000',
          estadoPago: 'Pendiente por pagar'
        }
      },
      {
        fecha: '12/08/2024',
        concepto: 'Vacunación',
        estado: 'Pagado',
        valor: '15,000',
        detalle: {
          conceptoPago: 'Vacuna antigripal anual',
          fechaExamen: '12/08/2024',
          horaLugar: '8:00 A.M. Centro de Vacunación',
          valorPagar: '15,000',
          estadoPago: 'Pagado'
        }
      },
      {
        fecha: '28/08/2024',
        concepto: 'Oftalmología',
        estado: 'Pendiente',
        valor: '65,000',
        detalle: {
          conceptoPago: 'Examen oftalmológico completo',
          fechaExamen: '28/08/2024',
          horaLugar: '3:00 P.M. Centro Oftalmológico',
          valorPagar: '65,000',
          estadoPago: 'Pendiente por pagar'
        }
      }
    ],
    '2002345678': [ // María José García
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
      },
      {
        fecha: '15/03/2024',
        concepto: 'Ecografía',
        estado: 'Pagado',
        valor: '90,000',
        detalle: {
          conceptoPago: 'Ecografía pélvica transvaginal',
          fechaExamen: '15/03/2024',
          horaLugar: '10:00 A.M. Centro de Imágenes',
          valorPagar: '90,000',
          estadoPago: 'Pagado'
        }
      }
    ],
    '2003456789': [ // Carlos Eduardo López
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
    '2004567890': [ // Ana Patricia Ruiz
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

  const getEstadoColor = (estado) => {
    return estado === 'Pagado' ? 'success' : 'warning';
  };

  const getEstadoVariant = (estado) => {
    return estado === 'Pagado' ? 'contained' : 'outlined';
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
              disabled={cargandoPacientes}
              sx={{ flex: 1, backgroundColor: 'white' }}
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
                        <strong>Pendiente por pagar:</strong> ${pacienteSeleccionado.pendientePagar?.toLocaleString() || '0'}
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
                  <TableCell><strong>Fecha</strong></TableCell>
                  <TableCell><strong>Concepto</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                  <TableCell><strong>Valor</strong></TableCell>
                  <TableCell><strong>Acción</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrosPaginaActual.length > 0 ? (
                  registrosPaginaActual.map((row, index) => (
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