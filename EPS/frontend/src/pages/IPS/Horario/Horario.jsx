import React, { useState, useMemo } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, MenuItem, Select, InputLabel, FormControl, Paper, IconButton,
  Tooltip, Checkbox
} from '@mui/material';
import { AddCircleOutline, Edit, Delete, Close, Save, CleaningServices } from '@mui/icons-material';

// ... (Constantes como diasSemana, horasDia, servicios, etc. permanecen igual)
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const horasDia = Array.from({ length: 17 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`);

const servicios = ['Medicina General', 'Pediatría', 'Dermatología', 'Cardiología', 'Ginecología'];
const consultorios = {
  'Medicina General': ['Consultorio 101', 'Consultorio 102'],
  'Pediatría': ['Consultorio 201', 'Consultorio 202'],
  'Dermatología': ['Consultorio 301'],
  'Cardiología': ['Consultorio 401', 'Consultorio 402'],
  'Ginecología': ['Consultorio 501'],
};

const mapDiaCortoACompleto = { L: 'Lunes', M: 'Martes', R: 'Miércoles', J: 'Jueves', V: 'Viernes', S: 'Sábado', D: 'Domingo' };
const mapDiaCompletoACorto = Object.fromEntries(Object.entries(mapDiaCortoACompleto).map(([k, v]) => [v, k]));

const coloresBase = ['#ffccbc', '#dcedc8', '#b2dfdb', '#bbdefb', '#f8bbd0', '#e1bee7', '#c5cae9', '#fff9c4', '#ffecb3'];

function HorarioFormDialog({ open, onClose, onSave, initialData }) {
  const [formHorario, setFormHorario] = useState({
    dia: '', horaInicio: '', horaFin: '', servicio: '', consultorio: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setFormHorario(initialData);
      setIsEditing(true);
    } else {
      setFormHorario({ dia: '', horaInicio: '', horaFin: '', servicio: '', consultorio: '' });
      setIsEditing(false);
    }
  }, [initialData, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormHorario(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'servicio' && { consultorio: '' }),
    }));
  };

  const handleSave = () => {
    if (!formHorario.dia || !formHorario.horaInicio || !formHorario.horaFin || !formHorario.servicio || !formHorario.consultorio) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    if (formHorario.horaInicio >= formHorario.horaFin) {
      alert('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }
    onSave(formHorario, isEditing);
    onClose();
  };

  const handleClear = () => {
    setFormHorario({ dia: '', horaInicio: '', horaFin: '', servicio: '', consultorio: '' });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        {isEditing ? 'Editar Horario' : 'Nuevo Horario'}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 2 }}>

          {/* Días de la semana */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Días de atención
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {diasSemana.map((dia) => (
                <Box key={dia} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="caption">{dia}</Typography>
                  <Checkbox
                    checked={formHorario.dias?.includes(dia) || false}
                    onChange={(e) => {
                      const newDias = formHorario.dias || [];
                      const updatedDias = e.target.checked
                        ? [...newDias, dia]
                        : newDias.filter((d) => d !== dia);
                      handleChange({ target: { name: 'dias', value: updatedDias } });
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="horaInicio"
              label="Hora de inicio"
              type="time"
              fullWidth
              value={formHorario.horaInicio}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 1800 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="horaFin"
              label="Hora de fin"
              type="time"
              fullWidth
              value={formHorario.horaFin}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 1800 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="servicio-label">Servicio Médico</InputLabel>
              <Select
                labelId="servicio-label"
                name="servicio"
                value={formHorario.servicio}
                label="Servicio Médico"
                onChange={handleChange}
              >
                {servicios.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formHorario.servicio && consultorios[formHorario.servicio] && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="consultorio-label">Consultorio</InputLabel>
                <Select
                  labelId="consultorio-label"
                  name="consultorio"
                  value={formHorario.consultorio}
                  label="Consultorio"
                  onChange={handleChange}
                >
                  {consultorios[formHorario.servicio].map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClear} color="warning" startIcon={<CleaningServices />}>Limpiar</Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary" startIcon={<Save />}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}


export default function HorarioModal({ open, onClose }) {
  const [horariosGuardados, setHorariosGuardados] = useState([
    { id: 'h1', dia: 'Lunes', horaInicio: '08:00', horaFin: '17:00', servicio: 'Medicina General', consultorio: 'Consultorio 101', color: coloresBase[0] },
    { id: 'h2', dia: 'Martes', horaInicio: '09:00', horaFin: '13:00', servicio: 'Pediatría', consultorio: 'Consultorio 201', color: coloresBase[1] },
    { id: 'h3', dia: 'Martes', horaInicio: '14:00', horaFin: '18:00', servicio: 'Pediatría', consultorio: 'Consultorio 201', color: coloresBase[1] },
  ]);

  const [editingHorario, setEditingHorario] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleOpenFormForNew = () => {
    setEditingHorario(null);
    setFormOpen(true);
  };

  const handleOpenFormForEdit = (horario) => {
    setEditingHorario(horario);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingHorario(null);
  };

  const handleSaveHorario = (formData, isEditing) => {
    if (isEditing && editingHorario) {
      setHorariosGuardados(prev => prev.map(h =>
        h.id === editingHorario.id ? { ...h, ...formData } : h
      ));
    } else {
      const colorIndex = horariosGuardados.length % coloresBase.length;
      setHorariosGuardados(prev => [
        ...prev,
        { ...formData, id: `h${Date.now()}`, color: coloresBase[colorIndex] }
      ]);
    }
    handleCloseForm();
  };

  const handleEliminarHorario = (idToDelete) => {
    if (window.confirm('¿Está seguro de que desea eliminar este horario?')) {
      setHorariosGuardados(prev => prev.filter(h => h.id !== idToDelete));
    }
  };

  const scheduleMatrix = useMemo(() => {
    const matrix = {};
    horariosGuardados.forEach(h => {
      const diaCorto = mapDiaCompletoACorto[h.dia];
      if (!diaCorto) return;

      const inicioNum = parseInt(h.horaInicio.split(':')[0]);
      const finNum = parseInt(h.horaFin.split(':')[0]);

      for (let hora = inicioNum; hora < finNum; hora++) {
        const horaKey = `${String(hora).padStart(2, '0')}:00`;
        if (!matrix[horaKey]) matrix[horaKey] = {};
        matrix[horaKey][diaCorto] = {
          color: h.color,
          tooltip: `${h.servicio} (${h.consultorio})\n${h.horaInicio} - ${h.horaFin}`
        };
      }
    });
    return matrix;
  }, [horariosGuardados]);

  const obtenerDatosCelda = (diaCompleto, horaCompleta) => {
    const diaCorto = mapDiaCompletoACorto[diaCompleto];
    return scheduleMatrix[horaCompleta]?.[diaCorto];
  };

  const handleCeldaClick = (dia, hora) => {
    const horarioExistente = horariosGuardados.find(h => {
      const diaCortoH = mapDiaCompletoACorto[h.dia];
      const diaCortoCelda = mapDiaCompletoACorto[dia];
      const horaInicioNum = parseInt(h.horaInicio.split(':')[0]);
      const horaFinNum = parseInt(h.horaFin.split(':')[0]);
      const horaCeldaNum = parseInt(hora.split(':')[0]);
      return diaCortoH === diaCortoCelda && horaCeldaNum >= horaInicioNum && horaCeldaNum < horaFinNum;
    });

    if (horarioExistente) {
      handleOpenFormForEdit(horarioExistente);
    } else {
      setEditingHorario({ dia, horaInicio: hora, horaFin: '', servicio: '', consultorio: '' });
      setFormOpen(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle sx={{ textAlign: 'center', bgcolor: 'primary.dark', color: 'primary.contrastText', pb: 2 }}>
        Gestión de Horarios del Médico
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          bgcolor: 'background.default',
          overflow: 'hidden',
        }}
      >
        {/* Panel Lateral (Izquierdo) */}
        <Box
          sx={{
            width: { xs: '100%', md: 320 },
            p: 2,
            borderRight: { md: '1px solid' },
            borderColor: { md: 'divider' },
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
            maxHeight: { xs: '300px', md: 'calc(100vh - 128px)' }
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutline />}
            onClick={handleOpenFormForNew}
            fullWidth
          >
            Nuevo Horario
          </Button>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'text.primary' }}>
            Horarios Guardados
          </Typography>
          {horariosGuardados.length > 0 ? (
            <Box>
              {horariosGuardados.map((h) => (
                <Paper
                  key={h.id}
                  elevation={2}
                  sx={{
                    p: 1.5,
                    mb: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: `4px solid ${h.color || coloresBase[0]}`,
                    bgcolor: '#ffffff',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {h.dia}: {h.horaInicio} - {h.horaFin}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {h.servicio} - {h.consultorio}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleOpenFormForEdit(h)} color="color_primary">
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" onClick={() => handleEliminarHorario(h.id)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
              No hay horarios guardados.
            </Typography>
          )}
        </Box>

        {/* Contenido Principal (Calendario) */}
        <Box sx={{
          flexGrow: 1,
          p: 2
        }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              maxHeight: 'calc(100vh - 128px)'
            }}
          >
            <Table
              size="small"
              stickyHeader
              sx={{
                borderCollapse: 'collapse',
                minWidth: 800
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      border: '1px solid #ddd',
                      width: '80px',
                      backgroundColor: (theme) => theme.palette.background.paper,
                      zIndex: 1
                    }}
                  >
                    Hora
                  </TableCell>
                  {diasSemana.map((dia) => (
                    <TableCell
                      key={dia}
                      sx={{
                        fontWeight: 'bold',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        backgroundColor: (theme) => theme.palette.background.paper,
                        zIndex: 1
                      }}
                    >
                      {dia}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {horasDia.map((hora) => (
                  <TableRow key={hora} hover>
                    <TableCell sx={{
                      border: '1px solid #ddd',
                      fontWeight: 'medium',
                      color: 'text.secondary',
                    }}
                    >
                      {hora}
                    </TableCell>
                    {diasSemana.map((dia) => {
                      const cellData = obtenerDatosCelda(dia, hora);
                      return (
                        <Tooltip title={cellData?.tooltip || `Añadir horario para ${dia} a las ${hora}`} placement="top" key={`${dia}-${hora}`}>
                          <TableCell
                            onClick={() => handleCeldaClick(dia, hora)}
                            sx={{
                              cursor: 'pointer',
                              bgcolor: cellData?.color || '#f9f9f9',
                              border: '1px solid #ddd',
                              height: 40,
                              transition: 'background-color 0.2s ease',
                              '&:hover': {
                                bgcolor: cellData?.color ? `${cellData.color}E6` : '#e0e0e0',
                                boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
                              },
                            }}
                          />
                        </Tooltip>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
        <Button onClick={onClose} variant="red" startIcon={<Close />}>
          Cerrar Ventana
        </Button>
      </DialogActions>

      <HorarioFormDialog
        open={formOpen}
        onClose={handleCloseForm}
        onSave={handleSaveHorario}
        initialData={editingHorario}
      />
    </Dialog>
  );
}