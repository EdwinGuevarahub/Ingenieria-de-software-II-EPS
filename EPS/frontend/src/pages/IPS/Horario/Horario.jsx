import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Table, TableContainer,
    TableBody, TableCell, TableHead, TableRow, Stack, MenuItem, Select, InputLabel, FormControl,
    Paper, IconButton, Tooltip, Checkbox, CircularProgress, Alert
} from '@mui/material';
import { AddCircleOutline, Edit, Delete, Close, Save, CleaningServices } from '@mui/icons-material';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { obtenerHorario, crearHorario, actualizarHorario } from '@/../../src/services/trabajaService';
import { listarConsultorios } from "@/../../src/services/consultorioService.js";
import { listaServiciosMedicosPorIPS } from "@/../../src/services/serviciosMedicosService.js";
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

    useEffect(() => {
        if (open) {
            if (initialData) {
                let diasToSet = [];
                if (initialData.dias && Array.isArray(initialData.dias)) {
                    diasToSet = initialData.dias;
                } else if (initialData.dia) {
                    diasToSet = [initialData.dia];
                }
                setFormHorario({
                    dias: diasToSet,
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
            alert('Por favor, complete todos los campos requeridos, incluyendo al menos un día.');
            return;
        }
        if (formHorario.horaInicio >= formHorario.horaFin) {
            alert('La hora de fin debe ser posterior a la hora de inicio.');
            return;
        }
        onSave(formHorario, isEditing);
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
                                            horaInicio: newValue.format('HH:mm')
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
                                            horaFin: newValue.format('HH:mm')
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

    // Autentificación de ips
    const { ips } = useIpsContext();

    // Estados del componente
    const [horariosGuardados, setHorariosGuardados] = useState([]);
    const [editingHorario, setEditingHorario] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [serviciosOpts, setServiciosOpts] = useState([]);
    const [consultoriosOpts, setConsultoriosOpts] = useState([]);

    useEffect(() => {
        if (open) {
            const doFetchServicios = async () => {
                try {
                    const servicio = await listaServiciosMedicosPorIPS(ips.id);
                    setServiciosOpts(servicio.map((s) => ({ label: s.nombre, value: s.cups })));
                } catch (e) {
                    console.error("Error cargando servicios:", e);
                    setError("Error cargando lista de servicios médicos.");
                }
            };
            doFetchServicios();
        }
    }, [open, ips]);

    useEffect(() => {
        if (open && dniMedico) {
            const doFetchConsultorios = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const filtros = { idIps: ips.id || undefined };
                    const { consultorios } = await listarConsultorios(filtros);
                    setConsultoriosOpts(consultorios.map((c) => ({
                        nombreServicio: c.nombreServicioMedico,
                        cupsServicio: c.cupsServicioMedico,
                        idIps: c.idIps,
                        label: `Consultorio ${c.idConsultorio}`,
                        value: c.idConsultorio,
                    })));
                } catch (e) {
                    console.error("Error cargando consultorios:", e);
                    setError("Error cargando lista de consultorios. " + (e.message || ""));
                    setConsultoriosOpts([]);
                } finally {
                    setIsLoading(false);
                }
            };
            doFetchConsultorios();
        }
    }, [open, dniMedico, ips]);

    const fetchTrabaja = useCallback(async () => {
        if (!dniMedico) {
            setHorariosGuardados([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
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
                setHorariosGuardados(transformedHorarios);
            } else {
                setHorariosGuardados([]);
            }
        } catch (err) {
            console.error('Error cargando los horarios:', err);
            setError('No se pudieron cargar los horarios. Intente más tarde.');
            setHorariosGuardados([]);
        } finally {
            setIsLoading(false);
        }
    }, [dniMedico, consultoriosOpts]);

    useEffect(() => {
        if (open && dniMedico) {
            fetchTrabaja();
        } else if (!dniMedico && open) {
            setError("DNI del médico no proporcionado.");
            setHorariosGuardados([]);
        }
    }, [open, dniMedico, fetchTrabaja]);

    const handleOpenFormForNew = () => {
        setEditingHorario(null);
        setFormOpen(true);
    };

    const handleOpenFormForEdit = (horario) => {
        setEditingHorario({
            ...horario,
            dias: [horario.dia]
        });
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditingHorario(null);
    };

    const handleSaveHorario = async (formData, isEditing) => {
        setIsLoading(true);
        setError(null);

        const idConsultorioLocal = getIdConsultorioFromName(formData.consultorio, consultoriosOpts);
        const idIpsLocal = getIdIPSFromConsultorio(idConsultorioLocal, consultoriosOpts);

        if (idIpsLocal === null) { return; }
        if (idConsultorioLocal === null) { return; }

        try {
            if (isEditing && editingHorario) {
                const diaConfig = DIAS_SEMANA_CONFIG.find(d => d.display === formData.dias[0]);
                if (!diaConfig) {
                    throw new Error(`Día no válido: ${formData.dias[0]}`);
                }
                const backendDay = diaConfig.backendValue;
                const dataToUpdate = {
                    idConsultorio: idConsultorioLocal,
                    idIps: idIpsLocal,
                    horario: [{
                        dia: backendDay,
                        inicio: formData.horaInicio + ":00",
                        fin: formData.horaFin + ":00",
                    }]
                };
                await actualizarHorario(dniMedico, editingHorario.id, dataToUpdate);
            } else {
                for (const diaFrontend of formData.dias) {
                    const diaConfig = DIAS_SEMANA_CONFIG.find(d => d.display === diaFrontend);
                    if (!diaConfig) {
                        throw new Error(`Día no válido: ${diaFrontend}`);
                    }
                    const backendDay = diaConfig.backendValue;
                    const dataToCreate = {
                        idConsultorio: idConsultorioLocal,
                        idIps: idIpsLocal,
                        horario: [{
                            dia: backendDay,
                            inicio: formData.horaInicio + ":00",
                            fin: formData.horaFin + ":00",
                        }]
                    };
                    await crearHorario(dniMedico, dataToCreate);
                }
            }
            handleCloseForm();
            fetchTrabaja();
        } catch (err) {
            console.error('Error guardando el horario:', err);
            setError(err.response?.data?.message || err.message || 'Error al guardar el horario.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEliminarHorario = async (idToDelete) => {
        if (window.confirm('¿Está seguro de que desea eliminar este horario?')) {
            console.warn(`Funcionalidad de eliminar horario (ID: ${idToDelete}) no implementada con API. Realizando solo actualización optimista.`);
            setHorariosGuardados(prev => prev.filter(h => h.id !== idToDelete));
        }
    };

    const scheduleMatrix = useMemo(() => {
        const matrix = {};
        horariosGuardados.forEach(h => {
            const diaConfig = DIAS_SEMANA_CONFIG.find(d => d.display === h.dia);
            if (!diaConfig || !diaConfig.corto) {
                console.warn("Matriz: Día o código corto no encontrado para:", h.dia);
                return;
            }
            const diaCorto = diaConfig.corto;

            const inicioNum = parseInt(h.horaInicio?.split(':')[0]);
            const finNum = parseInt(h.horaFin?.split(':')[0]);

            if (isNaN(inicioNum) || isNaN(finNum) || !h.horaInicio || !h.horaFin) {
                console.warn("Matriz: Hora inicio/fin inválida para horario:", h)
                return;
            }

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

    const obtenerDatosCelda = (diaDisplay, horaCompleta) => {
        const diaConfig = DIAS_SEMANA_CONFIG.find(d => d.display === diaDisplay);
        if (!diaConfig || !diaConfig.corto) { return undefined; }
        const diaCorto = diaConfig.corto;
        return scheduleMatrix[horaCompleta]?.[diaCorto];
    };

    const handleCeldaClick = (dia, hora) => {
        const horarioExistente = horariosGuardados.find(h => {
            const diaH = h.dia;
            const horaInicioNum = parseInt(h.horaInicio?.split(':')[0]);
            const horaFinNum = parseInt(h.horaFin?.split(':')[0]);
            const horaCeldaNum = parseInt(hora.split(':')[0]);

            if (isNaN(horaInicioNum) || isNaN(horaFinNum) || isNaN(horaCeldaNum)) {
                return false;
            }
            return diaH === dia && horaCeldaNum >= horaInicioNum && horaCeldaNum < horaFinNum;
        });

        if (horarioExistente) {
            handleOpenFormForEdit(horarioExistente);
        } else {
            setEditingHorario({ dia: dia, horaInicio: hora, dias: [dia] });
            setFormOpen(true);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
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
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2, overflowY: 'auto',
                        maxHeight: {
                            xs: '300px',
                            md: 'calc(100vh - 160px)'
                        }
                    }}
                >
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleOutline />}
                        onClick={handleOpenFormForNew}
                        fullWidth disabled={isLoading}>
                        Nuevo Horario
                    </Button>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'text.primary' }}>Horarios Guardados</Typography>
                    {isLoading && horariosGuardados.length === 0 && <Typography>Cargando horarios...</Typography>}
                    {!isLoading && horariosGuardados.length === 0 && !error &&
                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
                            No hay horarios guardados.
                        </Typography>}

                    {horariosGuardados.length > 0 && (
                        <Box>
                            {horariosGuardados.map((h, index) => (
                                <Paper key={`${h.id}-${h._backendDia}-${index}`}
                                    elevation={2}
                                    sx={{
                                        p: 1.5,
                                        mb: 1.5,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderLeft: `4px solid ${h.color || coloresBase[0]}`,
                                        bgcolor: '#ffffff'
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        {h.dia}: {h.horaInicio} - {h.horaFin}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">{h.servicio} - {h.consultorio}</Typography>
                                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Tooltip title="Editar">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenFormForEdit(h)}
                                                color="primary"
                                                disabled={isLoading}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEliminarHorario(h.id)}
                                                color="error"
                                                disabled={isLoading}>
                                                <Delete fontSize="small" />
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
                                        backgroundColor: (theme) => theme.palette.grey[200],
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
                                                zIndex: 1
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
                                            backgroundColor: (theme) => theme.palette.grey[200],
                                            zIndex: 2
                                        }}>{hora}</TableCell>
                                        {DIAS_SEMANA_CONFIG.map((diaConfig, index) => {
                                            const cellData = obtenerDatosCelda(diaConfig.display, hora);
                                            return (
                                                <Tooltip title={
                                                    cellData?.tooltip || `Añadir horario para ${diaConfig.display} a las ${hora}`}
                                                    placement="top"
                                                    key={index}
                                                >
                                                    <TableCell
                                                        onClick={() => !isLoading && handleCeldaClick(diaConfig.display, hora)}
                                                        sx={{
                                                            cursor: isLoading ? 'default' : 'pointer',
                                                            bgcolor: cellData?.color || '#ff9f9',
                                                            border: '1px solid #ddd',
                                                            height: 40,
                                                            minWidth: 80,
                                                            transition: 'background-color 0.2s ease',
                                                            '&:hover': {
                                                                bgcolor: isLoading ?
                                                                    (cellData?.color || '#f9f9f9') :
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
            <DialogActions sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
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