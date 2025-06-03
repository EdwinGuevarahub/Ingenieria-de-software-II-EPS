import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Grid,
    Avatar,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { listarPacientes } from '../../services/pacientesService';
import { obtenerEstadoCuentaPorPaciente } from '../../services/estadoCuentaService';
import ConfirmacionPago from './ConfirmacionPago';
import { useAuthContext } from '../../contexts/AuthContext';


const DetalleEstadoCuenta = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { role } = useAuthContext();

    // Estados principales
    const [paciente, setPaciente] = useState(null);
    const [estadoCuenta, setEstadoCuenta] = useState(null);

    // Estados de carga
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [errorDatos, setErrorDatos] = useState(null);

    // Estados para el modal de pago
    const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
    const [montoPago, setMontoPago] = useState(0);
    const [tipoPago, setTipoPago] = useState('');
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

    // Cargar datos del paciente y su estado de cuenta
    useEffect(() => {
        const cargarDatos = async () => {
            setCargandoDatos(true);
            setErrorDatos(null);

            try {
                // 1. Cargar datos del paciente
                console.log('Cargando datos para DNI:', userId);
                const resultadoPacientes = await listarPacientes();

                if (!resultadoPacientes.success) {
                    setErrorDatos('Error al cargar datos del paciente: ' + resultadoPacientes.message);
                    return;
                }

                // Buscar el paciente específico por DNI
                const pacienteEncontrado = resultadoPacientes.data.find(p => p.dni.toString() === userId);

                if (!pacienteEncontrado) {
                    setErrorDatos(`Paciente con DNI ${userId} no encontrado`);
                    return;
                }

                console.log('Paciente encontrado:', pacienteEncontrado);
                setPaciente(pacienteEncontrado);

                // 2. Cargar estado de cuenta
                const resultadoEstado = await obtenerEstadoCuentaPorPaciente(userId);

                if (resultadoEstado.success) {
                    console.log('Estado de cuenta obtenido:', resultadoEstado.data);
                    setEstadoCuenta(resultadoEstado.data);
                } else {
                    console.error('Error al cargar estado:', resultadoEstado.message);
                    setErrorDatos('Error al cargar estado de cuenta: ' + resultadoEstado.message);
                }

            } catch (error) {
                console.error('Error inesperado:', error);
                setErrorDatos('Error inesperado al cargar los datos');
            } finally {
                setCargandoDatos(false);
            }
        };

        if (userId) {
            cargarDatos();
        }
    }, [userId]);

    // Funciones para el modal de pago
    const abrirModalPago = (monto, tipo, factura = null) => {
        setMontoPago(monto);
        setTipoPago(tipo);
        setFacturaSeleccionada(factura);
        setModalPagoAbierto(true);
    };

    const cerrarModalPago = () => {
        setModalPagoAbierto(false);
        setMontoPago(0);
        setTipoPago('');
        setFacturaSeleccionada(null);
    };

    // Función para manejar el pago individual
    const handlePagar = (factura) => {
        console.log('Iniciando pago para factura:', factura);
        abrirModalPago(factura.monto, 'individual', factura);
    };

    // Función para pagar todo (solo facturas pendientes)
    const handlePagarTodo = () => {
        if (!estadoCuenta?.facturas) return;

        const facturasPendientes = estadoCuenta.facturas.filter(f =>
            f.estado === 'pendiente' || f.estado === 'vencida'
        );

        const totalPendiente = facturasPendientes.reduce((total, factura) => total + factura.monto, 0);

        if (totalPendiente > 0) {
            abrirModalPago(totalPendiente, 'total', null);
        }
    };

    // Función para volver atrás
    const handleVolver = () => {
        navigate(-1);
    };

    // Funciones para manejar colores de estados
    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'pagada':
            case 'pagado':
                return 'success';
            case 'pendiente':
                return 'warning';
            case 'vencida':
            case 'vencido':
                return 'error';
            default:
                return 'default';
        }
    };

    const getEstadoVariant = (estado) => {
        return estado?.toLowerCase() === 'pagada' || estado?.toLowerCase() === 'pagado'
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

    // Función para obtener descripción de la factura
    const obtenerDescripcionFactura = (factura) => {
        if (!factura.detalles || factura.detalles.length === 0) {
            return `${factura.tipo} - ${formatearFecha(factura.fecha)}`;
        }

        // Si hay múltiples detalles, mostrar el primer servicio + cantidad
        if (factura.detalles.length === 1) {
            return factura.detalles[0].servicio;
        } else {
            return `${factura.detalles[0].servicio} (+${factura.detalles.length - 1} más)`;
        }
    };

    // Estados de carga y error
    if (cargandoDatos) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h6">Cargando información del estado de cuenta...</Typography>
            </Box>
        );
    }

    if (errorDatos) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {errorDatos}
                </Alert>
                <Button
                    variant="contained"
                    onClick={handleVolver}
                    sx={{
                        backgroundColor: '#d32f2f',
                        '&:hover': { backgroundColor: '#b71c1c' }
                    }}
                >
                    ← Volver
                </Button>
            </Box>
        );
    }

    if (!paciente || !estadoCuenta) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    No se encontraron datos
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleVolver}
                    sx={{
                        backgroundColor: '#d32f2f',
                        '&:hover': { backgroundColor: '#b71c1c' }
                    }}
                >
                    ← Volver
                </Button>
            </Box>
        );
    }

    // Calcular información derivada
    const facturasPendientes = estadoCuenta.facturas.filter(f =>
        f.estado === 'pendiente' || f.estado === 'vencida'
    );
    const totalPendienteFacturas = facturasPendientes.reduce((total, factura) => total + factura.monto, 0);
    const estadoGeneral = estadoCuenta.saldoPendiente > 0 ? 'Pendiente' : 'Al día';

    return (
        <Box sx={{ p: 3, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                {(role !== 'PACIENTE' &&
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
                )}
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Detalle Estado de Cuenta
                </Typography>
            </Box>

            {/* Card Principal - Datos del Usuario */}
            <Card sx={{ backgroundColor: 'white', mb: 3, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        {/* Columna Izquierda - Datos de Afiliación */}
                        <Grid item xs={12} md={7}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontSize: '1.1rem' }}>
                                Datos de Afiliación
                            </Typography>

                            <Box sx={{
                                backgroundColor: '#f5f5f5',
                                p: 2,
                                borderRadius: 1,
                                '& > div': {
                                    borderBottom: '1px solid #e0e0e0',
                                    py: 1,
                                    '&:last-child': {
                                        borderBottom: 'none'
                                    }
                                }
                            }}>
                                <Box>
                                    <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                                        <strong>Afiliado:</strong> {paciente.nombre}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                                        <strong>No. Identificación:</strong> {paciente.tipoDni} {paciente.dni}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                                        <strong>Email:</strong> {paciente.email}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                                        <strong>Estado:</strong>
                                        <Chip
                                            label={estadoGeneral}
                                            color={getEstadoColor(estadoGeneral)}
                                            variant={getEstadoVariant(estadoGeneral)}
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                                        <strong>Total Pagado:</strong> {formatearMonto(estadoCuenta.totalPagado)}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                                        <strong>Saldo Pendiente:</strong> {formatearMonto(estadoCuenta.saldoPendiente)}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                                        <strong>Total Facturas:</strong> {estadoCuenta.facturas.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Columna Derecha - Avatar del Paciente */}
                        <Grid item xs={12} md={5}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontSize: '1.1rem', textAlign: 'center' }}>
                                Paciente
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{
                                    width: 120,
                                    height: 120,
                                    backgroundColor: '#ff9800',
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(135deg, #ff9800, #ffa726)',
                                    border: '1px solid #e0e0e0',
                                    overflow: 'hidden',
                                    mb: 2
                                }}>
                                    <Avatar
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            backgroundColor: '#424242',
                                            fontSize: '2.5rem',
                                            color: 'white'
                                        }}
                                    >
                                        {paciente.nombre?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </Avatar>
                                </Box>

                                <Typography variant="body2" color="text.secondary" align="center">
                                    {paciente.nombre}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    DNI: {paciente.dni}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Resumen Financiero */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#e8f5e8' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="success.main">
                                Total Pagado
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {formatearMonto(estadoCuenta.totalPagado)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#fff3e0' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="warning.main">
                                Saldo Pendiente
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {formatearMonto(estadoCuenta.saldoPendiente)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#f3e5f5' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="primary.main">
                                Total Facturas
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {estadoCuenta.facturas.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabla de Facturas */}
            <Card sx={{ backgroundColor: 'white', boxShadow: 2 }}>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Historial de Facturas
                        </Typography>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2, textAlign: 'center' }}>
                                        Fecha
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2, textAlign: 'center' }}>
                                        Tipo
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2, textAlign: 'center' }}>
                                        Descripción
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2, textAlign: 'center' }}>
                                        Valor
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2, textAlign: 'center' }}>
                                        Estado
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2, textAlign: 'center' }}>
                                        Acción
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {estadoCuenta.facturas
                                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar por fecha descendente
                                    .map((factura) => (
                                    <TableRow
                                        key={factura.id}
                                        sx={{
                                            backgroundColor: '#f0f0f0',
                                            '&:hover': { backgroundColor: '#e8e8e8' }
                                        }}
                                    >
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, textAlign: 'center', fontWeight: 'medium' }}>
                                            {formatearFecha(factura.fecha)}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, textAlign: 'center' }}>
                                            <Chip
                                                label={factura.tipo}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, textAlign: 'center' }}>
                                            {obtenerDescripcionFactura(factura)}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, textAlign: 'center', fontWeight: 'medium' }}>
                                            {formatearMonto(factura.monto)}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, textAlign: 'center' }}>
                                            <Chip
                                                label={factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                                                color={getEstadoColor(factura.estado)}
                                                variant={getEstadoVariant(factura.estado)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 2, textAlign: 'center' }}>
                                            {(factura.estado === 'pendiente' || factura.estado === 'vencida') && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handlePagar(factura)}
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
                                                    Pagar
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {/* Fila de total y botón Pagar Todo - Solo si hay facturas pendientes */}
                                {totalPendienteFacturas > 0 && (
                                    <TableRow sx={{ backgroundColor: '#f8f9fa', borderTop: '2px solid #dee2e6' }}>
                                        <TableCell colSpan={4} sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1rem' }}>
                                            Total pendiente de pago: {formatearMonto(totalPendienteFacturas)}
                                        </TableCell>
                                        <TableCell colSpan={2} sx={{ textAlign: 'center' }}>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="medium"
                                                onClick={handlePagarTodo}
                                                sx={{
                                                    fontSize: '0.9rem',
                                                    px: 3,
                                                    fontWeight: 'bold'
                                                }}
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

            {/* Modal de Confirmación de Pago */}
            <ConfirmacionPago
                open={modalPagoAbierto}
                onClose={cerrarModalPago}
                idPaciente={userId}
                idAgenda={facturaSeleccionada?.id}
                montoPago={montoPago}
                onSuccess={() => {
                    console.log(`Pago confirmado: ${montoPago} (${tipoPago})`);
                    // Recargar datos después del pago
                    window.location.reload();
                }}
            />
        </Box>
    );
};

export default DetalleEstadoCuenta;