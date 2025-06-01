import { useEffect, useState, useRef } from 'react';
import {
  Box, TextField, Typography, Chip, Button, Modal, Fade,
  Backdrop, InputAdornment, IconButton, Grid,
  Dialog, DialogActions, DialogContent, DialogTitle, Checkbox,
  MenuItem, Select, InputLabel, FormControl, Alert
} from '@mui/material';
import {
  Save, Delete as DeleteIcon, Add as AddIcon,
  CleaningServices as ClearIcon, Close as CloseIcon
} from '@mui/icons-material';
import {
  listaServiciosMedicosPorMedico,
  listaServiciosMedicos,
  agregarServiciosMedicosPorMedico,
  eliminarServiciosMedicosPorMedico,
} from '@/../../src/services/serviciosMedicosService';
import { listarConsultorios } from '@/../../src/services/consultorioService';
import Horario from '@/../../src/pages/IPS/Horario/Horario';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Constantes para los días de la semana
const DIAS_SEMANA_CONFIG = [
  { display: 'Lunes', backendValue: 'MONDAY' },
  { display: 'Martes', backendValue: 'TUESDAY' },
  { display: 'Miércoles', backendValue: 'WEDNESDAY' },
  { display: 'Jueves', backendValue: 'THURSDAY' },
  { display: 'Viernes', backendValue: 'FRIDAY' },
  { display: 'Sábado', backendValue: 'SATURDAY' },
  { display: 'Domingo', backendValue: 'SUNDAY' }
];

// Opciones para los select de servicios y consultorios
let _formServiciosOpts = [];
let _formConsultoriosOpts = [];

const getServiceIdByNameFromForm = (name) => {
  const servicio = _formServiciosOpts.find(s => s.label === name);
  return servicio ? servicio.value : null;
};

const getConsultorioDetailsByNameFromForm = (name, consultoriosList) => {
  const consultorio = consultoriosList.find(c => c.label === name);
  return consultorio ? { id: consultorio.value, idIps: consultorio.idIps } : null;
}

const MedicoFormulario = ({
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [tempFormData, setTempFormData] = useState(null);
  const [serviciosMedicos, setServiciosMedicos] = useState([]);
  const [todosServicios, setTodosServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const fileInputRef = useRef();

  // Estados para el modal de horario inicial
  const [initialSchedule, setInitialSchedule] = useState({
    dias: [],
    horaInicio: '09:00',
    horaFin: '17:00',
    servicio: '',
    consultorio: '',
  });
  const [formServiciosOpts, setFormServiciosOpts] = useState([]);
  const [formConsultoriosOpts, setFormConsultoriosOpts] = useState([]);
  const [isLoadingFormOpts, setIsLoadingFormOpts] = useState(false);
  const [formError, setFormError] = useState(null);

  // Para mostrar y oculatar el contenido de la contraseña.
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // Para  el manejo de los modals
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalHorarioAbierto, setModalHorarioAbierto] = useState(false);
  const [isInitialScheduleModalOpen, setIsInitialScheduleModalOpen] = useState(false);

  // Cargar servicios médicos del médico al iniciar
  useEffect(() => {
    const fetchServiciosDelMedico = async () => {
      if (initialData?.dni) {
        try {
          const servicios = await listaServiciosMedicosPorMedico(initialData.dni);
          setServiciosMedicos(servicios);
        } catch (error) {
          console.error('Error cargando servicios del médico:', error);
        }
      }
    };
    fetchServiciosDelMedico();
  }, [initialData?.dni]);

  // Cargar todos los servicios médicos disponibles
  useEffect(() => {
    const fetchTodosServicios = async () => {
      try {
        const { servicio } = await listaServiciosMedicos(); // TODO: Cambiar a listaServicosMedicosPorIPS
        const opciones = servicio.map((s) => ({
          label: s.nombre,
          value: s.cups,
        }));
        setTodosServicios(opciones);
      } catch (error) {
        console.error('Error cargando todos los servicios médicos:', error);
      }
    };
    fetchTodosServicios();
  }, []);

  // useEffect para cargar servicios y consultorios para el modal de horario inicial
  useEffect(() => {
    if (isInitialScheduleModalOpen) {
      const fetchOptions = async () => {
        setIsLoadingFormOpts(true);
        setFormError(null);
        try {
          const serviciosResponse = await listaServiciosMedicos(); // TODO: Cambiar a listaServicosMedicosPorIPS
          const mappedServicios = serviciosResponse.servicio.map(s => ({ label: s.nombre, value: s.cups }));
          setFormServiciosOpts(mappedServicios);
          _formServiciosOpts = mappedServicios;

          const consultoriosResponse = await listarConsultorios();
          const mappedConsultorios = consultoriosResponse.consultorios.map(c => ({
            label: `Consultorio ${c.idConsultorio}`,
            value: c.idConsultorio,
            cupsServicio: c.cupsServicioMedico,
            idIps: c.idIps,
          }));
          setFormConsultoriosOpts(mappedConsultorios);
          _formConsultoriosOpts = mappedConsultorios;

          if (mappedServicios.length > 0 && !initialSchedule.servicio) {
            setInitialSchedule(prev => ({ ...prev, servicio: mappedServicios[0].label }));
          }

        } catch (e) {
          console.error("Error cargando opciones para horario inicial:", e);
          setFormError("Error cargando opciones para el horario.");
        } finally {
          setIsLoadingFormOpts(false);
        }
      };
      fetchOptions();
    }
  }, [isInitialScheduleModalOpen]);

  // Autoseleccionar consultorio cuando cambia el servicio en el modal de horario inicial
  useEffect(() => {
    if (isInitialScheduleModalOpen && initialSchedule.servicio && formConsultoriosOpts.length > 0) {
      const selectedServiceCups = getServiceIdByNameFromForm(initialSchedule.servicio);
      const availableConsultorios = formConsultoriosOpts.filter(c => c.cupsServicio === selectedServiceCups);
      if (availableConsultorios.length > 0) {
        if (!initialSchedule.consultorio || !availableConsultorios.find(c => c.label === initialSchedule.consultorio)) {
          setInitialSchedule(prev => ({ ...prev, consultorio: availableConsultorios[0].label }));
        }
      } else {
        setInitialSchedule(prev => ({ ...prev, consultorio: '' }));
      }
    }
  }, [initialSchedule.servicio, formConsultoriosOpts, isInitialScheduleModalOpen]);

  const handleChange = (key) => (e) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagen: reader.result.substring(reader.result.indexOf(',') + 1) });
      };
      reader.readAsDataURL(file); // convierte a base64
    }
  };

  const handleEliminarServicio = async (cups) => {
    try {
      if (formData.dni) {
        await eliminarServiciosMedicosPorMedico(formData.dni, cups);
      }
      setServiciosMedicos(serviciosMedicos.filter(s => s.cups !== cups));
    } catch (error) {
      console.error('Error eliminando servicio del médico:', error);
    }
  };

  const handleAgregarServicio = async () => {
    const nuevo = todosServicios.find(s => s.value === servicioSeleccionado);
    if (!nuevo || serviciosMedicos.some(s => s.cups === nuevo.value)) return;

    try {
      if (formData.dni) {
        await agregarServiciosMedicosPorMedico(formData.dni, nuevo.value);
      }
      setServiciosMedicos([
        ...serviciosMedicos,
        { cups: nuevo.value, nombre: nuevo.label },
      ]);
    } catch (error) {
      console.error('Error agregando servicio al médico:', error);
    }

    setModalAbierto(false);
    setServicioSeleccionado('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialData?.dni) { // Modo Edición
      if (onSubmit) {
        await onSubmit({ ...formData });
      }
    } else { // Modo Creación
      setTempFormData({ ...formData }); // Guardar datos básicos temporalmente
      setInitialSchedule({
        dias: [], horaInicio: '09:00', horaFin: '17:00',
        servicio: formServiciosOpts.length > 0 ? formServiciosOpts[0].label : '',
        consultorio: ''
      });
      setIsInitialScheduleModalOpen(true);
    }
  };

  const handleInitialScheduleChange = (event) => {
    const { name, value } = event.target;
    setInitialSchedule(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'servicio') {
        const servicioCups = getServiceIdByNameFromForm(value);
        const relatedConsultorios = formConsultoriosOpts.filter(c => c.cupsServicio === servicioCups);
        newState.consultorio = relatedConsultorios.length > 0 ? relatedConsultorios[0].label : '';
      }
      return newState;
    });
  };

  const handleInitialScheduleCheckboxChange = (dia, checked) => {
    setInitialSchedule(prev => {
      const newDias = prev.dias || [];
      const updatedDias = checked
        ? [...newDias, dia]
        : newDias.filter((d) => d !== dia);
      return { ...prev, dias: updatedDias };
    });
  };

  const handleSaveInitialSchedule = async () => {
    if (!initialSchedule.dias || initialSchedule.dias.length === 0 || !initialSchedule.horaInicio || !initialSchedule.horaFin || !initialSchedule.servicio || !initialSchedule.consultorio) {
      alert('Por favor, complete todos los campos del horario, incluyendo al menos un día.');
      return;
    }
    if (initialSchedule.horaInicio >= initialSchedule.horaFin) {
      alert('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    const consultorioDetails = getConsultorioDetailsByNameFromForm(initialSchedule.consultorio, formConsultoriosOpts);
    if (!consultorioDetails) {
      alert('Consultorio no válido seleccionado.');
      return;
    }

    const diasSeleccionadosParaBackend = initialSchedule.dias.map(displayDay => {
      const config = DIAS_SEMANA_CONFIG.find(d => d.display === displayDay);
      return config ? config.backendValue : null; // Debería siempre encontrarlo si la lógica es correcta
    }).filter(Boolean);

    const schedulePayload = {
      dias: diasSeleccionadosParaBackend, // Convertir a formato backend
      horaInicio: `${initialSchedule.horaInicio}:00`, // Formato HH:mm:ss
      horaFin: `${initialSchedule.horaFin}:00`,     // Formato HH:mm:ss
      idServicio: getServiceIdByNameFromForm(initialSchedule.servicio),
      idConsultorio: consultorioDetails.id,
      idIpsConsultorio: consultorioDetails.idIps
    };

    if (onSubmit && tempFormData) {
      // Combinar datos del médico con el payload del horario
      await onSubmit({ ...tempFormData, initialSchedule: schedulePayload });
    }
    setIsInitialScheduleModalOpen(false);
    setTempFormData(null); // Limpiar datos temporales
  };

  const consultoriosForSelectedServicioInForm = formConsultoriosOpts.filter(c =>
    c.cupsServicio === getServiceIdByNameFromForm(initialSchedule.servicio)
  );

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: 2,
          borderRadius: 2,
          gap: 2,
          flexWrap: 'wrap',
          width: '100%',
          backgroundColor: '#f9f9f9',
        }}
      >
        {/* Imagen cargada o placeholder */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={formData && formData.imagen ? `data:image/png;base64,${formData.imagen}` : null}
            alt="Foto"
            sx={{ width: 150, height: 125, borderRadius: 2, objectFit: 'cover' }}
          />
          <Button variant="outlined" size="small" onClick={() => fileInputRef.current.click()}>
            Cargar Imagen
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 250, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="DNI" value={formData.dni || ''} onChange={handleChange('dni')} />
          <TextField label="Nombre" value={formData.nombre || ''} onChange={handleChange('nombre')} />
          <TextField label="Correo" value={formData.email || ''} onChange={handleChange('email')} />
          <TextField label="Teléfono" value={formData.telefono || ''} onChange={handleChange('telefono')} />
          <TextField
            label='Password'
            type={showPassword ? "text" : "password"}
            value={formData.password || ''}
            onChange={handleChange('password')}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant="contained" color="error" onClick={onCancel}>Cancelar</Button>
          {initialData?.dni && ( // Solo en modo edición
            <Button variant="contained" onClick={() => setModalHorarioAbierto(true)}>Horario</Button>
          )}
          <Button type="submit" variant="outlined">Guardar</Button>
        </Box>

        <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {serviciosMedicos.length > 0 ? (
            serviciosMedicos.map((servicio) => (
              <Chip
                key={servicio.cups}
                label={servicio.nombre}
                color="primary"
                variant="outlined"
                onDelete={() => handleEliminarServicio(servicio.cups)}
                deleteIcon={<DeleteIcon />}
              />
            ))
          ) : (
            <Chip label="Sin servicios" variant="outlined" />
          )}

          <Chip
            icon={<AddIcon />}
            label="Agregar"
            clickable
            color="success"
            onClick={() => setModalAbierto(true)}
            variant="outlined"
          />
        </Box>
      </Box>

      <Dialog open={isInitialScheduleModalOpen} onClose={() => setIsInitialScheduleModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
          Configurar Horario Inicial
        </DialogTitle>
        <DialogContent dividers>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          {isLoadingFormOpts && <Typography>Cargando opciones...</Typography>}
          {!isLoadingFormOpts && !formError && (
            <Grid container spacing={2} sx={{ pt: 2 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Días de atención</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {DIAS_SEMANA_CONFIG.map((diaConfig) => (
                    <Box key={diaConfig.backendValue} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                      <Typography variant="caption">{diaConfig.display}</Typography>
                      <Checkbox
                        checked={initialSchedule.dias?.includes(diaConfig.display) || false}
                        onChange={(e) => handleInitialScheduleCheckboxChange(diaConfig.display, e.target.checked)}
                      />
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="horaInicio" label="Hora de inicio" type="time" fullWidth
                  value={initialSchedule.horaInicio} onChange={handleInitialScheduleChange}
                  InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }} // 30 min steps
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="horaFin" label="Hora de fin" type="time" fullWidth
                  value={initialSchedule.horaFin} onChange={handleInitialScheduleChange}
                  InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="initial-servicio-label">Servicio Médico</InputLabel>
                  <Select labelId="initial-servicio-label" name="servicio"
                    value={initialSchedule.servicio} label="Servicio Médico"
                    onChange={handleInitialScheduleChange}>
                    {formServiciosOpts.map((s) => <MenuItem key={s.value} value={s.label}>{s.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              {initialSchedule.servicio && consultoriosForSelectedServicioInForm.length > 0 && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="initial-consultorio-label">Consultorio</InputLabel>
                    <Select labelId="initial-consultorio-label" name="consultorio"
                      value={initialSchedule.consultorio} label="Consultorio"
                      onChange={handleInitialScheduleChange}>
                      {consultoriosForSelectedServicioInForm.map((c) => <MenuItem key={c.value} value={c.label}>{c.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              {initialSchedule.servicio && consultoriosForSelectedServicioInForm.length === 0 && !isLoadingFormOpts && (
                <Grid item xs={12} sm={6}>
                  <Alert severity="warning">No hay consultorios disponibles para este servicio.</Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => {
            setInitialSchedule({ // Limpiar formulario del modal
              dias: [], horaInicio: '09:00', horaFin: '17:00',
              servicio: formServiciosOpts.length > 0 ? formServiciosOpts[0].label : '',
              consultorio: ''
            });
          }} color="warning" startIcon={<ClearIcon />}>Limpiar</Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={() => setIsInitialScheduleModalOpen(false)} color="inherit" startIcon={<CloseIcon />}>Cancelar</Button>
          <Button onClick={handleSaveInitialSchedule} variant="contained" color="primary" startIcon={<Save />} disabled={isLoadingFormOpts}>
            Guardar Horario y Crear Médico
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={modalAbierto}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 3,
              minWidth: 360,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              outline: 'none'
            }}
          >
            <Typography variant="h6" component="h2" fontWeight="bold">
              Agregar servicio médico
            </Typography>

            <TextField
              select
              fullWidth
              label="Seleccionar servicio"
              value={servicioSeleccionado}
              onChange={(e) => setServicioSeleccionado(e.target.value)}
              variant="outlined"
            >
              {todosServicios.map((servicio) => (
                <MenuItem key={servicio.value} value={servicio.value}>
                  {servicio.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              onClick={handleAgregarServicio}
              disabled={!servicioSeleccionado}
              sx={{ alignSelf: 'flex-end' }}
            >
              Agregar
            </Button>
          </Box>
        </Fade>
      </Modal>


      {initialData?.dni && (
        <Horario
          open={modalHorarioAbierto}
          onClose={() => setModalHorarioAbierto(false)}
          dniMedico={formData?.dni}
        />
      )}

    </form>
  );
};

export default MedicoFormulario;
