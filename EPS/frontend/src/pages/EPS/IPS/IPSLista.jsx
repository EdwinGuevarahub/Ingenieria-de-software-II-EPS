import { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Box,
  Pagination,
  Fab,
  Grid,
  Slide,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IPSFormulario from './IPSFormulario'
import SearchFilter from '../../../components/filters/SearchFilter';
import SelectFilter from '../../../components/filters/SelectFilter';
import ExpandableTable from '../../../components/list/ExpandableTable';
import IPSDetalleExpandido from './IPSDetalleExpandido';
import { useAuthContext } from '../../../contexts/AuthContext';
import { listarIPS, detallesIPS, crearIPS, actualizarIPS } from '@/../../src/services/ipsService';
import { listaServiciosMedicos, listaServiciosMedicosPorIPS } from '@/../../src/services/serviciosMedicosService';

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const IPSLista = () => {

  const { subEmail } = useAuthContext();

  // Estados
  const [editandoIPS, setEditandoIPS] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Sobre la tabla
  const [listaIPS, setListaIPS] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Filtros
  const [serviciosUnicos, setServiciosUnicos] = useState([]);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [servicioMedicoFiltro, setServicioMedicoFiltro] = useState('');

  // Snackbar state y funciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleMostrarFormulario = (ips = null) => {
    if (ips)
      setEditandoIPS(ips);
    else
      setEditandoIPS(null);

    setMostrarFormulario(true);
  }

  const handleOcultarFormulario = () => {
    setEditandoIPS(null);
    setMostrarFormulario(false);
  }

  const handleExpandedChange = (id, expanded) => {
    if (!expanded && editandoIPS)
      handleOcultarFormulario();
  }

  // Función para manejar el envío del formulario de IPS
  const handleSubmitIPS = async (ips) => {
    try {
      const datosEnviar = {
        email: ips.emailAdministrador,
        nombre: ips.nombreAdministrador,
        telefono: ips.telefonoAdministrador,
        password: ips.passwordAdministrador,
        ips: {
          nombre: ips.nombre,
          direccion: ips.direccion,
          telefono: ips.telefono,
          activo: true,
          imagen: ips.imagen,
          admEps: {
            email: subEmail,
          }
        }
      };

      if (editandoIPS && editandoIPS.id) {
        await actualizarIPS(ips);
        showMessage('IPS actualizada correctamente.', 'success');
      }
      else {
        await crearIPS(datosEnviar);
        showMessage('IPS guardada correctamente.', 'success');
      }
      await fetchIPS(pagina);
      handleOcultarFormulario();
    } catch (e) {
      //console.error('Error guardando IPS', e);
      showMessage('Error guardando la IPS.', 'error');
    }
  };

  // Función para cargar las IPS con los filtros aplicados
  const fetchIPS = useCallback(async (paginaActual = 1) => {
    try {
      const filtros = {
        qPage: paginaActual - 1,
        qSize: 10,
        nombre: nombreFiltro || undefined,
        telefono: undefined,
        direccion: undefined,
        fechaRegistro: undefined,
        nombreServicio: undefined,
        cupsServicioMedico: servicioMedicoFiltro || undefined,
        idConsultorioLike: undefined,
      };

      const { totalPaginas, ips } = await listarIPS(filtros);
      setListaIPS(ips);
      setTotalPaginas(totalPaginas);
    } catch (error) {
      showMessage('Error cargando las IPS.', 'error');
      //console.error('Error cargando las IPS:', error);
    }
  }, [nombreFiltro, servicioMedicoFiltro]);


  // Cargar los servicios médicos únicos al inicio
  useEffect(() => {
    const fetchServiciosMedicos = async () => {
      try {
        const { servicio } = await listaServiciosMedicos();
        const opciones = servicio.map((s) => ({
          label: s.nombre,
          value: s.cups,
        }));
        setServiciosUnicos(opciones);
      } catch (error) {
        //console.error('Error cargando los servicios médicos:', error);
        showMessage('Error cargando los servicios médicos.', 'error');
      }
    };

    fetchServiciosMedicos();

  }, []);

  useEffect(() => {
    fetchIPS(pagina);
  }, [pagina, fetchIPS]);

  return (
    <Box sx={{ width: '100%' }}>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} TransitionComponent={SlideTransition} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Typography variant="h4" gutterBottom>
        Lista de IPS
      </Typography>

      {/* Filtros */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid
          sx={{
            flexGrow: 1,
            flexBasis: 0,
            minWidth: '250px',
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Ingrese el código o el nombre de la IPS
          </Typography>

          <SearchFilter label="Buscar IPS" value={nombreFiltro} onChange={setNombreFiltro} />
        </Grid>
        <Grid
          sx={{
            flexGrow: 1,
            flexBasis: 0,
            minWidth: '250px',
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Servicio médico que ofrece la IPS
          </Typography>
          <SelectFilter
            placeholder="Todos"
            value={servicioMedicoFiltro}
            onChange={setServicioMedicoFiltro}
            options={serviciosUnicos}
          />
        </Grid>
      </Grid>

      {mostrarFormulario && !editandoIPS && (
        <IPSFormulario
          isNew
          onSubmit={handleSubmitIPS}
          onCancel={handleOcultarFormulario}
        />
      )}

      {/* Tabla */}
      <ExpandableTable
        columns={[{ key: 'id' }, { key: 'nombre' }]}
        data={listaIPS}
        rowKey="id"
        onExpandedChange={handleExpandedChange}
        fetchDetails={[
          (id) => detallesIPS(id),
          (id) => listaServiciosMedicosPorIPS(id)
        ]}
        renderExpandedContent={(detalle) => {
          if (mostrarFormulario && editandoIPS)
            return (
              <IPSFormulario
                initialData={editandoIPS}
                onSubmit={handleSubmitIPS}
                onCancel={handleOcultarFormulario}
              />
            );
          else {
            return (
              <IPSDetalleExpandido
                detalle={detalle}
                onEditar={handleMostrarFormulario}
              />
            );
          }
        }}
      />

      {/* Paginación */}
      <Pagination
        count={totalPaginas}
        page={pagina}
        onChange={(_, val) => setPagina(val)}
        sx={{ p: 2, display: 'flex', justifyContent: 'center' }}
        showFirstButton
        showLastButton
      />

      {/* Botón de vinculación */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={() => handleMostrarFormulario()}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default IPSLista;
