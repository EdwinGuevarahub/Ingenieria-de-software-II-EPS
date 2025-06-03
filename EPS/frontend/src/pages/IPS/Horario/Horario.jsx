import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Table, TableContainer,
    TableBody, TableCell, TableHead, TableRow, Stack, MenuItem, Select, InputLabel, FormControl,
    Paper, IconButton, Tooltip, Checkbox, CircularProgress, Alert, Slide, Snackbar,
} from '@mui/material';
import { AddCircleOutline, Edit, Close, Save, CleaningServices } from '@mui/icons-material';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { obtenerHorario, crearHorario, actualizarHorario } from '@/../../src/services/trabajaService';
import { listarConsultorios } from "@/../../src/services/consultorioService.js";
import { listaServiciosMedicosPorMedico } from "@/../../src/services/serviciosMedicosService.js";
import { useIpsContext } from '@/../../src/contexts/UserIPSContext';

const DIAS_SEMANA_CONFIG = [
    { display: 'Lunes', backendValue: 'MONDAY', corto: 'L' },
    { display: 'Martes', backendValue: 'TUESDAY', corto: 'M' },
    { display: 'Miércoles', backendValue: 'WEDNESDAY', corto: 'R' },
    { display: 'Jueves', backendValue: 'THURSDAY', corto: 'J' },
    { display: 'Viernes', backendValue: 'FRIDAY', corto: 'V' },
    { display: 'Sábado', backendValue: 'SATURDAY', corto: 'S' },
    { display: 'Domingo', backendValue: 'SUNDAY', corto: 'D' }
];

const horasDia = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const coloresBase = ['#ffccbc', '#dcedc8', '#b2dfdb', '#bbdefb', '#f8bbd0', '#e1bee7', '#c5cae9', '#fff9c4', '#ffecb3'];

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

const getServicioNameFromIdConsultorio = (ConsultorioId, consultoriosOptions) => {
    const consultorio = consultoriosOptions.find(c => c.value === ConsultorioId);
    return consultorio ? consultorio.nombreServicio : `Servicio CUPS ${consultorio ? consultorio.cupsServicio : 'Desconocido'}`;
};

const getIdServiceFromName = (name, serviciosOptions) => {
    const servicio = serviciosOptions.find(s => s.label === name);
    return servicio ? servicio.value : null;
};

const getConsultorioNameFromId = (id, consultoriosOptions) => {
    const consultorio = consultoriosOptions.find(c => c.value === id);
    return consultorio ? consultorio.label : `Consultorio ID ${id}`;
};

const getIdConsultorioFromName = (name, consultoriosOptions) => {
    const consultorio = consultoriosOptions.find(c => c.label === name);
    return consultorio ? consultorio.value : null;
};

const getIdIPSFromConsultorio = (ConsultorioId, consultoriosOptions) => {
    const consultorio = consultoriosOptions.find(c => c.value === ConsultorioId);
    return consultorio ? consultorio.idIps : null;
};

function HorarioFormDialog({ open, onClose, onSave, initialData, serviciosOpts, consultoriosOpts }) {
    const [formHorario, setFormHorario] = useState({
        dias: [], horaInicio: '', horaFin: '', servicio: '', consultorio: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    // const [error, setError] = useState(''); // Not used, can be removed

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        if (open) {
            if (initialData) {
                // initialData.dias should now be an array of display names
                setFormHorario({
                    dias: initialData.dias || [], // Ensure it's an array
                    horaInicio: initialData.horaInicio || '',
                    horaFin: initialData.horaFin || '',
                    servicio: initialData.servicio || '',
                    consultorio: initialData.consultorio || '',
                });
                setIsEditing(true);
            } else {
                setFormHorario({
                    dias: [],
                    horaInicio: '00:00',
                    horaFin: '00:00',
                    servicio: serviciosOpts.length > 0 ? serviciosOpts[0].label : '',
                    consultorio: ''
                });
                setIsEditing(false);
            }
        }
    }, [initialData, open, serviciosOpts]); // No change needed here, it already expects initialData.dias to be an array

    useEffect(() => {
        if (open && formHorario.servicio && consultoriosOpts.length > 0) {
            const selectedServiceId = getIdServiceFromName(formHorario.servicio, serviciosOpts);
            const availableConsultorios = consultoriosOpts.filter(c => c.cupsServicio === selectedServiceId);

            if (availableConsultorios.length > 0) {
                if (!formHorario.consultorio || !availableConsultorios.some(c => c.label === formHorario.consultorio)) {
                    setFormHorario(prev => ({ ...prev, consultorio: availableConsultorios[0].label }));
                }
            } else if (formHorario.consultorio !== '') {
                setFormHorario(prev => ({ ...prev, consultorio: '' }));
            }
        }
    }, [formHorario.servicio, formHorario.consultorio, consultoriosOpts, serviciosOpts, open]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormHorario(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'servicio') {
                const servicioCups = getIdServiceFromName(value, serviciosOpts);
                const relatedConsultorios = consultoriosOpts.filter(c => c.cupsServicio === servicioCups);
                newState.consultorio = relatedConsultorios.length > 0 ? relatedConsultorios[0].label : '';
            }
            return newState;
        });
    };

    const handleCheckboxChange = (diaDisplay, checked) => {
        setFormHorario(prev => {
            const newDias = prev.dias || [];
            const updatedDias = checked
                ? [...newDias, diaDisplay]
                : newDias.filter((d) => d !== diaDisplay);
            return { ...prev, dias: updatedDias };
        });
    };

    const handleSave = () => {
        if (!formHorario.dias || formHorario.dias.length === 0 || !formHorario.horaInicio || !formHorario.horaFin
            || !formHorario.servicio || !formHorario.consultorio) {
            showMessage('Por favor, complete todos los campos requeridos.', 'warning');
            return;
        }
        if (formHorario.horaInicio >= formHorario.horaFin) {
            showMessage('La hora de fin debe ser posterior a la hora de inicio.', 'warning');
            return;
        }
        // Pass the original ID if editing, for the save function to use
        onSave(formHorario, isEditing, initialData?.id);
    };

    const handleClear = () => {
        setFormHorario({
            dias: [],
            horaInicio: '00:00',
            horaFin: '00:00',
            servicio: serviciosOpts.length > 0 ? serviciosOpts[0].label : '',
            consultorio: ''
        });
    };

    const consultoriosForSelectedServicio = useMemo(() => {
        const servicioCups = getIdServiceFromName(formHorario.servicio, serviciosOpts);
        if (!servicioCups) return [];
        return consultoriosOpts.filter(c => c.cupsServicio === servicioCups);
    }, [formHorario.servicio, consultoriosOpts, serviciosOpts]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="body">
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} TransitionComponent={SlideTransition} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                {isEditing ? 'Editar Horario' : 'Nuevo Horario'}
            </DialogTitle>
            <DialogContent dividers sx={{ overflow: 'visible' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2} sx={{ pt: 2, flexDirection: 'column' }}>

                        {/* DÍAS */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Días de atención</Typography>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                gap: 2,
                                minHeight: 80
                            }}>
                                {DIAS_SEMANA_CONFIG.map((diaConfig) => (
                                    <Box
                                        key={diaConfig.backendValue}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            width: '80px'
                                        }}
                                    >
                                        <Typography variant="caption">{diaConfig.display}</Typography>
                                        <Checkbox
                                            checked={formHorario.dias?.includes(diaConfig.display) || false}
                                            onChange={(e) => handleCheckboxChange(diaConfig.display, e.target.checked)}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Grid>

                        {/* HORAS */}
                        <Grid item xs={12}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TimePicker
                                    label="Hora de inicio"
                                    value={dayjs(`2023-01-01T${formHorario.horaInicio}`)}
                                    onChange={(newValue) =>
                                        setFormHorario((prev) => ({
                                            ...prev,
                                            horaInicio: newValue ? newValue.format('HH:mm') : '00:00'
                                        }))
                                    }
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined'
                                        }
                                    }}
                                />
                                <TimePicker
                                    label="Hora de fin"
                                    value={dayjs(`2023-01-01T${formHorario.horaFin}`)}
                                    onChange={(newValue) =>
                                        setFormHorario((prev) => ({
                                            ...prev,
                                            horaFin: newValue ? newValue.format('HH:mm') : '00:00'
                                        }))
                                    }
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined'
                                        }
                                    }}
                                />
                            </Stack>
                        </Grid>

                        {/* SERVICIO */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="servicio-label">Servicio Médico</InputLabel>
                                <Select
                                    labelId="servicio-label"
                                    name="servicio"
                                    value={formHorario.servicio}
                                    label="Servicio Médico"
                                    onChange={handleChange}
                                >
                                    {serviciosOpts.map((s) => (
                                        <MenuItem key={s.value} value={s.label}>
                                            {s.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* CONSULTORIO */}
                        {formHorario.servicio && consultoriosForSelectedServicio.length > 0 && (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="consultorio-label">Consultorio</InputLabel>
                                    <Select
                                        labelId="consultorio-label"
                                        name="consultorio"
                                        value={formHorario.consultorio}
                                        label="Consultorio"
                                        onChange={handleChange}
                                    >
                                        {consultoriosForSelectedServicio.map((c) => (
                                            <MenuItem key={c.value} value={c.label}>
                                                {c.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {formHorario.servicio && consultoriosForSelectedServicio.length === 0 && (
                            <Grid item xs={12}>
                                <Alert severity="warning">No hay consultorios disponibles para este servicio.</Alert>
                            </Grid>
                        )}
                    </Grid>
                </LocalizationProvider>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClear} color="warning" startIcon={<CleaningServices />}>Limpiar</Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button onClick={handleSave} variant="contained" color="primary" startIcon={<Save />}>Guardar</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function HorarioModal({ open, onClose, dniMedico }) {
    const { ips } = useIpsContext();
    const [rawHorarios, setRawHorarios] = useState([]); // Stores the direct output from fetchTrabaja for grid
    const [editingHorario, setEditingHorario] = useState(null); // This will store data for the form
    const [formOpen, setFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serviciosOpts, setServiciosOpts] = useState([]);
    const [consultoriosOpts, setConsultoriosOpts] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

    const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        if (open && dniMedico) { // Also fetch if dniMedico changes while open
            const doFetchServicios = async () => {
                try {
                    const servicios = await listaServiciosMedicosPorMedico(dniMedico);
                    setServiciosOpts(servicios.map((s) => ({ label: s.nombre, value: s.cups })));
                } catch (e) {
                    showMessage("Error cargando lista de servicios. " + (e.message || ""), 'error');
                }
            };
            doFetchServicios();
        }
    }, [open, dniMedico]); // Removed ips from dependency array as it's not used in service call

    useEffect(() => {
        if (open && dniMedico) { // Fetch if ips.id changes
            const doFetchConsultorios = async () => {
                setIsLoading(true);
                try {
                    const filtros = { idIps: ips?.id || undefined }; // Ensure ips.id exists
                    const { consultorios } = await listarConsultorios(filtros);
                    setConsultoriosOpts(consultorios.map((c) => ({
                        nombreServicio: c.nombreServicioMedico,
                        cupsServicio: c.cupsServicioMedico,
                        idIps: c.idIps,
                        label: `Consultorio ${c.idConsultorio}`,
                        value: c.idConsultorio,
                    })));
                } catch (e) {
                    showMessage("Error cargando lista de consultorios.", 'error');
                    setConsultoriosOpts([]);
                } finally {
                    setIsLoading(false);
                }
            };
            if (ips?.id) { // Only fetch if ips.id is available
                 doFetchConsultorios();
            } else if (open) {
                 showMessage("ID de IPS no disponible. No se pueden cargar consultorios.", 'warning');
                 setConsultoriosOpts([]);
            }
        }
    }, [open, dniMedico, ips?.id]); // Depend on ips.id

    const fetchTrabaja = useCallback(async () => {
        if (!dniMedico) {
            setRawHorarios([]);
            setIsLoading(false);
            return;
        }
        if (consultoriosOpts.length === 0 && open) { // Don't fetch if consultorios aren't loaded yet but modal is open
            // showMessage("Esperando carga de consultorios...", "info") // Optional: inform user
            return;
        }
        setIsLoading(true);
        try {
            const dataFromService = await obtenerHorario(dniMedico);
            if (dataFromService && Array.isArray(dataFromService)) {
                const transformedHorarios = dataFromService.flatMap((trabaja, index) => {
                    if (!trabaja.horario || !Array.isArray(trabaja.horario)) return [];
                    return trabaja.horario.map(h => {
                        const diaConfig = DIAS_SEMANA_CONFIG.find(d => d.backendValue === h.dia?.toUpperCase());
                        return {
                            id: trabaja.id, // This is the ID of the 'trabaja' entry
                            dniMedico: trabaja.dniMedico,
                            idIps: trabaja.idIps,
                            idConsultorio: trabaja.idConsultorio,
                            dia: diaConfig ? diaConfig.display : h.dia, // Display name of the day
                            _backendDia: h.dia?.toUpperCase(), // Backend name of the day
                            horaInicio: h.inicio?.substring(0, 5),
                            horaFin: h.fin?.substring(0, 5),
                            servicio: getServicioNameFromIdConsultorio(trabaja.idConsultorio, consultoriosOpts),
                            consultorio: getConsultorioNameFromId(trabaja.idConsultorio, consultoriosOpts),
                            color: coloresBase[index % coloresBase.length] // Color based on original trabaja index
                        };
                    });
                });
                setRawHorarios(transformedHorarios);
            } else {
                setRawHorarios([]);
            }
        } catch (err) {
            showMessage('No se pudieron cargar los horarios. Intente más tarde.', 'error');
            setRawHorarios([]);
        } finally {
            setIsLoading(false);
        }
    }, [dniMedico, consultoriosOpts, open]); // Added open to re-evaluate if consultorios become available

    useEffect(() => {
        if (open && dniMedico && consultoriosOpts.length > 0) { // Ensure consultorios are loaded
            fetchTrabaja();
        } else if (!dniMedico && open) {
            showMessage("DNI del médico no proporcionado.", 'error');
            setRawHorarios([]);
        }
    }, [open, dniMedico, fetchTrabaja, consultoriosOpts.length]); // consultoriosOpts.length ensures re-fetch when they load

    // --- START: Grouping Logic ---
    const groupedHorariosGuardados = useMemo(() => {
        if (!rawHorarios.length) return [];

        const groups = new Map();
        rawHorarios.forEach(h => {
            // Group by 'trabaja' id, times, and consultorio to correctly bundle slots
            const groupKey = `${h.id}-${h.horaInicio}-${h.horaFin}-${h.idConsultorio}`;
            if (!groups.has(groupKey)) {
                groups.set(groupKey, {
                    id: h.id, // Backend 'trabaja' ID
                    idConsultorio: h.idConsultorio,
                    idIps: h.idIps, // Store this if needed for editing
                    horaInicio: h.horaInicio,
                    horaFin: h.horaFin,
                    servicio: h.servicio,
                    consultorio: h.consultorio,
                    dias: [], // Store display day names
                    _backendDias: [], // Store backend day names
                    color: h.color, // Use color from the first item in group
                });
            }
            const group = groups.get(groupKey);
            if (h.dia && !group.dias.includes(h.dia)) { // Avoid duplicate days if data is messy
                group.dias.push(h.dia);
                group.dias.sort((a, b) => { // Sort days for consistent display
                    const dayA = DIAS_SEMANA_CONFIG.find(d => d.display === a)?.backendValue;
                    const dayB = DIAS_SEMANA_CONFIG.find(d => d.display === b)?.backendValue;
                    return DIAS_SEMANA_CONFIG.findIndex(d => d.backendValue === dayA) - DIAS_SEMANA_CONFIG.findIndex(d => d.backendValue === dayB);
                });
            }
            if (h._backendDia && !group._backendDias.includes(h._backendDia)) {
                 group._backendDias.push(h._backendDia);
            }
        });
        return Array.from(groups.values());
    }, [rawHorarios]);
    // --- END: Grouping Logic ---

    const handleOpenFormForNew = () => {
        setEditingHorario(null); // Clear any previous editing state
        setFormOpen(true);
    };

    const handleOpenFormForEdit = (groupedHorarioItem) => {
        // groupedHorarioItem now contains all days for that specific slot
        setEditingHorario({
            id: groupedHorarioItem.id, // This is the ID of the 'trabaja' entry
            dias: groupedHorarioItem.dias, // Pass all display days
            horaInicio: groupedHorarioItem.horaInicio,
            horaFin: groupedHorarioItem.horaFin,
            servicio: groupedHorarioItem.servicio,
            consultorio: groupedHorarioItem.consultorio,
            idConsultorio: groupedHorarioItem.idConsultorio, // Keep original consultorio ID if needed
            idIps: groupedHorarioItem.idIps // Keep original IPS ID
        });
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditingHorario(null); // Clear editing state
    };

    const handleSaveHorario = async (formData, isEditingMode, originalTrabajaId) => {
        setIsLoading(true);

        const idConsultorioLocal = getIdConsultorioFromName(formData.consultorio, consultoriosOpts);
        // idIpsLocal should ideally come from the selected consultorio,
        // or if consultorio cannot be changed during edit, from editingHorario.idIps
        const idIpsLocal = getIdIPSFromConsultorio(idConsultorioLocal, consultoriosOpts);

        if (idIpsLocal === null) {
            showMessage('No se pudo determinar la IPS para el consultorio seleccionado.', 'error');
            setIsLoading(false);
            return;
        }
        if (idConsultorioLocal === null) {
            showMessage('Consultorio no válido.', 'error');
            setIsLoading(false);
            return;
        }

        try {
            // Map form's display days back to backend values
            const horarioItems = formData.dias.map(diaDisplay => {
                const diaConfig = DIAS_SEMANA_CONFIG.find(d => d.display === diaDisplay);
                if (!diaConfig) {
                    throw new Error(`Configuración de día no encontrada para: ${diaDisplay}`);
                }
                return {
                    dia: diaConfig.backendValue,
                    inicio: formData.horaInicio + ":00",
                    fin: formData.horaFin + ":00",
                };
            });

            if (isEditingMode && originalTrabajaId) {
                // When editing, we update the 'trabaja' entry identified by originalTrabajaId
                // The 'horario' array will contain all days selected in the form for this specific slot
                const dataToUpdate = {
                    idConsultorio: idConsultorioLocal,
                    idIps: idIpsLocal, // This might need to be fixed if IPS cannot change
                    horario: horarioItems,
                };
                await actualizarHorario(dniMedico, originalTrabajaId, dataToUpdate);
                showMessage('Horario actualizado correctamente.', 'success');
            } else {
                // For new schedules, create one 'trabaja' entry with all selected days
                const dataToCreate = {
                    idConsultorio: idConsultorioLocal,
                    idIps: idIpsLocal,
                    horario: horarioItems, // All selected days go into this single new entry
                };
                await crearHorario(dniMedico, dataToCreate);
                showMessage('Horario creado correctamente.', 'success');
            }
            handleCloseForm();
            fetchTrabaja(); // Refresh the list
        } catch (err) {
            showMessage(`Error al guardar el horario: ${err.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const scheduleMatrix = useMemo(() => {
        const matrix = {};
        rawHorarios.forEach(h => { // Use rawHorarios for grid display
            const diaConfig = DIAS_SEMANA_CONFIG.find(d => d.display === h.dia);
            if (!diaConfig || !diaConfig.corto) {
                // showMessage(`Día no válido en scheduleMatrix: ${h.dia}`, 'warning');
                return;
            }
            const diaCorto = diaConfig.corto;

            const inicioNum = parseInt(h.horaInicio?.split(':')[0]);
            const finNum = parseInt(h.horaFin?.split(':')[0]);

            if (isNaN(inicioNum) || isNaN(finNum) || !h.horaInicio || !h.horaFin) {
                // showMessage(`Horario inválido en scheduleMatrix: ${h.horaInicio} - ${h.horaFin}`, 'warning');
                return;
            }

            for (let hora = inicioNum; hora < finNum; hora++) {
                const horaKey = `${String(hora).padStart(2, '0')}:00`;
                if (!matrix[horaKey]) matrix[horaKey] = {};
                matrix[horaKey][diaCorto] = {
                    id: h.id, // Store id for fetching full data on click
                    idConsultorio: h.idConsultorio,
                    color: h.color,
                    tooltip: `${h.servicio} (${h.consultorio})\n${h.horaInicio} - ${h.horaFin}`
                };
            }
        });
        return matrix;
    }, [rawHorarios]);

    const obtenerDatosCelda = (diaDisplay, horaCompleta) => {
        const diaConfig = DIAS_SEMANA_CONFIG.find(d => d.display === diaDisplay);
        if (!diaConfig || !diaConfig.corto) { return undefined; }
        const diaCorto = diaConfig.corto;
        return scheduleMatrix[horaCompleta]?.[diaCorto];
    };

    const handleCeldaClick = (diaClickedDisplay, horaClicked) => {
        const cellData = obtenerDatosCelda(diaClickedDisplay, horaClicked);

        if (cellData && cellData.id && cellData.idConsultorio) {
            // Find the original 'trabaja' entry (which might span multiple days)
            // that this cell belongs to. We need its 'id', 'horaInicio', 'horaFin', 'idConsultorio'
            // to find all its associated days from rawHorarios.

            const clickedHorarioSlot = rawHorarios.find(h =>
                h.id === cellData.id &&
                h.idConsultorio === cellData.idConsultorio &&
                parseInt(h.horaInicio?.split(':')[0]) === parseInt(horaClicked.split(':')[0]) // Approximate match by start hour
            );

            if (clickedHorarioSlot) {
                 const allDaysForThisSlot = rawHorarios
                    .filter(h =>
                        h.id === clickedHorarioSlot.id &&
                        h.idConsultorio === clickedHorarioSlot.idConsultorio &&
                        h.horaInicio === clickedHorarioSlot.horaInicio &&
                        h.horaFin === clickedHorarioSlot.horaFin
                    )
                    .map(h => h.dia)
                    .filter((value, index, self) => self.indexOf(value) === index); // Unique days

                allDaysForThisSlot.sort((a, b) => { // Sort days for consistent display
                    const dayA = DIAS_SEMANA_CONFIG.find(d => d.display === a)?.backendValue;
                    const dayB = DIAS_SEMANA_CONFIG.find(d => d.display === b)?.backendValue;
                    return DIAS_SEMANA_CONFIG.findIndex(d => d.backendValue === dayA) - DIAS_SEMANA_CONFIG.findIndex(d => d.backendValue === dayB);
                });


                handleOpenFormForEdit({
                    id: clickedHorarioSlot.id,
                    dias: allDaysForThisSlot,
                    horaInicio: clickedHorarioSlot.horaInicio,
                    horaFin: clickedHorarioSlot.horaFin,
                    servicio: clickedHorarioSlot.servicio,
                    consultorio: clickedHorarioSlot.consultorio,
                    idConsultorio: clickedHorarioSlot.idConsultorio,
                    idIps: clickedHorarioSlot.idIps
                });
            } else {
                 // Fallback or error if we can't find the detailed slot
                setEditingHorario({ dia: diaClickedDisplay, horaInicio: horaClicked, dias: [diaClickedDisplay] });
                setFormOpen(true);
            }

        } else {
            // No existing schedule in this cell, open form for new with this day/time pre-filled
            setEditingHorario({ dia: diaClickedDisplay, horaInicio: horaClicked, dias: [diaClickedDisplay] });
            setFormOpen(true);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} TransitionComponent={SlideTransition} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <DialogTitle sx={{ textAlign: 'center', bgcolor: 'primary.dark', color: 'primary.contrastText', pb: 2 }}>
                Gestión de Horarios del Médico (DNI: {dniMedico})
                {isLoading && <CircularProgress size={24} sx={{ ml: 2, color: 'common.white' }} />}
            </DialogTitle>
            <DialogContent
                dividers
                sx={{
                    p: 0,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    bgcolor: 'background.default',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        width: { xs: '100%', md: 320 },
                        p: 2,
                        borderRight: { md: '1px solid' },
                        borderColor: { md: 'divider' },
                        bgcolor: 'background.default',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2, overflowY: 'auto',
                        maxHeight: {
                            xs: '300px',
                            md: 'calc(100vh - 160px)' // Adjust based on DialogTitle/Actions height
                        }
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleOutline />}
                        onClick={handleOpenFormForNew}
                        fullWidth disabled={isLoading || consultoriosOpts.length === 0 || serviciosOpts.length === 0}>
                        Nuevo Horario
                    </Button>
                     {(consultoriosOpts.length === 0 || serviciosOpts.length === 0) && open && !isLoading &&
                        <Alert severity="info" sx={{mt:1}}>Cargando opciones de consultorios/servicios...</Alert>
                    }
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'text.primary' }}>Horarios Guardados</Typography>
                    {isLoading && groupedHorariosGuardados.length === 0 && <Typography>Cargando horarios...</Typography>}
                    {!isLoading && groupedHorariosGuardados.length === 0 &&
                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
                            No hay horarios guardados.
                        </Typography>}

                    {/* Iterate over groupedHorariosGuardados for display */}
                    {groupedHorariosGuardados.length > 0 && (
                        <Box>
                            {groupedHorariosGuardados.map((group, index) => (
                                <Paper key={`${group.id}-${index}`} // Use group.id and index for key
                                    elevation={2}
                                    sx={{
                                        p: 1.5,
                                        mb: 1.5,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderLeft: `4px solid ${group.color || coloresBase[0]}`,
                                        bgcolor: '#ffffff'
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        {/* Join the days in the group */}
                                        {group.dias.join(', ')}: {group.horaInicio} - {group.horaFin}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">{group.servicio} - {group.consultorio}</Typography>
                                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Tooltip title="Editar">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenFormForEdit(group)} // Pass the whole group
                                                color="primary"
                                                disabled={isLoading}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </Box>
                {/* Tabla de horarios */}
                <Box sx={{ flexGrow: 1, p: { xs: 1, md: 2 }, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            flexGrow: 1,
                            overflow: 'auto',
                            maxHeight: 'calc(100vh - 160px)', // Adjust based on DialogTitle/Actions height
                        }}
                    >
                        <Table size="small" stickyHeader sx={{ borderCollapse: 'collapse', minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        border: '1px solid #ddd',
                                        width: '80px',
                                        backgroundColor: (theme) => theme.palette.grey[100],
                                        zIndex: 3, // Ensure it's above body cells
                                        position: 'sticky',
                                        left: 0
                                    }}>Hora</TableCell>
                                    {DIAS_SEMANA_CONFIG.map((diaConfig) => (
                                        <TableCell
                                            key={diaConfig.backendValue}
                                            sx={{
                                                fontWeight: 'bold',
                                                border: '1px solid #ddd',
                                                textAlign: 'center',
                                                backgroundColor: (theme) => theme.palette.grey[100],
                                                zIndex: 1 // Lower zIndex than sticky Hora cell
                                            }}
                                        >{diaConfig.display}</TableCell>
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
                                            position: 'sticky',
                                            left: 0,
                                            backgroundColor: (theme) => theme.palette.grey[50], // Lighter for sticky cell
                                            zIndex: 2 // Above regular cells, below header
                                        }}>{hora}</TableCell>
                                        {DIAS_SEMANA_CONFIG.map((diaConfig, index) => {
                                            const cellData = obtenerDatosCelda(diaConfig.display, hora);
                                            return (
                                                <Tooltip title={
                                                    cellData?.tooltip || `Añadir horario para ${diaConfig.display} a las ${hora}`}
                                                    placement="top"
                                                    key={`${diaConfig.backendValue}-${hora}`}
                                                >
                                                    <TableCell
                                                        onClick={() => !isLoading && handleCeldaClick(diaConfig.display, hora)}
                                                        sx={{
                                                            cursor: isLoading ? 'default' : 'pointer',
                                                            bgcolor: cellData?.color || '#ffffff', // Ensure background is white if no data
                                                            border: '1px solid #ddd',
                                                            height: 40, // Fixed height for cells
                                                            minWidth: 80, // Minimum width for day cells
                                                            transition: 'background-color 0.2s ease',
                                                            '&:hover': {
                                                                bgcolor: isLoading ?
                                                                    (cellData?.color || 'background.paper') : // Use background.paper for default hover
                                                                    (cellData?.color ? `${cellData.color}E6` : '#e0e0e0'), // Apply opacity or hover color
                                                                boxShadow: isLoading ? 'none' : 'inset 0 0 5px rgba(0,0,0,0.1)',
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
                    </TableContainer>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
                <Button onClick={onClose} variant="outlined" color="primary" startIcon={<Close />}>
                    Cerrar Ventana
                </Button>
            </DialogActions>

            <HorarioFormDialog
                open={formOpen}
                onClose={handleCloseForm}
                onSave={handleSaveHorario}
                initialData={editingHorario} // This will now contain all days for the slot
                serviciosOpts={serviciosOpts}
                consultoriosOpts={consultoriosOpts}
            />
        </Dialog>
    );
}