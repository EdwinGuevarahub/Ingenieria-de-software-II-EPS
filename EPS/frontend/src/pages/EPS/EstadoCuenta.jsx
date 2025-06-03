import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    InputAdornment,
    Chip,
    Alert,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Collapse,
    Card,
    CardContent,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { listarPacientes } from '../../services/pacientesService';
import { obtenerEstadoCuentaPorPaciente } from '../../services/estadoCuentaService';
import { useAuthContext } from '../../contexts/AuthContext';

const EstadoCuenta = () => {
    const navigate = useNavigate();
    const { subEmail, role } = useAuthContext();

    // Estados para la búsqueda y datos
    const [busqueda, setBusqueda] = useState('');
    const [pacientes, setPacientes] = useState([]);
    const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
    const [estadosCuenta, setEstadosCuenta] = useState([]);
    const [mostrarResultadosBusqueda, setMostrarResultadosBusqueda] = useState(false);

    // Estados de carga
    const [cargandoPacientes, setCargandoPacientes] = useState(false);
    const [cargandoEstados, setCargandoEstados] = useState(false);
    const [errorPacientes, setErrorPacientes] = useState(null);
    const [errorEstados, setErrorEstados] = useState(null);

    // Cargar pacientes al montar el componente
    useEffect(() => {
        const cargarPacientes = async () => {
            setCargandoPacientes(true);
            setErrorPacientes(null);

            try {
                const resultado = await listarPacientes();
                if (resultado.success) {
                    console.log('Pacientes cargados:', resultado.data);
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

    // Auto-cargar datos del paciente si el rol es PACIENTE
    useEffect(() => {
        if (role === 'PACIENTE' && pacientes.length > 0 && subEmail) {
            const pacienteLogueado = pacientes.find(p =>
                p.email?.toLowerCase() === subEmail.toLowerCase()
            );

            if (pacienteLogueado) {
                console.log('Paciente logueado encontrado, redirigiendo al detalle:', pacienteLogueado);
                // Redirigir directamente al detalle usando su DNI
                navigate(`/detalle-estado-cuenta/${pacienteLogueado.dni}`);
            } else {
                console.log('No se encontró paciente con email:', subEmail);
                setErrorEstados('No se encontró información de cuenta para su email');
            }
        }
    }, [pacientes, role, subEmail, navigate]);

    // Función para filtrar pacientes en tiempo real
    const filtrarPacientes = (textoBusqueda) => {
        if (!textoBusqueda.trim()) {
            setPacientesFiltrados([]);
            setMostrarResultadosBusqueda(false);
            return;
        }

        const filtrados = pacientes.filter(paciente =>
            paciente.nombre?.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
            paciente.dni?.toString().includes(textoBusqueda) ||
            paciente.email?.toLowerCase().includes(textoBusqueda.toLowerCase())
        );

        console.log('Pacientes filtrados:', filtrados);
        setPacientesFiltrados(filtrados);
        setMostrarResultadosBusqueda(true);
    };

    // Función para manejar cambios en el campo de búsqueda
    const handleCambioBusqueda = (e) => {
        const valor = e.target.value;
        setBusqueda(valor);

        // Solo mostrar sugerencias si no es PACIENTE
        if (role !== 'PACIENTE') {
            filtrarPacientes(valor);
        }
    };

    // Función para seleccionar un paciente y cargar su estado de cuenta
    const handleSeleccionarPaciente = async (paciente) => {
        console.log('Paciente seleccionado:', paciente);

        // Limpiar estado anterior
        setEstadosCuenta([]);
        setErrorEstados(null);
        setBusqueda(paciente.nombre);
        setMostrarResultadosBusqueda(false);

        // Cargar estado de cuenta
        setCargandoEstados(true);

        try {
            const resultado = await obtenerEstadoCuentaPorPaciente(paciente.dni);

            if (resultado.success) {
                console.log('Estado de cuenta obtenido:', resultado.data);

                // Procesar la estructura real de datos
                const estadoCuenta = resultado.data;

                // Calcular información derivada
                const valorMensual = calcularValorMensual(estadoCuenta.facturas);
                const fechaUltimoPago = obtenerFechaUltimoPago(estadoCuenta.facturas);
                const estadoGeneral = estadoCuenta.saldoPendiente > 0 ? 'Pendiente' : 'Al día';

                // Crear objeto para mostrar en la tabla
                const estadoParaTabla = {
                    pacienteInfo: paciente,
                    saldoPendiente: estadoCuenta.saldoPendiente,
                    totalPagado: estadoCuenta.totalPagado,
                    valorMensual: valorMensual,
                    fechaUltimoPago: fechaUltimoPago,
                    estado: estadoGeneral,
                    facturas: estadoCuenta.facturas,
                    // Datos adicionales para referencia
                    cantidadFacturas: estadoCuenta.facturas.length,
                    facturasVencidas: estadoCuenta.facturas.filter(f => f.estado === 'vencida').length,
                    facturasPendientes: estadoCuenta.facturas.filter(f => f.estado === 'pendiente').length
                };

                setEstadosCuenta([estadoParaTabla]);
            } else {
                console.error('Error al cargar estado:', resultado.message);
                setErrorEstados(resultado.message);
                setEstadosCuenta([]);
            }
        } catch (error) {
            console.error('Error inesperado:', error);
            setErrorEstados('Error inesperado al cargar el estado de cuenta');
            setEstadosCuenta([]);
        } finally {
            setCargandoEstados(false);
        }
    };

    // Función para calcular valor mensual promedio basado en facturas de afiliación
    const calcularValorMensual = (facturas) => {
        const facturasAfiliacion = facturas.filter(f => f.tipo === 'AFILIACION');
        if (facturasAfiliacion.length === 0) return 0;

        const totalAfiliacion = facturasAfiliacion.reduce((sum, f) => sum + f.monto, 0);
        return totalAfiliacion / facturasAfiliacion.length;
    };

    // Función para obtener la fecha del último pago
    const obtenerFechaUltimoPago = (facturas) => {
        const facturasPagadas = facturas.filter(f => f.estado === 'pagada');
        if (facturasPagadas.length === 0) return null;

        // Ordenar por fecha descendente y tomar la primera
        const facturasOrdenadas = facturasPagadas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        return facturasOrdenadas[0].fecha;
    };

    // Función para manejar búsqueda manual (Enter o botón)
    const handleBuscarManual = () => {
        if (!busqueda.trim()) return;

        // Buscar paciente exacto
        const pacienteEncontrado = pacientes.find(p =>
            p.nombre?.toLowerCase() === busqueda.toLowerCase() ||
            p.dni?.toString() === busqueda.trim()
        );

        if (pacienteEncontrado) {
            handleSeleccionarPaciente(pacienteEncontrado);
        } else {
            setErrorEstados(`No se encontró paciente: "${busqueda}"`);
            setEstadosCuenta([]);
        }
    };

    // Manejar Enter en el campo de búsqueda
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (role === 'PACIENTE') return; // Los pacientes no pueden buscar manualmente
            handleBuscarManual();
        }
    };

    // Función para limpiar búsqueda
    const handleLimpiar = () => {
        setBusqueda('');
        setPacientesFiltrados([]);
        setEstadosCuenta([]);
        setMostrarResultadosBusqueda(false);
        setErrorEstados(null);
    };

    // Obtener color del estado
    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'al día':
            case 'al dia':
            case 'pagado':
                return 'success';
            case 'pendiente':
                return 'warning';
            case 'moroso':
            case 'vencido':
                return 'error';
            default:
                return 'default';
        }
    };

    const getEstadoVariant = (estado) => {
        return estado?.toLowerCase() === 'al día' ||
               estado?.toLowerCase() === 'al dia' ||
               estado?.toLowerCase() === 'pagado'
            ? 'filled'
            : 'outlined';
    };

    // Función para formatear valores monetarios
    const formatearMonto = (monto) => {
        if (!monto && monto !== 0) return 'N/A';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(monto);
    };

    // Función para formatear fechas
    const formatearFecha = (fecha) => {
        if (!fecha) return 'N/A';
        try {
            return new Date(fecha).toLocaleDateString('es-ES');
        } catch {
            return 'N/A';
        }
    };

    // Función para navegar al detalle
    const handleVerDetalle = (dni) => {
        console.log('Navegando a detalle para DNI:', dni);
        navigate(`/detalle-estado-cuenta/${dni}`);
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Título */}
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                Estado de Cuenta
            </Typography>

            {/* Campo de búsqueda - Solo mostrar si NO es PACIENTE */}
            {role !== 'PACIENTE' && (
                <>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                        Ingrese la cédula o el nombre del afiliado
                    </Typography>

                    <Box sx={{ position: 'relative', mb: 4 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                placeholder="Cédula o nombre del afiliado"
                                variant="outlined"
                                size="medium"
                                value={busqueda}
                                onChange={handleCambioBusqueda}
                                onKeyPress={handleKeyPress}
                                disabled={cargandoPacientes}
                                sx={{
                                    flex: 1,
                                    maxWidth: 600,
                                    backgroundColor: 'white',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#ddd',
                                        },
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#999' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleBuscarManual}
                                disabled={cargandoPacientes || !busqueda.trim()}
                                sx={{
                                    backgroundColor: '#d32f2f',
                                    color: 'white',
                                    textTransform: 'none',
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': { backgroundColor: '#b71c1c' }
                                }}
                            >
                                Buscar
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleLimpiar}
                                disabled={cargandoPacientes}
                                sx={{
                                    borderColor: '#d32f2f',
                                    color: '#d32f2f',
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1.5,
                                    '&:hover': {
                                        borderColor: '#b71c1c',
                                        backgroundColor: 'rgba(211, 47, 47, 0.04)'
                                    }
                                }}
                            >
                                Limpiar
                            </Button>
                        </Box>

                        {/* Lista de sugerencias */}
                        <Collapse in={mostrarResultadosBusqueda && pacientesFiltrados.length > 0}>
                            <Card sx={{ mt: 1, maxWidth: 600, maxHeight: 300, overflow: 'auto' }}>
                                <List dense>
                                    {pacientesFiltrados.slice(0, 10).map((paciente) => (
                                        <ListItem key={paciente.dni} disablePadding>
                                            <ListItemButton onClick={() => handleSeleccionarPaciente(paciente)}>
                                                <ListItemText
                                                    primary={paciente.nombre}
                                                    secondary={`DNI: ${paciente.dni} - ${paciente.email}`}
                                                    primaryTypographyProps={{ fontSize: '0.9rem' }}
                                                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Card>
                        </Collapse>

                        {/* Mensaje cuando no hay resultados en la búsqueda */}
                        {mostrarResultadosBusqueda && pacientesFiltrados.length === 0 && busqueda.trim() && (
                            <Card sx={{ mt: 1, maxWidth: 600 }}>
                                <CardContent sx={{ py: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No se encontraron pacientes para "{busqueda}"
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </>
            )}

            {/* Para PACIENTE - Mostrar mensaje de redirección */}
            {role === 'PACIENTE' && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
                        Redirigiendo a su estado de cuenta...
                    </Typography>
                    {cargandoPacientes && (
                        <CircularProgress sx={{ mt: 2 }} />
                    )}
                </Box>
            )}

            {/* Mostrar errores */}
            {errorPacientes && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Error al cargar pacientes: {errorPacientes}
                </Alert>
            )}

            {errorEstados && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {errorEstados}
                </Alert>
            )}

            {/* Indicador de carga */}
            {cargandoEstados && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                        Cargando estado de cuenta...
                    </Typography>
                </Box>
            )}

            {/* Tabla de estados de cuenta - Solo mostrar si NO es PACIENTE */}
            {!cargandoEstados && role !== 'PACIENTE' && (
                <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>
                                    Nombre
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>
                                    DNI
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>
                                    Estado
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>
                                    Valor Mensual
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>
                                    Saldo Pendiente
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>
                                    Último Pago
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {estadosCuenta.length > 0 ? (
                                estadosCuenta.map((estado, index) => (
                                    <TableRow
                                        key={estado.id || index}
                                        sx={{
                                            backgroundColor: '#f0f0f0',
                                            '&:hover': { backgroundColor: '#e8e8e8' }
                                        }}
                                    >
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, fontWeight: 'medium' }}>
                                            {estado.pacienteInfo?.nombre || 'N/A'}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, fontWeight: 'medium' }}>
                                            {estado.pacienteInfo?.dni || 'N/A'}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2 }}>
                                            <Chip
                                                label={estado.estado || 'Desconocido'}
                                                color={getEstadoColor(estado.estado)}
                                                variant={getEstadoVariant(estado.estado)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, fontWeight: 'medium' }}>
                                            {formatearMonto(estado.valorMensual)}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, fontWeight: 'medium' }}>
                                            {formatearMonto(estado.saldoPendiente)}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2 }}>
                                            {formatearFecha(estado.fechaUltimoPago)}
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleVerDetalle(estado.pacienteInfo?.dni)}
                                                sx={{
                                                    backgroundColor: '#d32f2f',
                                                    color: 'white',
                                                    textTransform: 'none',
                                                    fontSize: '0.8rem',
                                                    px: 2,
                                                    py: 0.5,
                                                    '&:hover': { backgroundColor: '#b71c1c' }
                                                }}
                                            >
                                                Ver detalle
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            {role === 'PACIENTE'
                                                ? 'No se encontró información de estado de cuenta para su cuenta'
                                                : 'Seleccione un paciente para ver su estado de cuenta'
                                            }
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default EstadoCuenta;