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

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormHorario({
                    dias: initialData.dias || [], 
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
    }, [initialData, open, serviciosOpts]); 

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
    const [rawHorarios, setRawHorarios] = useState([]); 
    const [editingHorario, setEditingHorario] = useState(null);
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
        if (open && dniMedico) { 
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
    }, [open, dniMedico]); 

    useEffect(() => {
        if (open && dniMedico) {
            const doFetchConsultorios = async () => {
                setIsLoading(true);
                try {
                    const filtros = { idIps: ips?.id || undefined }; 
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
            if (ips?.id) { 
                 doFetchConsultorios();
            } else if (open) {
                 showMessage("ID de IPS no disponible. No se pueden cargar consultorios.", 'warning');
                 setConsultoriosOpts([]);
            }
        }
    }, [open, dniMedico, ips?.id]); 

    const fetchTrabaja = useCallback(async () => {
        if (!dniMedico) {
            setRawHorarios([]);
            setIsLoading(false);
            return;
        }
        if (consultoriosOpts.length === 0 && open) { 
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
                            id: trabaja.id, 
                            dniMedico: trabaja.dniMedico,
                            idIps: trabaja.idIps,
                            idConsultorio: trabaja.idConsultorio,
                            dia: diaConfig ? diaConfig.display : h.dia, 
                            _backendDia: h.dia?.toUpperCase(), 
                            horaInicio: h.inicio?.substring(0, 5),
                            horaFin: h.fin?.substring(0, 5),
                            servicio: getServicioNameFromIdConsultorio(trabaja.idConsultorio, consultoriosOpts),
                            consultorio: getConsultorioNameFromId(trabaja.idConsultorio, consultoriosOpts),
                            color: coloresBase[index % coloresBase.length] 
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
    }, [dniMedico, consultoriosOpts, open]); 

    useEffect(() => {
        if (open && dniMedico && consultoriosOpts.length > 0) {
            fetchTrabaja();
        } else if (!dniMedico && open) {
            showMessage("DNI del médico no proporcionado.", 'error');
            setRawHorarios([]);
        }
    }, [open, dniMedico, fetchTrabaja, consultoriosOpts.length]);


    const groupedHorariosGuardados = useMemo(() => {
        if (!rawHorarios.length) return [];

        const groups = new Map();
        rawHorarios.forEach(h => {

            const groupKey = `${h.id}-${h.horaInicio}-${h.horaFin}-${h.idConsultorio}`;
            if (!groups.has(groupKey)) {
                groups.set(groupKey, {
                    id: h.id, 
                    idConsultorio: h.idConsultorio,
                    idIps: h.idIps, 
                    horaInicio: h.horaInicio,
                    horaFin: h.horaFin,
                    servicio: h.servicio,
                    consultorio: h.consultorio,
                    dias: [], 
                    _backendDias: [], 
                    color: h.color,
                });
            }
            const group = groups.get(groupKey);
            if (h.dia && !group.dias.includes(h.dia)) { 
                group.dias.push(h.dia);
                group.dias.sort((a, b) => { 
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


    const handleOpenFormForNew = () => {
        setEditingHorario(null); 
        setFormOpen(true);
    };

    const handleOpenFormForEdit = (groupedHorarioItem) => {

        setEditingHorario({
            id: groupedHorarioItem.id,
            dias: groupedHorarioItem.dias, 
            horaInicio: groupedHorarioItem.horaInicio,
            horaFin: groupedHorarioItem.horaFin,
            servicio: groupedHorarioItem.servicio,
            consultorio: groupedHorarioItem.consultorio,
            idConsultorio: groupedHorarioItem.idConsultorio, 
            idIps: groupedHorarioItem.idIps 
        });
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditingHorario(null); 
    };

    const handleSaveHorario = async (formData, isEditingMode, originalTrabajaId) => {
        setIsLoading(true);

        const idConsultorioLocal = getIdConsultorioFromName(formData.consultorio, consultoriosOpts);
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
                const dataToUpdate = {
                    idConsultorio: idConsultorioLocal,
                    idIps: idIpsLocal, 
                    horario: horarioItems,
                };
                await actualizarHorario(dniMedico, originalTrabajaId, dataToUpdate);
                showMessage('Horario actualizado correctamente.', 'success');
            } else {
                const dataToCreate = {
                    idConsultorio: idConsultorioLocal,
                    idIps: idIpsLocal,
                    horario: horarioItems, 
                };
                await crearHorario(dniMedico, dataToCreate);
                showMessage('Horario creado correctamente.', 'success');
            }
            handleCloseForm();
            fetchTrabaja(); 
        } catch (err) {
            showMessage(`Error al guardar el horario: ${err.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const scheduleMatrix = useMemo(() => {
        const matrix = {};
        rawHorarios.forEach(h => { 
            const diaConfig = DIAS_SEMANA_CONFIG.find(d => d.display === h.dia);
            if (!diaConfig || !diaConfig.corto) {
                return;
            }
            const diaCorto = diaConfig.corto;

            const inicioNum = parseInt(h.horaInicio?.split(':')[0]);
            const finNum = parseInt(h.horaFin?.split(':')[0]);

            if (isNaN(inicioNum) || isNaN(finNum) || !h.horaInicio || !h.horaFin) {
                return;
            }

            for (let hora = inicioNum; hora < finNum; hora++) {
                const horaKey = `${String(hora).padStart(2, '0')}:00`;
                if (!matrix[horaKey]) matrix[horaKey] = {};
                matrix[horaKey][diaCorto] = {
                    id: h.id, 
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

            const clickedHorarioSlot = rawHorarios.find(h =>
                h.id === cellData.id &&
                h.idConsultorio === cellData.idConsultorio &&
                parseInt(h.horaInicio?.split(':')[0]) === parseInt(horaClicked.split(':')[0]) 
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
                    .filter((value, index, self) => self.indexOf(value) === index); 

                allDaysForThisSlot.sort((a, b) => {
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

                setEditingHorario({ dia: diaClickedDisplay, horaInicio: horaClicked, dias: [diaClickedDisplay] });
                setFormOpen(true);
            }

        } else {
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
                            md: 'calc(100vh - 160px)' 
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

                    {groupedHorariosGuardados.length > 0 && (
                        <Box>
                            {groupedHorariosGuardados.map((group, index) => (
                                <Paper key={`${group.id}-${index}`} 
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
                                                onClick={() => handleOpenFormForEdit(group)} 
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
                            maxHeight: 'calc(100vh - 160px)', 
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
                                        zIndex: 3, 
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
                                                zIndex: 1,
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
                                            backgroundColor: (theme) => theme.palette.grey[50], 
                                            zIndex: 2 
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
                                                            bgcolor: cellData?.color || '#ffffff', 
                                                            border: '1px solid #ddd',
                                                            height: 40, 
                                                            minWidth: 80, 
                                                            transition: 'background-color 0.2s ease',
                                                            '&:hover': {
                                                                bgcolor: isLoading ?
                                                                    (cellData?.color || 'background.paper') : 
                                                                    (cellData?.color ? `${cellData.color}E6` : '#e0e0e0'), 
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
                initialData={editingHorario} 
                serviciosOpts={serviciosOpts}
                consultoriosOpts={consultoriosOpts}
            />
        </Dialog>
    );
}