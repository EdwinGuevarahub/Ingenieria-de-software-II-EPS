import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Container, TextField, Paper,
  FormControl, InputLabel, Select, MenuItem,
  Button, Snackbar, Alert
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { GlobalStyles } from '@mui/styled-engine';

const SolicitarExamenMedico = () => {
  // ──────────────────────────
  // ESTADOS
  // ──────────────────────────
  const [ordenMedica, setOrdenMedica] = useState('');
  const [ordenValida, setOrdenValida] = useState(false);

  // Esta lista la llenaremos con los CUPS que nos arroja
  // GET /api/agenda/orden/servicios?idOrden=...
  const [servicios, setServicios] = useState([]); 

  // Cuando el usuario elija un servicio (CUPS), aquí guardo “cupsSeleccionado”
  const [cupsSeleccionado, setCupsSeleccionado] = useState('');

  // Lista dinámica de IPS para ese cupsSeleccionado
  const [ipsDisponibles, setIpsDisponibles] = useState([]);
  const [ipsSeleccionada, setIpsSeleccionada] = useState('');

  // Fecha para el examen
  const [fecha, setFecha] = useState(null);

  // Lista dinámica de horarios+especialista para (cupsSeleccionado, ipsSeleccionada, fecha)
  // Cada elem: { label: '08:00 – Dr. Pérez', value: { hora: '08:00', dniMedico: 100123..., idConsultorio: 55 } }
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  // ──────────────────────────
  // FUNCIÓN: validarOrden → paso 1
  // ──────────────────────────
  const validarOrden = () => {
    if (ordenMedica.trim() === '') {
      alert('Ingrese número de orden médica');
      return;
    }

    const token = localStorage.getItem('authToken');
    axios
      .get(
        `http://localhost:8080/api/agenda/orden/servicios?idOrden=${ordenMedica}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(res => {
        const lista = res.data; // ej. [{ cups: "903810", nombre: "Hemograma completo" }, ...]
        if (!lista || lista.length === 0) {
          alert('No se encontraron servicios válidos para esta orden.');
          return;
        }
        setServicios(lista); // ← Guardamos objetos { cups, nombre }
        setOrdenValida(true);
      })

      .catch(err => {
        console.error('Error al validar la orden médica:', err);
        alert('La orden médica es inválida o no corresponde a este paciente.');
      });
  };

  // ──────────────────────────
  // useEffect → cargar IPS cuando cupsSeleccionado cambie
  // ──────────────────────────
  useEffect(() => {
    if (!cupsSeleccionado) {
      setIpsDisponibles([]);
      setIpsSeleccionada('');
      return;
    }

    const token = localStorage.getItem('authToken');
    axios
      .get(
        `http://localhost:8080/api/ips?cupsServicioMedico=${cupsSeleccionado}&qSize=20&qPage=0`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(res => {
        // Supongamos que la respuesta es { ips: [ { id: 55, nombre: 'FAMISANAR' }, {...} ] }
        setIpsDisponibles(res.data.ips);
      })
      .catch(err => {
        console.error('Error cargando IPS para el servicio:', err);
        setIpsDisponibles([]);
      });
  }, [cupsSeleccionado]);

  // ──────────────────────────
  // useEffect → cargar Horarios cuando cupsSeleccionado, ipsSeleccionada y fecha cambien
  // ──────────────────────────
  useEffect(() => {
    // Solo si tengo servicio (CUPS), IPS y fecha, pido horarios
    if (cupsSeleccionado && ipsSeleccionada && fecha) {
      const token = localStorage.getItem('authToken');
      const fechaFormateada = fecha.format('YYYY-MM-DD');

      axios
        .get(
          `http://localhost:8080/api/agenda/servicios_ips?cupsServicioMedico=${cupsSeleccionado}&idIPS=${ipsSeleccionada}&fecha=${fechaFormateada}&qSize=20&qPage=0`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(res => {
          if (!res.data.resultados || res.data.resultados.length === 0) {
            alert('No hay horarios disponibles para la fecha seleccionada. Intente con otra fecha.');
            setHorariosDisponibles([]);
            return;
          }

          const slots = res.data.resultados.map(item => ({
            label: `${item.hora} – ${item.nombreMedico}`,
            value: {
              hora: item.hora,
              dniMedico: item.dniMedico,
              idConsultorio: item.idConsultorio
            },
          }));
          setHorariosDisponibles(slots);
        })

        .catch(err => {
          console.error('Error cargando horarios:', err);
          setHorariosDisponibles([]);
        });
    } else {
      setHorariosDisponibles([]);
      setSlotSeleccionado(null);
    }
  }, [cupsSeleccionado, ipsSeleccionada, fecha]);

  // ──────────────────────────
  // handleAgendar → paso 4: armar payload y POST /api/agenda/examenes
  // ──────────────────────────
  const handleAgendar = () => {
    if (
      !cupsSeleccionado ||
      !ipsSeleccionada ||
      !fecha ||
      !slotSeleccionado
    ) {
      alert('Complete todos los campos antes de agendar.');
      return;
    }

    const token = localStorage.getItem('authToken');
    const payload = {
      agendaOrden: parseInt(ordenMedica, 10),
      cupsServicio: cupsSeleccionado,
      // dniPaciente no lo envías; el backend lo obtiene del token
      dniMedico: slotSeleccionado.dniMedico,
      idConsultorio: slotSeleccionado.idConsultorio,
      fecha: fecha.format('YYYY-MM-DD'),
      hora: slotSeleccionado.hora, // p.ej. "08:00"
    };

    axios
      .post('http://localhost:8080/api/agenda/examenes', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setOpenSnackbar(true);
      })
      .catch(err => {
        console.error('Error al agendar examen:', err);
        alert('Ocurrió un error al agendar el examen. Revise los datos.');
      });
  };

  // ──────────────────────────
  // RENDER: JSX
  // ──────────────────────────
  return (
    <Box sx={{ bgcolor: '#fefaf4', minHeight: '100vh', pt: 2, pb: 4 }}>
      <GlobalStyles
        styles={{
          '.MuiCalendarOrClockPicker-root, .MuiCalendarPicker-root, .MuiPaper-root': {
            backgroundColor: 'white !important',
          },
        }}
      />

      <Container maxWidth="sm">
        <Typography variant="h5" align="center" gutterBottom>
          Solicitar Examen Médico
        </Typography>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#fff' }}>
          {/* ‣ PASO 1: Ingreso y validación de la orden médica */}
          {!ordenValida && (
            <>
              <TextField
                fullWidth
                label="Ingresa No. Orden Médica"
                value={ordenMedica}
                onChange={e => setOrdenMedica(e.target.value)}
                margin="normal"
              />
              <Button variant="contained" fullWidth onClick={validarOrden}>
                Validar Orden Médica
              </Button>
            </>
          )}

          {/* ‣ PASO 2: Después de validar, muestro el formulario completo */}
          {ordenValida && (
            <>
              {/* ▸ Seleccionar servicio (CUPS) */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Servicio médico</InputLabel>
                <Select
                  value={cupsSeleccionado}
                  onChange={e => {
                    setCupsSeleccionado(e.target.value);
                    // Al cambiar de CUPS, reseteo selecciones posteriores:
                    setIpsSeleccionada('');
                    setFecha(null);
                    setSlotSeleccionado(null);
                  }}
                  label="Servicio médico"
                >
                  {servicios.map(serv => (
                    <MenuItem key={serv.cups} value={serv.cups}>
                      {serv.nombre}
                    </MenuItem>
                  ))}

                </Select>
              </FormControl>

              {/* ▸ Seleccionar IPS (dinámico) */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Seleccione IPS</InputLabel>
                <Select
                  value={ipsSeleccionada}
                  onChange={e => {
                    setIpsSeleccionada(e.target.value);
                    // Al cambiar IPS, reseteo fecha y horario:
                    setFecha(null);
                    setSlotSeleccionado(null);
                  }}
                  label="Seleccione IPS"
                >
                  {ipsDisponibles.map((ipsObj) => (
                    <MenuItem key={ipsObj.id} value={ipsObj.id}>
                      {ipsObj.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* ▸ Seleccionar la Fecha (DayJS) */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Seleccione la fecha"
                  value={fecha}
                  onChange={(newVal) => {
                    setFecha(newVal);
                    // al cambiar de fecha, reseteo el slot:
                    setSlotSeleccionado(null);
                  }}
                  format="DD-MM-YYYY"
                  minDate={dayjs()}
                  sx={{ mt: 2, width: '100%' }}
                />
              </LocalizationProvider>

              {/* ▸ Seleccionar Hora y especialista (dinámico) */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Hora y especialista</InputLabel>
                <Select
                  value={slotSeleccionado ? slotSeleccionado.hora + '_' + slotSeleccionado.dniMedico : ''}
                  onChange={e => {
                    // guardo el objeto completo: { hora, dniMedico, idConsultorio }
                    const [hora, dni] = e.target.value.split('_');
                    // Busco en horariosDisponibles el objeto que coincida
                    const encontrado = horariosDisponibles.find(
                      s => s.value.hora === hora && String(s.value.dniMedico) === dni
                    );
                    setSlotSeleccionado(encontrado.value);
                  }}
                  label="Hora y especialista"
                >
                  {horariosDisponibles.map((hObj, idx) => (
                    <MenuItem
                      key={idx}
                      value={`${hObj.value.hora}_${hObj.value.dniMedico}`}
                    >
                      {hObj.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* ▸ Botón AGENDAR */}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleAgendar}
              >
                Agendar
              </Button>
            </>
          )}
        </Paper>

        {/* Snackbar de éxito */}
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
            Examen Agendado Correctamente
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default SolicitarExamenMedico;
