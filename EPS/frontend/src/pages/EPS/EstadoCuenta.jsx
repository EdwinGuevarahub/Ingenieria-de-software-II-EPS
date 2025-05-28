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
    Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { listarPacientes } from '../../services/pacientesService';

const EstadoCuenta = () => {
    const navigate = useNavigate();

    // Estados para la búsqueda y datos
    const [busqueda, setBusqueda] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
    const [errorUsuarios, setErrorUsuarios] = useState(null);

    // Cargar usuarios al montar el componente
    useEffect(() => {
        const cargarUsuarios = async () => {
            setCargandoUsuarios(true);
            setErrorUsuarios(null);

            try {
                const resultado = await listarPacientes();
                if (resultado.success) {
                    // Transformar datos del backend para incluir información de estado de cuenta
                    const usuariosConEstado = resultado.data.map(usuario => ({
                        ...usuario,
                        estado: generarEstadoAleatorio(),
                        valorMensual: generarValorMensual(),
                        totalPagado: generarTotalPagado()
                    }));
                    setUsuarios(usuariosConEstado);
                    setUsuariosFiltrados(usuariosConEstado);
                } else {
                    console.error('Error al cargar usuarios:', resultado.message);
                    setErrorUsuarios(resultado.message);
                    // Usar datos mock como respaldo
                    setUsuarios(usuarios);
                    setUsuariosFiltrados(usuarios);
                }
            } catch (error) {
                console.error('Error inesperado:', error);
                setErrorUsuarios('Error inesperado al cargar los usuarios');
                // Usar datos mock como respaldo
                setUsuarios(usuarios);
                setUsuariosFiltrados(usuarios);
            } finally {
                setCargandoUsuarios(false);
            }
        };

        cargarUsuarios();
    }, []);

    // Función para generar estados aleatorios
    const generarEstadoAleatorio = () => {
        const estados = ['Pagado', 'Pendiente'];
        return estados[Math.floor(Math.random() * estados.length)];
    };

    // Función para generar valores mensuales aleatorios
    const generarValorMensual = () => {
        const valores = [85000, 100000, 120000, 95000, 110000];
        const valor = valores[Math.floor(Math.random() * valores.length)];
        return `$${valor.toLocaleString()}`;
    };

    // Función para generar totales pagados aleatorios
    const generarTotalPagado = () => {
        const valores = [500000, 895000, 1200000, 750000, 980000];
        const valor = valores[Math.floor(Math.random() * valores.length)];
        return `$${valor.toLocaleString()}`;
    };

    // Función para manejar la búsqueda
    const handleBuscar = () => {
        if (busqueda.trim()) {
            const filtrados = usuarios.filter(usuario =>
                usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                usuario.dni?.toString().includes(busqueda) ||
                usuario.email?.toLowerCase().includes(busqueda.toLowerCase())
            );
            setUsuariosFiltrados(filtrados);
        } else {
            setUsuariosFiltrados(usuarios);
        }
    };

    // Manejar Enter en el campo de búsqueda
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleBuscar();
        }
    };

    // Obtener color del estado
    const getEstadoColor = (estado) => {
        return estado === 'Pagado' ? 'success' : 'warning';
    };

    const getEstadoVariant = (estado) => {
        return estado === 'Pagado' ? 'contained' : 'outlined';
    };

    // Función para navegar al detalle
    const handleVerDetalle = (usuarioId) => {
        console.log('usuarioId', usuarioId);
        navigate(`/detalle-estado-cuenta/${usuarioId}`);
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Título */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                Ingrese la cédula o el nombre del afiliado
            </Typography>

            {/* Campo de búsqueda */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
                <TextField
                    placeholder="Cédula o nombre del afiliado"
                    variant="outlined"
                    size="medium"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={cargandoUsuarios}
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
                    onClick={handleBuscar}
                    disabled={cargandoUsuarios}
                    sx={{
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        textTransform: 'none',
                        px: 4,
                        py: 1.5,
                        '&:hover': { backgroundColor: '#b71c1c' }
                    }}
                >
                    {cargandoUsuarios ? 'Cargando...' : 'Buscar'}
                </Button>
            </Box>

            {/* Mostrar error si existe */}
            {errorUsuarios && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {errorUsuarios}
                </Typography>
            )}

            {/* Tabla de resultados */}
            <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>
                                Nombre
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>
                                Estado
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>
                                Valor Mensual
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>
                                Total Pagado
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>
                                Detalle
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuariosFiltrados.length > 0 ? (
                            usuariosFiltrados.map((usuario, index) => (
                                <TableRow
                                    key={usuario.id || index}
                                    sx={{
                                        backgroundColor: '#f0f0f0',
                                        '&:hover': { backgroundColor: '#e8e8e8' }
                                    }}
                                >
                                    <TableCell sx={{ fontSize: '0.95rem', py: 2, fontWeight: 'medium' }}>
                                        {usuario.nombre}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.95rem', py: 2 }}>
                                        <Typography
                                            sx={{
                                                color: getEstadoColor(usuario.estado),
                                                fontWeight: 'medium'
                                            }}
                                        >
                                            <Chip
                                                label={usuario.estado}
                                                color={getEstadoColor(usuario.estado)}
                                                variant={getEstadoVariant(usuario.estado)}
                                                size="small"
                                            />
                                            { }
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.95rem', py: 2, fontWeight: 'medium' }}>
                                        {usuario.valorMensual}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.95rem', py: 2, fontWeight: 'medium' }}>
                                        {usuario.totalPagado}
                                    </TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleVerDetalle(usuario.dni)}
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
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {busqueda.trim()
                                            ? `No se encontraron resultados para "${busqueda}"`
                                            : 'Realice una búsqueda para ver los estados de cuenta'
                                        }
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EstadoCuenta;