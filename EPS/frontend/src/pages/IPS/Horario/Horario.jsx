import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Table, TableBody,
    TableCell, TableHead, TableRow, TextField, MenuItem, Select, InputLabel, FormControl, Paper, IconButton,
    Tooltip, Checkbox, CircularProgress, Alert
} from '@mui/material';
import { AddCircleOutline, Edit, Delete, Close, Save, CleaningServices } from '@mui/icons-material';
import { obtenerHorario, crearHorario, actualizarHorario } from '@/../../src/services/trabajaService';
import { listarConsultorios } from "@/../../src/services/consultorioService.js";
import { listaServiciosMedicos } from "@/../../src/services/serviciosMedicosService.js";

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const horasDia = Array.from({ length: 17 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`);

const mapDiaCompletoACorto = { Lunes: 'L', Martes: 'M', Miércoles: 'R', Jueves: 'J', Viernes: 'V', Sábado: 'S', Domingo: 'D' };

const backendToFrontendDayMap = {
    SUNDAY: 'Domingo', MONDAY: 'Lunes', TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles', THURSDAY: 'Jueves', FRIDAY: 'Viernes',
    SATURDAY: 'Sábado'
};
const frontendToBackendDayMap = Object.fromEntries(Object.entries(backendToFrontendDayMap).map(([k, v]) => [v, k]));

const coloresBase = ['#ffccbc', '#dcedc8', '#b2dfdb', '#bbdefb', '#f8bbd0', '#e1bee7', '#c5cae9', '#fff9c4', '#ffecb3'];

let _serviciosOpts = [];
let _consultoriosOpts = [];

const getServicioNameFromIdConsultorio = (ConsultorioId) => {
    const servicio = _consultoriosOpts.find(c => c.value === ConsultorioId);
    return servicio ? servicio.nombreServicio : `Servicio CUPS ${servicio.cupsServicio}`;
};

const getIdServiceFromName = (name) => {
    const servicio = _serviciosOpts.find(s => s.label === name);
    return servicio ? servicio.value : null;
};

const getConsultorioNameFromId = (id) => {
    const consultorio = _consultoriosOpts.find(c => c.value === id);
    return consultorio ? consultorio.label : `Consultorio ID ${id}`;
};

const getIdConsultorioFromName = (name) => {
    const consultorio = _consultoriosOpts.find(c => c.label === name);
    return consultorio ? consultorio.value : null;
};

const getIdIPSFromConsultorio = (ConsultorioId) => {
    const consultorio = _consultoriosOpts.find(c => c.value === ConsultorioId);
    return consultorio ? consultorio.idIps : null;
};


function HorarioFormDialog({ open, onClose, onSave, initialData, serviciosOpts, consultoriosOpts }) { // Changed prop name
    const [formHorario, setFormHorario] = useState({
        dias: [], horaInicio: '', horaFin: '', servicio: '', consultorio: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        _serviciosOpts = serviciosOpts;
        _consultoriosOpts = consultoriosOpts;
    }, [serviciosOpts, consultoriosOpts]);

    React.useEffect(() => {
        if (open) {
            if (initialData) {
                setFormHorario({
                    dias: initialData.dias || (initialData.dia ? [initialData.dia] : []),
                    horaInicio: initialData.horaInicio || '',
                    horaFin: initialData.horaFin || '',
                    servicio: initialData.servicio || '',
                    consultorio: initialData.consultorio || '',
                });
                setIsEditing(true);
            } else {
                setFormHorario({
                    dias: [],
                    horaInicio: '09:00',
                    horaFin: '17:00',
                    servicio: serviciosOpts.length > 0 ? serviciosOpts[0].label : '',
                    consultorio: ''
                });
                setIsEditing(false);
            }
        }
    }, [initialData, open, serviciosOpts]);

    useEffect(() => {
        if (open && !isEditing) {
            if (formHorario.servicio && consultoriosOpts.length > 0) {
                const selectedServiceId = getIdServiceFromName(formHorario.servicio);
                const availableConsultorios = consultoriosOpts.filter(c => c.cupsServicio === selectedServiceId);
                if (availableConsultorios.length > 0 && formHorario.consultorio === '') {
                    setFormHorario(prev => ({
                        ...prev,
                        consultorio: availableConsultorios[0].label
                    }));
                } else if (availableConsultorios.length === 0 && formHorario.consultorio !== '') {
                     setFormHorario(prev => ({
                        ...prev,
                        consultorio: ''
                    }));
                }
            }
        }
    }, [formHorario.servicio, consultoriosOpts, open, isEditing]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormHorario(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'servicio') {
                const servicioCups = getIdServiceFromName(value);
                const relatedConsultorios = consultoriosOpts.filter(c => c.idIps === servicioCups);
                newState.consultorio = relatedConsultorios.length > 0 ? relatedConsultorios[0].label : '';
            }
            return newState;
        });
    };

    const handleCheckboxChange = (dia, checked) => {
        setFormHorario(prev => {
            const newDias = prev.dias || [];
            const updatedDias = checked
                ? [...newDias, dia]
                : newDias.filter((d) => d !== dia);
            return { ...prev, dias: updatedDias };
        });
    };

    const handleSave = () => {
        if (!formHorario.dias || formHorario.dias.length === 0 || !formHorario.horaInicio || !formHorario.horaFin || !formHorario.servicio || !formHorario.consultorio) {
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
            horaInicio: '09:00',
            horaFin: '17:00',
            servicio: serviciosOpts.length > 0 ? serviciosOpts[0].label : '',
            consultorio: ''
        });
    }

    const consultoriosForSelectedServicio = useMemo(() => {
        const servicioCups = getIdServiceFromName(formHorario.servicio);
        if (!servicioCups) return [];
        return consultoriosOpts.filter(c => c.cupsServicio === servicioCups);
    }, [formHorario.servicio, consultoriosOpts]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                {isEditing ? 'Editar Horario' : 'Nuevo Horario'}
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} sx={{ pt: 2 }}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Días de atención</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {diasSemana.map((dia) => (
                                <Box key={dia} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                                    <Typography variant="caption">{dia}</Typography>
                                    <Checkbox
                                        checked={formHorario.dias?.includes(dia) || false}
                                        onChange={(e) => handleCheckboxChange(dia, e.target.checked)}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField name="horaInicio" label="Hora de inicio" type="time" fullWidth value={formHorario.horaInicio} onChange={handleChange} InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField name="horaFin" label="Hora de fin" type="time" fullWidth value={formHorario.horaFin} onChange={handleChange} InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="servicio-label">Servicio Médico</InputLabel>
                            <Select labelId="servicio-label" name="servicio" value={formHorario.servicio} label="Servicio Médico" onChange={handleChange}>
                                {serviciosOpts.map((s) => <MenuItem key={s.value} value={s.label}>{s.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    {formHorario.servicio && consultoriosForSelectedServicio.length > 0 && (
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="consultorio-label">Consultorio</InputLabel>
                                <Select labelId="consultorio-label" name="consultorio" value={formHorario.consultorio} label="Consultorio" onChange={handleChange}>
                                    {consultoriosForSelectedServicio.map((c) => <MenuItem key={c.value} value={c.label}>{c.label}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                     {formHorario.servicio && consultoriosForSelectedServicio.length === 0 && (
                        <Grid item xs={12} sm={6}>
                            <Alert severity="warning">No hay consultorios disponibles para este servicio.</Alert>
                        </Grid>
                    )}
                </Grid>
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


export default function HorarioModal({ open, onClose, dniMedico, ipsAdmin }) {
    const [horariosGuardados, setHorariosGuardados] = useState([]);
    const [editingHorario, setEditingHorario] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [serviciosOpts, setServiciosOpts] = useState([]);
    const [consultoriosOpts, setConsultoriosOpts] = useState([]);

    // Fetch all medical services
    useEffect(() => {
        if (open) {
            const doFetchServicios = async () => {
                try {
                    const { servicio } = await listaServiciosMedicos();
                    setServiciosOpts(servicio.map((s) => ({ label: s.nombre, value: s.cups })));
                } catch (e) {
                    console.error("Error cargando servicios:", e);
                    setError("Error cargando lista de servicios médicos.");
                }
            };
            doFetchServicios();
        }
    }, [open]);

    useEffect(() => {
        if (open && dniMedico) {
            const doFetchConsultorios = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const { consultorios } = await listarConsultorios();
                    
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
    }, [open, dniMedico]);

    const fetchTrabaja = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const dataFromService = await obtenerHorario(dniMedico);
            if (dataFromService) {
                const transformedHorarios = dataFromService.flatMap((trabaja, index) =>
                    trabaja.horario.map(h => ({
                        id: trabaja.id,
                        dniMedico: trabaja.dniMedico,
                        idIps: trabaja.idIps,
                        idConsultorio: trabaja.idConsultorio,
                        dia: backendToFrontendDayMap[h.dia.toUpperCase()] || h.dia,
                        _backendDia: h.dia.toUpperCase(),
                        horaInicio: h.inicio.substring(0, 5),
                        horaFin: h.fin.substring(0, 5),
                        servicio: getServicioNameFromIdConsultorio(trabaja.idConsultorio),
                        consultorio: getConsultorioNameFromId(trabaja.idConsultorio),
                        color: coloresBase[index % coloresBase.length]
                    }))
                );
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
    }, [dniMedico]);

    useEffect(() => {
        if (open) {
            fetchTrabaja();
        }
    }, [open, fetchTrabaja]);


    const handleOpenFormForNew = () => {
        setEditingHorario(null);
        setFormOpen(true);
    };

    const handleOpenFormForEdit = (horario) => {
        console.log('Editing horario:', horario);
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

        const idIps = getIdIPSFromConsultorio(getIdConsultorioFromName(formData.consultorio));
        const idConsultorio = getIdConsultorioFromName(formData.consultorio);

        if (idIps === null) {
            setError('Servicio no encontrado.');
            setIsLoading(false);
            return;
        }
        if (idConsultorio === null) {
            setError('Consultorio no encontrado.');
            setIsLoading(false);
            return;
        }

        try {
            if (isEditing && editingHorario) {
                const backendDay = frontendToBackendDayMap[formData.dias[0]];
                if (!backendDay) {
                    throw new Error(`Día no válido: ${formData.dias[0]}`);
                }
                const dataToUpdate = {
                    idConsultorio,
                    idIps,
                    horario: [{
                        dia: backendDay,
                        inicio: formData.horaInicio + ":00",
                        fin: formData.horaFin + ":00",
                    }]
                };
                console.log(editingHorario.id, dataToUpdate);
                await actualizarHorario(dniMedico, editingHorario.id, dataToUpdate);
            } else {
                for (const diaFrontend of formData.dias) {
                    const backendDay = frontendToBackendDayMap[diaFrontend];
                    if (!backendDay) {
                        throw new Error(`Día no válido: ${diaFrontend}`);
                    }
                    const dataToCreate = {
                        idConsultorio,
                        idIps,
                        horario: [{
                            dia: backendDay,
                            inicio: formData.horaInicio + ":00",
                            fin: formData.horaFin + ":00",
                        }]
                    };
                    console.log(dataToCreate)
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
            setIsLoading(true);
            setError(null);
            try {
                // TODO: Implement the actual delete API call here
                // await eliminarHorario(dniMedico, idToDelete);
                console.warn(`Funcionalidad de eliminar horario (ID: ${idToDelete}) no implementada con API. Realizando solo actualización optimista.`);
                setHorariosGuardados(prev => prev.filter(h => h.id !== idToDelete));
            } catch (err) {
                console.error('Error eliminando el horario:', err);
                setError(err.response?.data?.message || err.message || 'Error al eliminar el horario.');
            } finally {
                setIsLoading(false);
            }
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
            const diaH = h.dia;
            const horaInicioNum = parseInt(h.horaInicio.split(':')[0]);
            const horaFinNum = parseInt(h.horaFin.split(':')[0]);
            const horaCeldaNum = parseInt(hora.split(':')[0]);
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
                sx={{ p: 0, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, bgcolor: 'background.default', overflow: 'hidden' }}
            >
                <Box
                    sx={{ width: { xs: '100%', md: 320 }, p: 2, borderRight: { md: '1px solid' }, borderColor: { md: 'divider' }, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxHeight: { xs: '300px', md: 'calc(100vh - 160px)' } }}
                >
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Button variant="contained" color="primary" startIcon={<AddCircleOutline />} onClick={handleOpenFormForNew} fullWidth disabled={isLoading}>
                        Nuevo Horario
                    </Button>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'text.primary' }}>Horarios Guardados</Typography>
                    {isLoading && horariosGuardados.length === 0 && <Typography>Cargando horarios...</Typography>}
                    {!isLoading && horariosGuardados.length === 0 && !error && <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>No hay horarios guardados.</Typography>}

                    {horariosGuardados.length > 0 && (
                        <Box>
                            {horariosGuardados.map((h, index) => ( // Added index for a more unique key if id isn't always distinct
                                <Paper key={`${h.id}-${h._backendDia}-${index}`} // Composite key for uniqueness
                                    elevation={2}
                                    sx={{ p: 1.5, mb: 1.5, display: 'flex', flexDirection: 'column', borderLeft: `4px solid ${h.color || coloresBase[0]}`, bgcolor: '#ffffff' }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{h.dia}: {h.horaInicio} - {h.horaFin}</Typography>
                                    <Typography variant="body2" color="textSecondary">{h.servicio} - {h.consultorio}</Typography>
                                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Tooltip title="Editar">
                                            <IconButton size="small" onClick={() => handleOpenFormForEdit(h)} color="primary" disabled={isLoading}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton size="small" onClick={() => handleEliminarHorario(h.id)} color="error" disabled={isLoading}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </Box>
                <Box sx={{ flexGrow: 1, p: { xs: 1, md: 2 }, overflow: 'auto', maxHeight: 'calc(100vh - 160px)' }}>
                    <Table size="small" stickyHeader sx={{ borderCollapse: 'collapse', minWidth: 800 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd', width: '80px', backgroundColor: (theme) => theme.palette.grey[200], zIndex: 1, position: 'sticky', left: 0 }}>Hora</TableCell>
                                {diasSemana.map((dia) => (
                                    <TableCell key={dia} sx={{ fontWeight: 'bold', border: '1px solid #ddd', textAlign: 'center', backgroundColor: (theme) => theme.palette.grey[100] }}>{dia}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {horasDia.map((hora) => (
                                <TableRow key={hora} hover>
                                    <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'medium', color: 'text.secondary', position: 'sticky', left: 0, backgroundColor: (theme) => theme.palette.grey[200] }}>{hora}</TableCell>
                                    {diasSemana.map((dia) => {
                                        const cellData = obtenerDatosCelda(dia, hora);
                                        return (
                                            <Tooltip title={cellData?.tooltip || `Añadir horario para ${dia} a las ${hora}`} placement="top" key={`${dia}-${hora}`}>
                                                <TableCell
                                                    onClick={() => !isLoading && handleCeldaClick(dia, hora)}
                                                    sx={{
                                                        cursor: isLoading ? 'default' : 'pointer',
                                                        bgcolor: cellData?.color || '#f9f9f9',
                                                        border: '1px solid #ddd',
                                                        height: 40,
                                                        minWidth: 80,
                                                        transition: 'background-color 0.2s ease',
                                                        '&:hover': {
                                                            bgcolor: isLoading ? (cellData?.color || '#f9f9f9') : (cellData?.color ? `${cellData.color}E6` : '#e0e0e0'),
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