import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Box, Typography, Container, FormControl, InputLabel, Select, MenuItem,
  Button, Paper, Snackbar, Alert, TextField
} from '@mui/material';

import { GlobalStyles } from '@mui/styled-engine';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AgendarCitaAdmin = () => {
  const [documentoPaciente, setDocumentoPaciente] = useState('');
  const [servicio, setServicio] = useState('');
  const [ips, setIps] = useState('');
  const [fecha, setFecha] = useState(null);
  const [horario, setHorario] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [pacienteValido, setPacienteValido] = useState(false);

  const [servicios, setServicios] = useState([]);
  const [ipsDisponibles, setIpsDisponibles] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [mensajeHorariosVacio, setMensajeHorariosVacio] = useState('');

  // Cargar servicios al iniciar
  useEffect(() => {
    axios.get('http://localhost:8080/api/servicioMedico?qSize=20&qPage=0')
      .then(res => setServicios(res.data.servicios))
      .catch(err => console.error('Error cargando servicios:', err));
  }, []);

  // Cargar IPS al cambiar servicio
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

  // Cargar horarios al cambiar servicio + IPS + fecha
  useEffect(() => {
  if (servicio && ips && fecha) {
    const token = localStorage.getItem('authToken');
    const fechaFormateada = fecha.format('YYYY-MM-DD');

    axios.get(`http://localhost:8080/api/agenda/servicios_ips?cupsServicioMedico=${servicio}&idIPS=${ips}&fecha=${fechaFormateada}&qSize=10&qPage=0`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const horarios = res.data.resultados.map(item => ({
          label: `${item.hora} – ${item.nombreMedico}`,
          value: `${item.fecha} ${item.hora}`,
          dniMedico: item.dniMedico,
          idConsultorio: item.idConsultorio
        }));

        setHorariosDisponibles(horarios);

        //Si no hay horarios, muestro mensaje
        if (horarios.length === 0) {
          setMensajeHorariosVacio('No hay horarios disponibles para la fecha seleccionada.');
        } else {
          setMensajeHorariosVacio('');
        }
      })
      .catch(err => {
        console.error('Error cargando horarios:', err);
        setHorariosDisponibles([]);
        setMensajeHorariosVacio('Ocurrió un error al consultar los horarios.');
      });
  } else {
    setHorariosDisponibles([]);
    setHorario('');
    setMensajeHorariosVacio('');
  }
}, [servicio, ips, fecha]);

  const validarDocumento = () => {
  const dni = documentoPaciente.trim();
  if (!dni) return;

  const token = localStorage.getItem('authToken');
  axios.get(`http://localhost:8080/api/users/pacientes/${dni}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(() => {
      setPacienteValido(true);
    })
    .catch(() => {
      setPacienteValido(false);
      alert('El paciente no existe. Verifica el número de documento.');
    });
};


  const menuProps = {
    PaperProps: {
      sx: {
        bgcolor: 'white',
        color: 'black',
      },
    },
  };

  const handleAgendar = () => {
    if (documentoPaciente && servicio && ips && fecha && horario) {
      const token = localStorage.getItem('authToken');

      const hora = horario.split(' ')[1];
      const slotSeleccionado = horariosDisponibles.find(h => h.value === horario);

      const payload = {
        dniPaciente: documentoPaciente.trim(),
        dniMedico: slotSeleccionado?.dniMedico,
        idConsultorio: slotSeleccionado?.idConsultorio,
        fecha: fecha.format('YYYY-MM-DD'),
        hora: hora,
        cupsServicios: [servicio]
      };

      axios.post('http://localhost:8080/api/agenda/citas', payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => setOpenSnackbar(true))
        .catch(err => {
          if (err.response?.status === 404) {
            alert('El paciente no existe. Verifica el número de documento.');
          } else {
            console.error('Error al agendar cita:', err);
            alert('Ocurrió un error al agendar. Verifica los datos.');
          }
        });
    }
  };

  return (
    <Box sx={{ bgcolor: '#fefaf4', minHeight: '100vh', pt: 2, pb: 4 }}>
      <GlobalStyles styles={{
        '.MuiCalendarOrClockPicker-root, .MuiCalendarPicker-root, .MuiPaper-root': {
          backgroundColor: 'white !important',
        }
      }} />

      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#fff' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Solicitar Cita Médica - Admin
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Ingrese No. de documento del paciente"
            value={documentoPaciente}
            onChange={(e) => setDocumentoPaciente(e.target.value)}
            onBlur={validarDocumento}
            type="text"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Servicio médico</InputLabel>
              <Select
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                label="Servicio médico"
                MenuProps={menuProps}
                disabled={!pacienteValido}
              >
              {servicios.map((s) => (
                <MenuItem key={s.cupsServicioMedico} value={s.cupsServicioMedico}>
                  {s.nombreServicioMedico}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Servicio IPS</InputLabel>
            <Select
              value={ips}
              onChange={(e) => setIps(e.target.value)}
              label="Servicio IPS"
              MenuProps={menuProps}
            >
              {ipsDisponibles.map((i) => (
                <MenuItem key={i.id} value={i.id}>
                  {i.nombre}
                </MenuItem>
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
              minDate={dayjs()}
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
              {horariosDisponibles.map((h, index) => (
                <MenuItem key={index} value={h.value}>
                  {h.label}
                </MenuItem>
              ))}
            </Select>
            {mensajeHorariosVacio && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {mensajeHorariosVacio}
              </Typography>
            )}
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

export default AgendarCitaAdmin;
