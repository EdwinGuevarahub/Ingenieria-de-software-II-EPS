import React, { useState } from 'react';
import {
  Box, Typography, Container, TextField, Paper,
  FormControl, InputLabel, Select, MenuItem,
  Button, Snackbar, Alert
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GlobalStyles } from '@mui/styled-engine';

const SolicitarExamenMedico = () => {
  const [ordenMedica, setOrdenMedica] = useState('');
  const [ordenValida, setOrdenValida] = useState(false);
  const [servicio, setServicio] = useState('');
  const [ips, setIps] = useState('');
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const servicios = ['Radiografía', 'Ultrasonido', 'Tomografía'];
  const ipsDisponibles = ['Idime', 'Famisanar', 'Colsubsidio'];
  const horarios = ['08:00 - 08:20', '08:30 - 08:50', '09:00 - 09:20'];

  const validarOrden = () => {
    if (ordenMedica.trim() === '') {
      alert('Ingrese número de orden médica');
      return;
    }
    // Simular validación exitosa
    setOrdenValida(true);
  };

  const handleAgendar = () => {
    if (servicio && ips && fecha && hora) {
      setOpenSnackbar(true);
      // Aquí puede ir llamada a API para agendar
    } else {
      alert('Complete todos los campos');
    }
  };

  return (
    <Box sx={{ bgcolor: '#fefaf4', minHeight: '100vh', pt: 2, pb: 4 }}>
      {/* Estilos globales para fondo blanco en calendario emergente */}
      <GlobalStyles styles={{
        '.MuiCalendarOrClockPicker-root, .MuiCalendarPicker-root, .MuiPaper-root': {
          backgroundColor: 'white !important',
        }
      }} />

      <Container maxWidth="sm">
        <Typography variant="h5" align="center" gutterBottom>
          Solicitar Examen Médico
        </Typography>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#fff' }}>
          {/* Paso 1: Ingreso y validación orden médica */}
          {!ordenValida && (
            <>
              <TextField
                fullWidth
                label="Ingresa No. Orden Médica"
                value={ordenMedica}
                onChange={(e) => setOrdenMedica(e.target.value)}
                margin="normal"
              />
              <Button
                variant="contained"
                fullWidth
                onClick={validarOrden}
              >
                Validar Orden Médica
              </Button>
            </>
          )}

          {/* Paso 2: Formulario para seleccionar examen y agendar */}
          {ordenValida && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Servicio médico</InputLabel>
                <Select
                  value={servicio}
                  onChange={(e) => setServicio(e.target.value)}
                  label="Servicio médico"
                >
                  {servicios.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Seleccione IPS</InputLabel>
                <Select
                  value={ips}
                  onChange={(e) => setIps(e.target.value)}
                  label="Seleccione IPS"
                >
                  {ipsDisponibles.map((i) => (
                    <MenuItem key={i} value={i}>{i}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Seleccione la fecha"
                  value={fecha}
                  onChange={setFecha}
                  renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
                  componentsProps={{
                    popper: {
                      sx: {
                        '& .MuiPaper-root': {
                          bgcolor: 'white',
                        },
                        '& .MuiCalendarOrClockPicker-root': {
                          bgcolor: 'white',
                        },
                        '& .MuiCalendarPicker-root': {
                          bgcolor: 'white',
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>

              <FormControl fullWidth margin="normal">
                <InputLabel>Hora</InputLabel>
                <Select
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  label="Hora"
                >
                  {horarios.map((h) => (
                    <MenuItem key={h} value={h}>{h}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleAgendar}
              >
                Agendar
              </Button>
            </>
          )}
        </Paper>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
            Examen Agendado Correctamente
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default SolicitarExamenMedico;
