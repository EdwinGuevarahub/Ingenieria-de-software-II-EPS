import React, { useState } from 'react';
import {
  Box, Typography, Container, FormControl, InputLabel, Select, MenuItem,
  Button, Paper, Snackbar, Alert
} from '@mui/material';

import { GlobalStyles } from '@mui/styled-engine';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// 👇 Importa el contexto de autenticación
import { useAuthContext } from '../../contexts/AuthContext';

const AgendarCita = () => {
  const { role } = useAuthContext(); //  Obtiene el rol del usuario

  const [servicio, setServicio] = useState('');
  const [ips, setIps] = useState('');
  const [fecha, setFecha] = useState(null);
  const [horario, setHorario] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const servicios = ['Medicina General', 'Odontología', 'Pediatría'];
  const ipsDisponibles = ['Famisanar', 'Colsanitas', 'Compensar'];
  const horarios = [
    '8:00 - 08:20',
    '8:30 - 08:50',
    '9:00 - 09:20 Dr. Haessler Ortiz'
  ];

  const menuProps = {
    PaperProps: {
      sx: { bgcolor: 'white', color: 'black' },
    },
  };

  const handleAgendar = () => {
    if (servicio && ips && fecha && horario) {
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ bgcolor: '#fefaf4', minHeight: '100vh', py: 8 }}>
      <GlobalStyles styles={{
        '.MuiCalendarOrClockPicker-root, .MuiCalendarPicker-root, .MuiPaper-root': {
          backgroundColor: 'white !important',
        }
      }} />

      <Container maxWidth="sm">
        {/*  Contenido exclusivo para el rol PACIENTE */}
        {role === 'PACIENTE' && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1" color="primary">
              Bienvenido paciente, aquí puedes agendar tu cita médica.
            </Typography>
          </Box>
        )}

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#fff' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Solicitar Cita Medica
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Servicio médico</InputLabel>
            <Select
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              label="Servicio médico"
              MenuProps={menuProps}
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
              MenuProps={menuProps}
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
              onChange={(newValue) => setFecha(newValue)}
              format="DD-MM-YYYY"
              sx={{ mt: 2, width: '100%' }}
              componentsProps={{
                popper: {
                  sx: {
                    '& .MuiPaper-root': { bgcolor: 'white' },
                    '& .MuiCalendarOrClockPicker-root': { bgcolor: 'white' },
                    '& .MuiCalendarPicker-root': { bgcolor: 'white' },
                  },
                },
              }}
            />
          </LocalizationProvider>

          <FormControl fullWidth margin="normal">
            <InputLabel>Hora y especialista</InputLabel>
            <Select
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              label="Hora y especialista"
              MenuProps={menuProps}
            >
              {horarios.map((h) => (
                <MenuItem key={h} value={h}>{h}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            color="error"
            sx={{ mt: 3 }}
            onClick={handleAgendar}
          >
            Agendar
          </Button>
        </Paper>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          ¡Cita agendada correctamente!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AgendarCita;
