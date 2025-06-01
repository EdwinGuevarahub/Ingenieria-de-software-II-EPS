import { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Box,
  Pagination,
  Chip,
  Fab,
  TextField,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { listarMedicos, detalleMedico, crearMedico, actualizarMedico } from '@/../../src/services/medicosService';
import { listaServiciosMedicosPorMedico, listaServiciosMedicosPorIPS } from '@/../../src/services/serviciosMedicosService';
import { agregarServiciosMedicosPorMedico } from '@/../../src/services/serviciosMedicosService';
import { obtenerConsultorio } from '@/../../src/services/consultorioService';
import { useIpsContext } from '@/../../src/contexts/UserIPSContext';
import MedicoFormulario from './MedicoFormulario';
import Horario from '@/../../src/pages/IPS/Horario/Horario';
import ExpandableTable from '../../../components/list/ExpandableTable';
import SearchFilter from '../../../components/filters/SearchFilter';
import SelectFilter from '../../../components/filters/SelectFilter';

const MedicoLista = () => {

  // Autentificación de ips
  const { ips } = useIpsContext();

  // Estados
  const [editandoMedico, setEditandoMedico] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modalHorarioAbierto, setModalHorarioAbierto] = useState(false);

  // Sobre la tabla
  const [listaMedicos, setListaMedicos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Filtros
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [servicioMedicoFiltro, setServicioMedicoFiltro] = useState('');
  const [serviciosUnicos, setServiciosUnicos] = useState([]);
  const [diaFiltro, setDiaFiltro] = useState('');
  const [horaInicioFiltro, setHoraInicioFiltro] = useState('');
  const [horaFinalFiltro, setHoraFinalFiltro] = useState('');

  // Para evitar que los filtros se borren al cambiar la página
  const [filtrosAplicados, setFiltrosAplicados] = useState({});

  const diasSemana = [
    { label: 'Lunes', value: 'MONDAY' },
    { label: 'Martes', value: 'TUESDAY' },
    { label: 'Miércoles', value: 'WEDNESDAY' },
    { label: 'Jueves', value: 'THURSDAY' },
    { label: 'Viernes', value: 'FRIDAY' },
    { label: 'Sábado', value: 'SATURDAY' },
    { label: 'Domingo', value: 'SUNDAY' },
  ];

  // Funciones para manejar el formulario

  const handleMostrarFormulario = (medico = null) => {
    if (medico)
      setEditandoMedico(medico);
    else
      setEditandoMedico(null);

    setMostrarFormulario(true);
  }

  const handleOcultarFormulario = () => {
    setEditandoMedico(null);
    setMostrarFormulario(false);
  }

  const handleExpandedChange = (id, expanded) => {
    if (!expanded)
      handleOcultarFormulario();
  }

  const handleSubmitMedico = async (dataMedico) => {
    try {
      const medicoPayload = {
        dni: dataMedico.dni,
        nombre: dataMedico.nombre,
        email: dataMedico.email,
        password: dataMedico.password,
        telefono: dataMedico.telefono,
        imagen: dataMedico.imagen,
        activo: true,
      };

      if (editandoMedico && editandoMedico.dni) {
        // 🛠️ Modo edición
        await actualizarMedico(medicoPayload);
      } else {
        // 🛠️ Modo creación
        if (!dataMedico.initialSchedule) {
          console.error('Error: Falta información del horario inicial para crear el médico.');
          return;
        }

        const { dias, horaInicio, horaFin, idConsultorio, idIpsConsultorio } = dataMedico.initialSchedule;

        const horarioParaBackend = dias.map((dia) => ({
          dia: dia,
          inicio: horaInicio,
          fin: horaFin,
        }));

        const datosEnviar = {
          medico: medicoPayload,
          consultorio: {
            id: {
              ips: {
                id: idIpsConsultorio,
              },
              idConsultorio: idConsultorio,
            },
          },
          horario: horarioParaBackend,
        };

        const respuesta = await crearMedico(datosEnviar);

        if (!respuesta || respuesta.error) {
          console.error('Error creando el médico. Respuesta inválida:', respuesta);
          return;
        }

        // Agregar servicios médicos al médico recién creado
        try {
          console.log('Agregando servicios médicos al médico:', dataMedico.dni, idConsultorio);
          if (dataMedico.dni && idConsultorio) {
            const consultorio = await obtenerConsultorio(ips.id, idConsultorio);

            if (!consultorio) {
              console.error('Consultorio no encontrado');
              return;
            }

            if (!consultorio.cupsServicioMedico || consultorio.cupsServicioMedico.length === 0) {
              console.error('El consultorio no tiene servicios médicos asociados.');
              return;
            }

            await agregarServiciosMedicosPorMedico(dataMedico.dni, consultorio.cupsServicioMedico);
          } else {
            console.error('Faltan datos requeridos: DNI o ID del consultorio');
          }
        } catch (error) {
          console.error('Error agregando servicio al médico:', error);
        }
      }

      await fetchMedicos(pagina, filtrosAplicados);
      handleOcultarFormulario();
    } catch (e) {
      console.error('Error guardando médico:', e);
    }
  };


  const fetchMedicos = useCallback(
    async (paginaActual, filtrosExtras = {}) => {
      try {
        const filtros = {
          qPage: paginaActual - 1,
          qSize: 2,
          idIps: ips.id,
          dniNombreLike: nombreFiltro || undefined,
          ...filtrosExtras,
          estaActivo: true,
        };
        const { totalPaginas, medicos } = await listarMedicos(filtros);
        setListaMedicos(medicos);
        setTotalPaginas(totalPaginas);
      } catch (error) {
        console.error('Error cargando los médicos:', error);
      }
    },
    [nombreFiltro, ips]
  );

  useEffect(() => {
    const fetchServiciosMedicos = async () => {
      try {
        const servicio = await listaServiciosMedicosPorIPS(ips.id);
        const opciones = servicio.map((s) => ({
          label: s.nombre,
          value: s.cups,
        }));
        setServiciosUnicos(opciones);
      } catch (error) {
        console.error('Error cargando los servicios médicos:', error);
      }
    };

    fetchServiciosMedicos();
  }, [ips]);


  useEffect(() => {
    fetchMedicos(pagina, filtrosAplicados);
  }, [pagina, filtrosAplicados, fetchMedicos]);

  return (
    <Box sx={{ display: 'flex', gap: 4, }}>
      {/* Panel de filtros */}
      <Box
        sx={{
          width: 300,
          bgcolor: 'transparent',
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
        <Typography variant="h6">Filtros</Typography>

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
          <Typography variant="subtitle1">Día</Typography>
          <SelectFilter
            placeholder="Todos"
            value={diaFiltro}
            onChange={setDiaFiltro}
            options={diasSemana}
          />
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
            <Typography variant="body1" sx={{ mx: 1 }}>–</Typography>
            <TextField
              label="Final"
              value={horaFinalFiltro}
              onChange={(e) => setHoraFinalFiltro(e.target.value)}
              size="small"
            />
          </Box>
        </Box>

        <Button
          variant="red"
          onClick={() => {
            const nuevosFiltros = {
              cupsServicioMedico: servicioMedicoFiltro || undefined,
              diaSemanaIngles: diaFiltro || undefined,
              horaDeInicio: horaInicioFiltro || undefined,
              horaDeFin: horaFinalFiltro || undefined,
            };
            setFiltrosAplicados(nuevosFiltros);
            setPagina(pagina);
          }}
        >
          Buscar
        </Button>

      </Box>

      {/* Contenido principal */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          Lista de Médicos
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Ingrese el código o el nombre del médico
          </Typography>
          <SearchFilter
            label="Buscar médico"
            value={nombreFiltro}
            onChange={setNombreFiltro}
          />
        </Box>

        {mostrarFormulario && !editandoMedico && (
          <MedicoFormulario
            onSubmit={handleSubmitMedico}
            onCancel={handleOcultarFormulario}
          />
        )}

        <ExpandableTable
          columns={[{ key: 'dni' }, { key: 'nombre' }]}
          data={listaMedicos}
          rowKey="dni"
          onExpandedChange={handleExpandedChange}
          fetchDetails={[
            (dni) => detalleMedico(dni),
            (dni) => listaServiciosMedicosPorMedico(dni)
          ]}
          renderExpandedContent={(detalle) => {
            if (mostrarFormulario && editandoMedico)
              return (
                <MedicoFormulario
                  initialData={editandoMedico}
                  onSubmit={handleSubmitMedico}
                  onCancel={handleOcultarFormulario}
                />
              );
            else
              return (
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
                  }}
                >
                  <Box
                    component="img"
                    src={`data:image/png;base64,${detalle[0].imagen}`}
                    alt="Médico"
                    sx={{ width: 150, height: 125, borderRadius: 2, objectFit: 'cover' }}
                  />
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="h6">{detalle[0].nombre}</Typography>
                    <Typography variant="body2">ID: {detalle[0].dni}</Typography>
                    <Typography variant="body2">Correo: {detalle[0].email}</Typography>
                    <Typography variant="body2">Teléfono: {detalle[0].telefono}</Typography>
                    <Typography variant="body2">
                      Estado: {detalle[0].activo ? 'Activo' : 'Inactivo'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <button style={{ background: '#e53935', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4 }}>Desvincular</button>
                    <Button
                      variant="outlined"
                      onClick={() => handleMostrarFormulario(detalle[0])}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setEditandoMedico(detalle[0]);
                        setModalHorarioAbierto(true);
                      }}
                    >
                      Horario
                    </Button>
                  </Box>

                  <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Array.isArray(detalle[1]) && detalle[1].length > 0 ? (
                      detalle[1].map((servicio, idx) => (
                        <Chip key={idx} label={servicio.nombre} color="primary" variant="outlined" />
                      ))
                    ) : (
                      <Chip label="Sin servicios" color="default" variant="outlined" />
                    )}
                  </Box>
                </Box>
              )
          }}
        />

        <Pagination
          count={totalPaginas}
          page={pagina}
          onChange={(_, val) => setPagina(val)}
          sx={{ p: 2, display: 'flex', justifyContent: 'center' }}
          showFirstButton
          showLastButton
        />

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
          onClick={() => {
            setMostrarFormulario(true);
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

      {editandoMedico && (
        <Horario
          open={modalHorarioAbierto}
          onClose={() => setModalHorarioAbierto(false)}
          dniMedico={editandoMedico.dni}
          ipsAdmin={ips}
        />
      )}
    </Box >
  );
};

export default MedicoLista;
