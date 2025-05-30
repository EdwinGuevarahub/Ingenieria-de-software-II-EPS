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
import { listaServiciosMedicosPorMedico, listaServiciosMedicos } from '@/../../src/services/serviciosMedicosService';
import MedicoFormulario from './MedicoFormulario';
import Horario from '@/../../src/pages/IPS/Horario/Horario';
import ExpandableTable from '../../../components/list/ExpandableTable';
import SearchFilter from '../../../components/filters/SearchFilter';
import SelectFilter from '../../../components/filters/SelectFilter';

const MedicoLista = () => {

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

  const handleSubmitMedico = async (medico) => {
    try {
      medico.imagen = medico.imagen.substring(medico.imagen.indexOf(",") + 1);
      const datosEnviar = {
        "medico": {
          "dni": medico.dni,
          "nombre": medico.nombre,
          "email": medico.email,
          "password": medico.password,
          "telefono": medico.telefono,
          "imagen": medico.imagen,
          "activo": true
        },
        "consultorio": {
          "id": {
            "ips": {
              "id": 1
            },
            "idConsultorio": 101
          }
        },
        "horario": [
          {
            "dia": "MONDAY",
            "inicio": "12:00:00",
            "fin": "14:00:00"
          }
        ]
      };
      if (editandoMedico && editandoMedico.dni) {
        await actualizarMedico(medico);
      } else {
        await crearMedico(datosEnviar);
      }
      await fetchMedicos(1, filtrosAplicados);
      setMostrarFormulario(false);
      setEditandoMedico(null);
    } catch (e) {
      console.error('Error guardando médico', e);
    }
  };

  const fetchMedicos = useCallback(
    async (paginaActual, filtrosExtras = {}) => {
      try {
        const filtros = {
          qPage: paginaActual - 1,
          qSize: 2,
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
      console.error('Error cargando los servicios médicos:', error);
    }
  };

  useEffect(() => {
    fetchMedicos(pagina, filtrosAplicados);
  }, [pagina, filtrosAplicados, fetchMedicos]);

  useEffect(() => {
    fetchServiciosMedicos();
  }, []);

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
            setPagina(1);
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

        {mostrarFormulario && (
          <MedicoFormulario
            initialData={editandoMedico}
            onSubmit={handleSubmitMedico}
            onCancel={() => {
              setMostrarFormulario(false);
              setEditandoMedico(null);
            }}
          />
        )}

        <ExpandableTable
          columns={[{ key: 'dni' }, { key: 'nombre' }]}
          data={listaMedicos}
          rowKey="dni"
          fetchDetails={[
            (dni) => detalleMedico(dni),
            (dni) => listaServiciosMedicosPorMedico(dni)
          ]}
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
                  onClick={() => {
                    setEditandoMedico(detalle[0]);
                    setMostrarFormulario(true);
                  }}
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
        />
      )}
    </Box >
  );
};

export default MedicoLista;
