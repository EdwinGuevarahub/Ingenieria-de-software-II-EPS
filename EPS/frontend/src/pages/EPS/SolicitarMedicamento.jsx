import React, { useState } from 'react';
import {
  Box, Typography, Container, TextField, Button,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

const SolicitarMedicamento = () => {
  // Estado para la orden médica ingresada
  const [ordenMedica, setOrdenMedica] = useState('');

  // Estado para controlar si mostrar la tabla con disponibilidad
  const [mostrarTabla, setMostrarTabla] = useState(false);

  // Datos simulados de disponibilidad (pueden venir de una API real)
  const datosDisponibilidad = [
    { horario: '8:00 - 17:00', ips: 'Idime', direccion: 'Calle 6 # 14-68' },
    { horario: '8:00 - 17:00', ips: 'Clinica Colombia', direccion: 'Carrera 8 # 24-68' },
    { horario: '8:00 - 17:00', ips: 'Famisanar', direccion: 'Avenida 86 # 27-85 Sur' },
    { horario: '8:00 - 17:00', ips: 'Audifarma', direccion: 'Diagonal 6 # 14-75' },
    { horario: '8:00 - 17:00', ips: 'Colsubsidio', direccion: 'Transversal 21 # 40-53' },
    { horario: '8:00 - 17:00', ips: 'Compensar', direccion: 'Carrera 10 # 24-36' },
  ];

  // Maneja el evento al presionar "Consultar Disponibilidad"
  const handleConsultar = () => {
    if (ordenMedica.trim() !== '') {
      // Aquí puedes agregar llamada a API para obtener datos reales
      setMostrarTabla(true);
    } else {
      alert('Por favor ingresa un número de orden médica válido.');
    }
  };

  return (
    <Box sx={{ bgcolor: '#fefaf4', minHeight: '100vh', pt: 4, pb: 4 }}>
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" gutterBottom>
          Solicitar Medicamento
        </Typography>

        <Paper
          elevation={3}
          sx={{ p: 3, borderRadius: 2, bgcolor: '#fff', border: '1px solid #ccc' }}
        >
          {/* Input para ingresar número de orden médica */}
          <TextField
            fullWidth
            label="Ingresa No. Orden Médica"
            placeholder="No. Orden médica"
            value={ordenMedica}
            onChange={(e) => setOrdenMedica(e.target.value)}
            margin="normal"
          />

          {/* Botón para consultar disponibilidad */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleConsultar}
            sx={{ mt: 2 }}
          >
            Consultar Disponibilidad
          </Button>

          {/* Mostrar tabla solo si se consultó disponibilidad */}
          {mostrarTabla && (
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Horario de Atención</strong></TableCell>
                    <TableCell><strong>IPS</strong></TableCell>
                    <TableCell><strong>Dirección</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datosDisponibilidad.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.horario}</TableCell>
                      <TableCell>{item.ips}</TableCell>
                      <TableCell>{item.direccion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default SolicitarMedicamento;
