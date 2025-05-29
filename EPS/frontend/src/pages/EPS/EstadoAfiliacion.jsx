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
  Modal,
  Backdrop,
  Fade
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { listarPacientes } from '../../services/pacientesService';
import { useNavigate } from 'react-router-dom';


const EstadoAfiliacion = () => {
  // Estado para los pacientes del backend
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [cargandoPacientes, setCargandoPacientes] = useState(false);
  const [errorPacientes, setErrorPacientes] = useState(null);

  // Estado para el modal de certificado
  const [modalCertificadoAbierto, setModalCertificadoAbierto] = useState(false);

  // Cargar pacientes al montar el componente
  useEffect(() => {
    const cargarPacientes = async () => {
      setCargandoPacientes(true);
      setErrorPacientes(null);

      try {
        const resultado = await listarPacientes();
        if (resultado.success) {
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

  // Datos del titular (mock como respaldo)
  const titularMock = {
    nombre: 'Ana María López',
    identificacion: '2001234567',
    estado: 'Activo',
    plan: 'Básico',
    pendientePagar: '370.000'
  };

  // Datos de beneficiarios (exactos del mockup)
  const beneficiarios = [
    {
      id: 1,
      nombre: 'María Antonia Pérez Cuy',
      relacion: 'Cónyuge',
      documento: '98765243',
      fechaNacimiento: '22/03/1987',
      afiliadoDesde: '19/03/2018'
    },
    {
      id: 2,
      nombre: 'Andrea Gómez Pérez',
      relacion: 'Hijo (a)',
      documento: '1122334455',
      fechaNacimiento: '11/09/2010',
      afiliadoDesde: '22/03/2018'
    },
    {
      id: 3,
      nombre: 'Martín Gómez Pérez',
      relacion: 'Hijo (a)',
      documento: '1133554488',
      fechaNacimiento: '07/11/2013',
      afiliadoDesde: '22/03/2018'
    },
    {
      id: 4,
      nombre: 'Javier Gómez Rozo',
      relacion: 'Padre',
      documento: '87023579',
      fechaNacimiento: '03/12/1949',
      afiliadoDesde: '25/04/2019'
    }
  ];

  // Obtener datos del titular (del backend o mock)
  const titular = pacientes.length > 0 ? pacientes[0] : titularMock;

  // Función para abrir el modal de certificado
  const abrirModalCertificado = () => {
    setModalCertificadoAbierto(true);
  };

  // Función para cerrar el modal de certificado
  const cerrarModalCertificado = () => {
    setModalCertificadoAbierto(false);
  };

  const handleEditarAfiliados = () => {
    navigate(`/editar-afiliado/${titular.dni || titular.identificacion}`);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
        Estado de afiliación
      </Typography>

      {/* Card Principal - Datos de Afiliación */}
      <Card sx={{ backgroundColor: 'white', mb: 3, boxShadow: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={4} style={{justifyContent: 'space-between'}}>
            {/* Columna Izquierda - Datos de Afiliación */}
            <Grid item xs={8}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontSize: '1.1rem' }}>
                Datos de Afiliación
              </Typography>

              <Box sx={{ pl: 2 }}>
                <Typography variant="body1" sx={{ mb: 1.5, fontSize: '0.95rem' }}>
                  <strong>Afiliado:</strong> {titular.nombre}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1.5, fontSize: '0.95rem' }}>
                  <strong>No. Identificación:</strong> {titular.dni || titular.identificacion}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1.5, fontSize: '0.95rem' }}>
                  <strong>Estado:</strong> {titular.estado}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1.5, fontSize: '0.95rem' }}>
                  <strong>Plan:</strong> {titular.plan}
                </Typography>

                <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                  <strong>Pendiente por pagar:</strong> {titular.pendientePagar || '370.000'}
                </Typography>
              </Box>
            </Grid>

            {/* Columna Derecha - Cotizante */}
            <Grid item xs={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontSize: '1.1rem', textAlign: 'right' }}>
                Cotizante
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Box sx={{
                  width: 120,
                  height: 120,
                  backgroundColor: '#ff9800',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #ff9800, #ffa726)',
                  border: '1px solid #e0e0e0'
                }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: '#424242',
                      fontSize: '2rem',
                      color: 'white'
                    }}
                    src="/api/placeholder/80/80"
                  >
                    {titular.nombre?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </Avatar>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Card Beneficiarios */}
      <Card sx={{ backgroundColor: 'white', boxShadow: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontSize: '1.1rem' }}>
            Beneficiarios
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2 }}>
                    Nombre
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2 }}>
                    Relación
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2 }}>
                    No Documento
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2 }}>
                    Fecha de nacimiento
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2 }}>
                    Afiliado desde
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {beneficiarios.map((beneficiario, index) => (
                  <TableRow
                    key={beneficiario.id}
                    sx={{
                      '&:hover': { backgroundColor: '#f9f9f9' }
                    }}
                  >
                    <TableCell sx={{ fontSize: '0.9rem', py: 2 }}>
                      {beneficiario.nombre}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem', py: 2 }}>
                      {beneficiario.relacion}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem', py: 2 }}>
                      {beneficiario.documento}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem', py: 2 }}>
                      {beneficiario.fechaNacimiento}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.9rem', py: 2 }}>
                      {beneficiario.afiliadoDesde}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Botones de acción */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              onClick={abrirModalCertificado}
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                textTransform: 'none',
                fontSize: '0.9rem',
                py: 1,
                px: 3,
                '&:hover': { backgroundColor: '#b71c1c' }
              }}
            >
              Enviar Certificado
            </Button>
            <Button
              variant="contained"
              onClick={handleEditarAfiliados}
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                textTransform: 'none',
                fontSize: '0.9rem',
                py: 1,
                px: 3,
                '&:hover': { backgroundColor: '#b71c1c' }
              }}
            >
              Editar Afiliados
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Modal de Certificado Exitoso */}
      <Modal
        open={modalCertificadoAbierto}
        onClose={cerrarModalCertificado}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        }}
      >
        <Fade in={modalCertificadoAbierto}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
            outline: 'none'
          }}>
            {/* Contenido del Modal */}
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.primary' }}>
               <b>Su certificado ha sido enviado a su correo electrónico registrado.</b>
              </Typography>

              {/* Icono de éxito */}
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

              {/* Botón Cerrar */}
              <Button
                variant="contained"
                onClick={cerrarModalCertificado}
                sx={{
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  '&:hover': { backgroundColor: '#b71c1c' }
                }}
              >
                Cerrar
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

    </Box>
  );
};

export default EstadoAfiliacion;