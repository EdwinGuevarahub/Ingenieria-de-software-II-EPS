import React, { useState, useEffect} from 'react';
import axios from 'axios';
import {
  Box, Typography, Container, FormControl, InputLabel, Select, MenuItem,
  Button, Paper, Snackbar, Alert
} from '@mui/material';

// Importamos GlobalStyles para aplicar estilos globales personalizados
import { GlobalStyles } from '@mui/styled-engine';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Reemplaza tu componente AgendarCita por este
const AgendarCita = () => {
  const [servicio, setServicio] = useState('');
  const [ips, setIps] = useState('');
  const [fecha, setFecha] = useState(null);
  const [horario, setHorario] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [servicios, setServicios] = useState([]);
  const [ipsDisponibles, setIpsDisponibles] = useState([]);
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/servicioMedico?qSize=20&qPage=0')
      .then(res => setServicios(res.data.servicios))
      .catch(err => console.error('Error cargando servicios:', err));
  }, []);

  // Cargar IPS según servicio
  useEffect(() => {
    if (servicio) {
      axios.get(`http://localhost:8080/api/ips?cupsServicioMedico=${servicio}&qSize=10&qPage=0`)
        .then(res => setIpsDisponibles(res.data.ips))
        .catch(err => console.error('Error cargando IPS:', err));
    } else {
      setIpsDisponibles([]);
      setIps('');
    }
  }, [servicio]);
  // Cargar horarios según servicio, ips y fecha
  useEffect(() => {
    if (servicio && ips && fecha) {
      const token = localStorage.getItem('authToken');
      axios.get(`http://localhost:8080/api/agenda/servicios_ips?cupsServicioMedico=${servicio}&idIPS=${ips}&qSize=10&qPage=0`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        const horariosDisponibles = res.data.resultados
          .map(item => ({
            label: `${item.hora} - ${item.nombreMedico}`,
            value: `${item.fecha} ${item.hora}`,
            dniMedico: item.dniMedico,
            idConsultorio: item.idConsultorio
          }));

        // ⚠️ VALIDACIÓN DE LISTA VACÍA
        if (!horariosDisponibles || horariosDisponibles.length === 0) {
          alert('No hay horarios disponibles para la fecha seleccionada. Intente con otra.');
          setHorarios([]);
          return;
        }

        setHorarios(horariosDisponibles);
      })
      .catch(err => {
        console.error('Error cargando horarios:', err);
        setHorarios([]);
      });
    } else {
      setHorarios([]);
      setHorario('');
    }
  }, [servicio, ips, fecha]);


  const handleAgendar = () => {
    if (servicio && ips && fecha && horario) {
      const token = localStorage.getItem('authToken');

      const hora = horario.split(' ')[1]; // Toma solo la hora
      const slotSeleccionado = horarios.find(h => h.value === horario);

      const payload = {
        dniMedico: slotSeleccionado?.dniMedico,
        idConsultorio: slotSeleccionado?.idConsultorio,
        fecha: fecha.format('YYYY-MM-DD'),
        hora: hora,
        cupsServicios: [servicio]
      };

      console.log("Payload que se enviará:", payload);

      axios.post(
        'http://localhost:8080/api/agenda/citas',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(() => setOpenSnackbar(true))
      .catch(err => console.error('Error al agendar cita:', err));
    }
  };

  const menuProps = {
    PaperProps: {
      sx: { bgcolor: 'white', color: 'black' },
    },
  };

  return (
    <Box sx={{ bgcolor: '#fefaf4', minHeight: '100vh', py: 8 }}>
      <GlobalStyles styles={{
        '.MuiCalendarOrClockPicker-root, .MuiCalendarPicker-root, .MuiPaper-root': {
          backgroundColor: 'white !important',
        }
      }} />
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#fff' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Solicitar Cita Médica
          </Typography>

          {/* Servicio Médico */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Servicio médico</InputLabel>
            <Select
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              label="Servicio médico"
              MenuProps={menuProps}
            >
              {servicios.map(s => (
                <MenuItem key={s.cupsServicioMedico} value={s.cupsServicioMedico}>
                  {s.nombreServicioMedico}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* IPS */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Seleccione IPS</InputLabel>
            <Select
              value={ips}
              onChange={(e) => setIps(e.target.value)}
              label="Seleccione IPS"
              MenuProps={menuProps}
            >
              {ipsDisponibles.map(i => (
                <MenuItem key={i.id} value={i.id}>{i.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Fecha */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Seleccione la fecha"
              value={fecha}
              onChange={(newValue) => setFecha(newValue)}
              format="DD-MM-YYYY"
              minDate={dayjs()}
              sx={{ mt: 2, width: '100%' }}
            />
          </LocalizationProvider>

          {/* Horario */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Hora y especialista</InputLabel>
            <Select
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              label="Hora y especialista"
              MenuProps={menuProps}
            >
              {horarios.map((h, index) => (
                <MenuItem key={index} value={h.value}>{h.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Botón Agendar */}
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

      {/* Snackbar */}
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
