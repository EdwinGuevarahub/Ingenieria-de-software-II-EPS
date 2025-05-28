import { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Box,
  Pagination,
  Chip,
  TextField,
  Button,
} from '@mui/material';

import { listarAgendaMedico, detalleAgenda } from '@/../../src/services/agendaService';
import { listaServiciosMedicos } from '@/../../src/services/serviciosMedicosService';
import ExpandableTable from '../../components/list/ExpandableTable';
import SearchFilter from '../../components/filters/SearchFilter';
import SelectFilter from '../../components/filters/SelectFilter';

const AgendaListaMedico = () => {
    // Sobre la tabla
    const [listaAgendas, setListaAgendas] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // Filtros
    const [nombreFiltro, setNombreFiltro] = useState('');
    const [servicioMedicoFiltro, setServicioMedicoFiltro] = useState('');
    const [serviciosUnicos, setServiciosUnicos] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState('');
    const [horaInicioFiltro, setHoraInicioFiltro] = useState('');
    const [horaFinalFiltro, setHoraFinFiltro] = useState('');

    // Evitar que los filtros se borren al cambiar la página
    const [filtrosAplicados, setFiltrosAplicados] = useState({});

    const fetchAgendas = useCallback(
        async (paginaActual, filtrosExtras = {}) => {
            try {
                const filtros = {
                    qPage: paginaActual - 1,
                    qSize: 10,
                    dniNombrePacienteLike: nombreFiltro || undefined,
                    ...filtrosExtras
                };
                const { totalPaginas, agendas } = await listarAgendaMedico(filtros);
                setListaAgendas(agendas);
                setTotalPaginas(totalPaginas);
            } catch (error) {
                console.error('Error al cargar las agendas:', error);
            }
        },
        [nombreFiltro]
    );

    const fetchServiciosMedicos = async () => {
        try {
            const { servicio } = await listaServiciosMedicos();
            const opciones = servicio.map((s) => ({
                label: s.nombre,
                value: s.cups,
            }));
            setServiciosUnicos(opciones);
        } catch (error) {
            console.error('Error al cargar los servicios médicos:', error);
        }
    };

    useEffect(() => {
        fetchAgendas(pagina, filtrosAplicados);
    }, [pagina, filtrosAplicados, fetchAgendas]);

    useEffect(() => {
        fetchServiciosMedicos();
    }, []);

    return (
        <Box sx={{ display: 'flex', gap: 4 }}>
            {/* Panel de filtros */}
            <Box
                sx={{
                    width: 300,
                    bgcolor: 'trnasparent',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    position: 'sticky',
                    top: 100,
                    height: 'fit-content',
                }}
            >
                <Typography variant='h6'>Filtros</Typography>

                <Box>
                    <Typography variant="subtitle1">Servicio médico</Typography>
                    <SelectFilter
                        placeholder="Todos"
                        value={servicioMedicoFiltro}
                        onChange={setServicioMedicoFiltro}
                        options={serviciosUnicos}
                    />
                </Box>

                <Box>
                    <Typography variant="subtitle1">Fecha</Typography>
                    <TextField
                        label="Día"
                        value={fechaFiltro}
                        onChange={(e) => setFechaFiltro(e.target.value)}
                        size="small"
                    />
                    {/*TODO: Incluir selector de fecha
                    <DatePicker
                        label="Escoja una fecha"
                        value = {fechaFiltro}
                        onChange={setFechaFiltro}
                    />*/}
                </Box>

                <Box>
                    <Typography variant="subtitle1">Horario</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                            label="Inicio"
                            value={horaInicioFiltro}
                            onChange={(e) => setHoraInicioFiltro(e.target.value)}
                            size="small"
                        />
                        <Typography variant="body1" sx={{ mx: 1 }}>
                            -
                        </Typography>
                        <TextField
                            label="Final"
                            value={horaFinalFiltro}
                            onChange={(e) => setHoraFinFiltro(e.target.value)}
                            size="small"
                        />
                    </Box>
                </Box>

                <Button
                    variant="red"
                    onClick={() => {
                        const nuevosFiltros = {
                            cupsServicioMedico: servicioMedicoFiltro || undefined,
                            fecha: fechaFiltro || undefined,
                            horaDeInicio: horaInicioFiltro || undefined,
                            hordaDeFin: horaFinalFiltro || undefined,
                        };
                        setFiltrosAplicados(nuevosFiltros);
                        setPagina(1);
                    }}
                >
                    Buscar
                </Button>
            </Box>

            {/* Contenido principal */}
            <Box sx={{ flex:1 }}>
                <Typography variant="h4" gutterBottom>
                    Lista de Citas
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Ingrese el código o el nombre del paciente.
                    </Typography>
                    <SearchFilter
                        label="Buscar paciente"
                        value={nombreFiltro}
                        onChange={setNombreFiltro}
                    />
                </Box>

                <ExpandableTable
                    columns={[
                        { key: 'fecha' },
                        { key: 'horaInicio' },
                        { key: 'idConsultorio' },
                        { key: 'nombreServicioMedico' },
                        { key: 'nombrePaciente' }
                    ]}
                    data={listaAgendas}
                    rowKey="id"
                    fetchDetails={[ (id) => detalleAgenda(id) ]}
                    renderExpandedContent={(detalle) => (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                padding: 2,
                                borderRadius: 2,
                                gap: 2,
                                flexWrap: 'wrap',
                                width: '100%'
                            }}
                        >
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Typography variant="h6">
                                    Consultorio {detalle[0].trabaja.consultorio.id.idConsultorio}
                                </Typography>
                                <Typography variant="body2">
                                    Cita con: {detalle[0].paciente.nombre}
                                </Typography>
                                <Typography variant="body2">
                                    {new Date(detalle[0].fecha).toLocaleString("es-CO")}
                                </Typography>
                                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    <Chip
                                        key={detalle[0].trabaja.consultorio.servicioMedico.id}
                                        label={detalle[0].trabaja.consultorio.servicioMedico.nombre}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                        </Box>
                    )}
                />

                
                <Pagination
                    count={totalPaginas}
                    page={pagina}
                    onChange={(_, val) => setPagina(val)}
                    sx={{ p: 2, display: 'flex', justifyContent: 'center' }}
                    showFirstButton
                    showLastButton
                />
                
            </Box>
        </Box>
    );

};

export default AgendaListaMedico;
