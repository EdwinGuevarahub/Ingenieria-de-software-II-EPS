import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogContent, DialogTitle, Grid, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Modal, TextField, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';

const diasSemana = ['L', 'M', 'R', 'J', 'V', 'S'];
const horasDia = Array.from({ length: 12 }, (_, i) => `${i + 7}:00`);

const servicios = ['Medicina General', 'Pediatría', 'Dermatología'];
const consultorios = {
  'Medicina General': ['101', '102'],
  'Pediatría': ['201', '202'],
  'Dermatología': ['301'],
};

export default function HorarioModal({ open, onClose }) {
  const [horariosGuardados, setHorariosGuardados] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(null); // { dia: 'L', hora: '08:00' }
  const [formHorario, setFormHorario] = useState({ dia: '', horaInicio: '', horaFin: '', servicio: '', consultorio: '' });

  const handleCeldaClick = (dia, hora) => {
    setFormHorario({ dia, horaInicio: hora, horaFin: '', servicio: '', consultorio: '' });
    setModoEdicion({ dia, hora });
  };

  const handleSeleccionarHorario = () => {
    const lista = [
      'L08-17,M08-17,R08-17',
      'J08-12,V09-13,S08-10',
    ];
    setHorariosGuardados(lista);
  };

  const handleGuardarHorario = () => {
    const nuevo = `${formHorario.dia}${formHorario.horaInicio.split(':')[0]}-${formHorario.horaFin.split(':')[0]}`;
    setHorariosGuardados([...horariosGuardados, nuevo]);
    setModoEdicion(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Horario del Médico</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Columna izquierda con botones */}
          <Grid item xs={3}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button variant="contained" onClick={() => setModoEdicion({})}>Nuevo Horario</Button>
              <Button variant="outlined" onClick={handleSeleccionarHorario}>Seleccionar Horario</Button>
              <Button variant="text" color="error" onClick={onClose}>Cerrar</Button>
              {horariosGuardados.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2">Horarios guardados:</Typography>
                  {horariosGuardados.map((h, idx) => (
                    <Typography key={idx} sx={{ fontSize: 12 }}>{h}</Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Tabla de horario */}
          <Grid item xs={9}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hora</TableCell>
                  {diasSemana.map((dia) => (
                    <TableCell key={dia}>{dia}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {horasDia.map((hora) => (
                  <TableRow key={hora}>
                    <TableCell>{hora}</TableCell>
                    {diasSemana.map((dia) => (
                      <TableCell
                        key={`${dia}-${hora}`}
                        onClick={() => handleCeldaClick(dia, hora)}
                        sx={{ cursor: 'pointer', bgcolor: '#f5f5f5' }}
                      />
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Modal para editar horario */}
      <Modal open={!!modoEdicion} onClose={() => setModoEdicion(null)}>
        <Box
          sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>Editar Horario</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Día</InputLabel>
            <Select
              value={formHorario.dia}
              label="Día"
              onChange={(e) => setFormHorario({ ...formHorario, dia: e.target.value })}
            >
              {diasSemana.map(d => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Hora Inicio"
            type="time"
            fullWidth
            sx={{ mb: 2 }}
            value={formHorario.horaInicio}
            onChange={(e) => setFormHorario({ ...formHorario, horaInicio: e.target.value })}
          />
          <TextField
            label="Hora Fin"
            type="time"
            fullWidth
            sx={{ mb: 2 }}
            value={formHorario.horaFin}
            onChange={(e) => setFormHorario({ ...formHorario, horaFin: e.target.value })}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Servicio Médico</InputLabel>
            <Select
              value={formHorario.servicio}
              label="Servicio Médico"
              onChange={(e) => setFormHorario({ ...formHorario, servicio: e.target.value, consultorio: '' })}
            >
              {servicios.map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {formHorario.servicio && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Consultorio</InputLabel>
              <Select
                value={formHorario.consultorio}
                label="Consultorio"
                onChange={(e) => setFormHorario({ ...formHorario, consultorio: e.target.value })}
              >
                {consultorios[formHorario.servicio].map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button fullWidth variant="contained" onClick={handleGuardarHorario}>
            Guardar
          </Button>
        </Box>
      </Modal>
    </Dialog>
  );
}
