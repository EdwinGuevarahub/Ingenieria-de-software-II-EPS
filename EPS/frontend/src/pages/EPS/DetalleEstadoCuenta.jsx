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
    Modal,
    Backdrop,
    Fade
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { listarPacientes } from '../../services/pacientesService';
import ConfirmacionPago from './ConfirmacionPago';

const DetalleEstadoCuenta = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    // Estados originales
    const [usuario, setUsuario] = useState(null);
    const [cargandoUsuario, setCargandoUsuario] = useState(false);
    const [errorUsuario, setErrorUsuario] = useState(null);

    // Estados para el modal de pago
    const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
    const [montoPago, setMontoPago] = useState(0);
    const [tipoPago, setTipoPago] = useState('');
    const [detalleIdPago, setDetalleIdPago] = useState(null);

    // Cargar datos del usuario
    useEffect(() => {
        const cargarUsuario = async () => {
            setCargandoUsuario(true);
            setErrorUsuario(null);

            try {
                const resultado = await listarPacientes();
                console.log('Resultado del servicio:', resultado);

                if (resultado.success) {
                    // Buscar el usuario específico por ID en los datos del backend
                    const usuarioEncontrado = resultado.data.find(u => u.dni.toString() === userId);

                    if (usuarioEncontrado) {
                        // Combinar datos del backend con datos mock para completar la información
                        setUsuario({
                            ...usuarioEncontrado,
                            // Agregar campos adicionales que no vienen del backend
                            pendientePagar: generarPendientePagar(),
                            detallesFacturacion: generarDetallesFacturacion()
                        });
                    } else {
                        setErrorUsuario(`Usuario con ID ${userId} no encontrado`);
                        setUsuario(null);
                    }
                } else {
                    console.error('Error al cargar usuarios:', resultado.message);
                    setErrorUsuario(resultado.message);
                    setUsuario(null);
                }
            } catch (error) {
                console.error('Error inesperado:', error);
                setErrorUsuario('Error inesperado al cargar el usuario');
                setUsuario(null);
            } finally {
                setCargandoUsuario(false);
            }
        };

        if (userId) {
            cargarUsuario();
        }
    }, [userId]);

    // Funciones para generar datos adicionales basados en el usuario real
    const generarPendientePagar = () => {
        const valores = ['270.000', '370.000', '150.000', '450.000', '200.000'];
        return valores[Math.floor(Math.random() * valores.length)];
    };

    const generarDetallesFacturacion = () => {
        const detallesBase = [
            {
                id: 1,
                fecha: '15/02/2025',
                descripcion: 'Fórmula médica: Medicamento A',
                valor: '$45.000',
                estado: 'Pagado',
                accion: null
            },
            {
                id: 2,
                fecha: '05/03/2025',
                descripcion: 'Cita Médica: Consulta General',
                valor: '$60.000',
                estado: 'Pendiente',
                accion: 'pagar'
            },
            {
                id: 3,
                fecha: '20/02/2025',
                descripcion: 'Exámenes: Examen de tiroides',
                valor: '$30.000',
                estado: 'Pendiente',
                accion: 'pagar'
            }
        ];

        // Agregar variaciones aleatorias para diferentes usuarios
        const variaciones = [
            {
                id: 4,
                fecha: '10/03/2025',
                descripcion: 'Fisioterapia: Sesión de rehabilitación',
                valor: '$40.000',
                estado: 'Pagado',
                accion: null
            },
            {
                id: 5,
                fecha: '25/02/2025',
                descripcion: 'Consulta especializada: Cardiología',
                valor: '$85.000',
                estado: 'Pendiente',
                accion: 'pagar'
            }
        ];

        // Retornar detalles base + algunas variaciones aleatorias
        const detallesAdicionales = variaciones.filter(() => Math.random() > 0.5);
        return [...detallesBase, ...detallesAdicionales];
    };

    // Funciones para el modal de pago
    const abrirModalPago = (monto, tipo, detalleId = null) => {
        setMontoPago(monto);
        setTipoPago(tipo);
        setDetalleIdPago(detalleId);
        setModalPagoAbierto(true);
    };

    const cerrarModalPago = () => {
        setModalPagoAbierto(false);
        setMontoPago(0);
        setTipoPago('');
        setDetalleIdPago(null);
    };

    // Función para manejar el pago individual
    const handlePagar = (detalleId) => {
        const detalle = usuario.detallesFacturacion.find(d => d.id === detalleId);
        if (detalle) {
            // Extraer el número del valor ($60.000 -> 60000)
            const valor = parseInt(detalle.valor.replace(/\$|\.|,/g, ''));
            abrirModalPago(valor, 'individual', detalleId);
        }
    };

    // Función para pagar todo
    const handlePagarTodo = () => {
        const detallesPendientes = usuario.detallesFacturacion.filter(d => d.estado === 'Pendiente');
        const totalPendiente = detallesPendientes.reduce((total, detalle) => {
            return total + parseInt(detalle.valor.replace(/\$|\.|,/g, ''));
        }, 0);

        if (totalPendiente > 0) {
            abrirModalPago(totalPendiente, 'total');
        }
    };

    // Función para volver atrás
    const handleVolver = () => {
        navigate(-1); // Volver a la página anterior
    };

    // Funciones para manejar colores de estados (igual que en GestionPagos)
    const getEstadoColor = (estado) => {
        return estado === 'Pagado' ? 'success' : 'warning';
    };

    const getEstadoVariant = (estado) => {
        return estado === 'Pagado' ? 'contained' : 'outlined';
    };

    if (cargandoUsuario) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">Cargando información del usuario...</Typography>
            </Box>
        );
    }

    if (errorUsuario) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                    {errorUsuario}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleVolver}
                    sx={{
                        backgroundColor: '#d32f2f',
                        '&:hover': { backgroundColor: '#b71c1c' }
                    }}
                >
                    Volver a la lista
                </Button>
            </Box>
        );
    }

    if (!usuario) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Usuario no encontrado
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleVolver}
                    sx={{
                        backgroundColor: '#d32f2f',
                        '&:hover': { backgroundColor: '#b71c1c' }
                    }}
                >
                    Volver a la lista
                </Button>
            </Box>
        );
    }

    // Calcular total pendiente para el botón "Pagar Todo"
    const totalPendiente = usuario.detallesFacturacion
        .filter(d => d.estado === 'Pendiente')
        .reduce((total, detalle) => {
            return total + parseInt(detalle.valor.replace(/\$|\.|,/g, ''));
        }, 0);

    return (
        <Box sx={{ p: 3, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            {/* Header */}
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                Detalle Estado de Cuenta
            </Typography>

            {/* Card Principal - Datos del Usuario */}
            <Card sx={{ backgroundColor: 'white', mb: 3, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                    <Grid container style={{ justifyContent: 'space-between' }}>
                        {/* Columna Izquierda - Datos de Afiliación */}
                        <Grid item xs={7}>
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
                                        <strong>Afiliado:</strong> {usuario.nombre}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                                        <strong>No. Identificación:</strong> {usuario.dni || usuario.identificacion}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                                        <strong>Estado:</strong> {usuario.estado}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                                        <strong>Plan:</strong> {usuario.plan}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                                        <strong>Pendiente por pagar:</strong> {usuario.pendientePagar}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Columna Derecha - Cotizante */}
                        <Grid item xs={5}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontSize: '1.1rem', textAlign: 'center' }}>
                                Cotizante
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                    overflow: 'hidden'
                                }}>
                                    <Avatar
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            backgroundColor: '#424242',
                                            fontSize: '2.5rem',
                                            color: 'white'
                                        }}
                                        src={usuario.avatar || '/api/placeholder/100/100'}
                                    >
                                        {usuario.nombre?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </Avatar>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Tabla de Detalles de Facturación */}
            <Card sx={{ backgroundColor: 'white', boxShadow: 2 }}>
                <CardContent sx={{ p: 0 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2, textAlign: 'center' }}>
                                        Fecha
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
                                {usuario.detallesFacturacion.map((detalle, index) => (
                                    <TableRow
                                        key={detalle.id}
                                        sx={{
                                            backgroundColor: '#f0f0f0',
                                            '&:hover': { backgroundColor: '#e8e8e8' }
                                        }}
                                    >
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, textAlign: 'center', fontWeight: 'medium' }}>
                                            {detalle.fecha}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, textAlign: 'center' }}>
                                            {detalle.descripcion}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, textAlign: 'center', fontWeight: 'medium' }}>
                                            {detalle.valor}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.95rem', py: 2, textAlign: 'center' }}>
                                            <Typography
                                                sx={{
                                                    color: detalle.estado === 'Pagado' ? '#4caf50' : '#ff9800',
                                                    fontWeight: 'medium'
                                                }}
                                            >
                                                <Chip
                                                    label={detalle.estado}
                                                    color={getEstadoColor(detalle.estado)}
                                                    variant={getEstadoVariant(detalle.estado)}
                                                    size="small"
                                                />
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 2, textAlign: 'center' }}>
                                            {detalle.accion === 'pagar' && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handlePagar(detalle.id)}
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

                                {/* Fila de total y botón Pagar Todo */}
                                {totalPendiente > 0 && (
                                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                        <TableCell colSpan={3} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                            Total a pagar: ${totalPendiente.toLocaleString()}
                                        </TableCell>
                                        <TableCell colSpan={2} sx={{ textAlign: 'center' }}>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={handlePagarTodo}
                                                sx={{ fontSize: '0.8rem', px: 2 }}
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

            {/* Botón para volver */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
                <Button
                    variant="outlined"
                    onClick={handleVolver}
                    sx={{
                        borderColor: '#d32f2f',
                        color: '#d32f2f',
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        '&:hover': {
                            borderColor: '#b71c1c',
                            backgroundColor: 'rgba(211, 47, 47, 0.04)'
                        }
                    }}
                >
                    ← Volver
                </Button>
            </Box>

            {/* Modal de Confirmación de Pago */}
            <ConfirmacionPago
                open={modalPagoAbierto}
                onClose={cerrarModalPago}
                usuario={usuario}
                idAgenda={detalleIdPago}
                montoPago={montoPago}
                setUsuario={setUsuario}
                onSuccess={() => {
                    // Aquí puedes manejar la lógica de confirmación del pago
                    console.log(`Pago confirmado: ${montoPago} (${tipoPago}) para detalle ID: ${detalleIdPago}`);
                }}
            />
        </Box>
    );
};

export default DetalleEstadoCuenta;
