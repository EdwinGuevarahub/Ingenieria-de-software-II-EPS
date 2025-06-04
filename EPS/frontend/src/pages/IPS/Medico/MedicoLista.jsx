import { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Box,
  Pagination,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Fab,
  TextField,
  Button,
  Slide,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { listarMedicos, detalleMedico, crearMedico, actualizarMedico } from '@/../../src/services/medicosService';
import { listaServiciosMedicosPorMedico, listaServiciosMedicosPorIPS } from '@/../../src/services/serviciosMedicosService';
import { agregarServiciosMedicosPorMedico } from '@/../../src/services/serviciosMedicosService';
import { obtenerConsultorio } from '@/../../src/services/consultorioService';
import { useIpsContext } from '@/../../src/contexts/UserIPSContext';
import MedicoDetalleExpandido from './MedicoDetalleExpandido';
import MedicoFormulario from './MedicoFormulario';
import Horario from '@/../../src/pages/IPS/Horario/Horario';
import ExpandableTable from '../../../components/list/ExpandableTable';
import SearchFilter from '../../../components/filters/SearchFilter';
import SelectFilter from '../../../components/filters/SelectFilter';

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

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
  const [estadoFiltro, setEstadoFiltro] = useState(true);

  // Para evitar que los filtros se borren al cambiar la página
  const [filtrosAplicados, setFiltrosAplicados] = useState({});

  // Snackbar state y funciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

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
    if (!expanded && editandoMedico)
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
        //  Modo edición
        await actualizarMedico(medicoPayload);
        showMessage('Médico actualizado correctamente.', 'success');
      } else {
        //  Modo creación
        if (!dataMedico.initialSchedule) {
          showMessage('Falta información del horario inicial para crear el médico.', 'error');
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
          //console.error('Error creando el médico. Respuesta inválida:', respuesta);
          showMessage('Error creando el médico. Por favor, intente nuevamente.', 'error');
          return;
        }

        showMessage('Médico creado correctamente.', 'success');

        // Agregar servicios médicos al médico recién creado
        try {
          if (dataMedico.dni && idConsultorio) {
            const consultorio = await obtenerConsultorio(ips.id, idConsultorio);

            if (!consultorio) {
              showMessage('Consultorio no encontrado.', 'error');
              return;
            }

            if (!consultorio.cupsServicioMedico || consultorio.cupsServicioMedico.length === 0) {
              showMessage('El consultorio no tiene servicios médicos asociados.', 'warning');
              return;
            }

            await agregarServiciosMedicosPorMedico(dataMedico.dni, consultorio.cupsServicioMedico);
            showMessage('Servicios médicos agregados al médico correctamente.', 'success');
          } else {
            //console.error('Faltan datos requeridos: DNI o ID del consultorio');
            showMessage('Faltan datos requeridos: DNI o ID del consultorio.', 'error');
          }
        } catch (error) {
          showMessage('Error agregando servicio al médico.', 'error');
          //  console.error('Error agregando servicio al médico:', error);
        }
      }

      await fetchMedicos(pagina, filtrosAplicados);
      handleOcultarFormulario();
    } catch (e) {
      showMessage('Error guardando médico. Por favor, intente nuevamente.', 'error');
      //console.error('Error guardando médico:', e);
    }
  };


  const fetchMedicos = useCallback(
    async (paginaActual, filtrosExtras = {}) => {
      try {
        const filtros = {
          qPage: paginaActual - 1,
          qSize: 10,
          idIps: ips.id,
          dniNombreLike: nombreFiltro || undefined,
          ...filtrosExtras,
        };
        const { totalPaginas, medicos } = await listarMedicos(filtros);
        setListaMedicos(medicos);
        setTotalPaginas(totalPaginas);
      } catch (error) {
        showMessage('Error cargando los médicos.', 'error');
        //console.error('Error cargando los médicos:', error);
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
        showMessage('Error cargando los servicios médicos.', 'error');
        //console.error('Error cargando los servicios médicos:', error);
      }
    };

    fetchServiciosMedicos();
  }, [ips]);

  // Obtener el cambio del estado
  const handleChange = (event) => {
    setEstadoFiltro(event.target.checked);
  };

  useEffect(() => {
    fetchMedicos(pagina, filtrosAplicados);
  }, [pagina, filtrosAplicados, fetchMedicos]);

  return (
    <Box sx={{ display: 'flex', gap: 4, }}>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} TransitionComponent={SlideTransition} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
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

        <Box>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={estadoFiltro}
                  onChange={handleChange}
                />}
              label="Mostrar médicos activos"
            />
          </FormGroup>
        </Box>

        <Button
          variant="red"
          onClick={() => {
            const nuevosFiltros = {
              cupsServicioMedico: servicioMedicoFiltro || undefined,
              diaSemanaIngles: diaFiltro || undefined,
              horaDeInicio: horaInicioFiltro || undefined,
              horaDeFin: horaFinalFiltro || undefined,
              estaActivo: estadoFiltro,
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
                <MedicoDetalleExpandido
                  detalle={detalle}
                  onEditar={handleMostrarFormulario}
                  setEditandoMedico={setEditandoMedico}
                  setModalHorarioAbierto={setModalHorarioAbierto}
                />
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
