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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const HistoriaClinica = () => {
  // Estado para el filtro de búsqueda
  const [filtroTexto, setFiltroTexto] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Base de datos de pacientes
  const pacientes = [
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

  // Historial clínico por paciente
  const historialPorPaciente = {
    1: [ // David Alexander Molina
      {
        fecha: '12/02/2023',
        concepto: 'Examen general',
        estado: 'Pagado',
        valor: '50,000',
        detalle: <VisibilityIcon style={{cursor: 'pointer'}} />
      },
      {
        fecha: '01/02/2024',
        concepto: 'Consulta cardiología',
        estado: 'Pendiente',
        valor: '120,000',
        detalle: <VisibilityIcon style={{cursor: 'pointer'}} />
      },
      {
        fecha: '15/03/2024',
        concepto: 'Medicamentos',
        estado: 'Pendiente',
        valor: '200,000',
        detalle: <VisibilityIcon style={{cursor: 'pointer'}} />
      }
    ],
    2: [ // María José García
      {
        fecha: '05/01/2024',
        concepto: 'Consulta ginecología',
        estado: 'Pagado',
        valor: '80,000',
        detalle: <VisibilityIcon style={{cursor: 'pointer'}} />
      },
      {
        fecha: '20/02/2024',
        concepto: 'Exámenes de laboratorio',
        estado: 'Pendiente',
        valor: '45,000',
        detalle: <VisibilityIcon style={{cursor: 'pointer'}} />
      }
    ],
    3: [ // Carlos Eduardo López
      {
        fecha: '10/12/2023',
        concepto: 'Fisioterapia',
        estado: 'Pendiente',
        valor: '25,000',
        detalle: <VisibilityIcon style={{cursor: 'pointer'}} />
      }
    ],
    4: [ // Ana Patricia Ruiz
      {
        fecha: '01/02/2024',
        concepto: 'Consulta general',
        estado: 'Pagado',
        valor: '70,000',
        detalle: <VisibilityIcon style={{cursor: 'pointer'}} />
      }
    ]
  };

  // Filtrar pacientes según el texto de búsqueda
  const pacientesFiltrados = useMemo(() => {
    if (!filtroTexto.trim()) {
      return [];
    }

    const textoFiltro = filtroTexto.toLowerCase().trim();

    return pacientes.filter(paciente =>
      paciente.nombre.toLowerCase().includes(textoFiltro) ||
      paciente.cedula.includes(textoFiltro)
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
              sx={{ flex: 1 }}
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
                          secondary={`CC: ${paciente.cedula}`}
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
                      <strong>No. Identificación:</strong> {pacienteSeleccionado.cedula}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Estado:</strong> {pacienteSeleccionado.estado}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Plan:</strong> {pacienteSeleccionado.plan}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Pendiente por pagar:</strong> ${pacienteSeleccionado.pendientePagar.toLocaleString()}
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
                        <Box sx={{ color: 'orange', fontSize: '1.2rem' }}>{row.detalle}</Box>
                      </TableCell>
                      <TableCell>
                        {row.estado === 'Pendiente' && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
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
    </Box>
  );
};

export default HistoriaClinica;