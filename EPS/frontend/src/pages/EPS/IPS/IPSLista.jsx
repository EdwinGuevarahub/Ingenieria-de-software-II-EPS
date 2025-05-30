import { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Box,
  Pagination,
  Chip,
  Fab,
  Button,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IPSFormulario from './IPSFormulario'
import SearchFilter from '../../../components/filters/SearchFilter';
import SelectFilter from '../../../components/filters/SelectFilter';
import ExpandableTable from '../../../components/list/ExpandableTable';
import { useAuthContext } from '../../../contexts/AuthContext';
import { listarIPS, detallesIPS, crearIPS, actualizarIPS } from '@/../../src/services/ipsService';
import { listaServiciosMedicos, listaServiciosMedicosPorIPS } from '@/../../src/services/serviciosMedicosService';


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
    if (!expanded)
      handleOcultarFormulario();
  }

  const handleSubmitIPS = async (ips) => {
    try {
      const datosEnviar = {
        nombre: ips.nombre,
        direccion: ips.direccion,
        telefono: ips.telefono,
        activo: ips.activo,
        imagen: ips.imagen,
        admEps: {
          email: subEmail,
        },
      };

      if (editandoIPS && editandoIPS.id)
        await actualizarIPS(ips);
      else
        await crearIPS(datosEnviar);
        
      await fetchIPS(pagina);
      handleOcultarFormulario();
    } catch (e) {
      console.error('Error guardando IPS', e);
    }
  };

  const fetchIPS = useCallback( async (paginaActual = 1) => {
    try {
      const filtros = {
        qPage: paginaActual - 1,
        qSize: 2,
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
      console.error('Error cargando las IPS:', error);
    }
  }, [nombreFiltro, servicioMedicoFiltro]);


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
        console.error('Error cargando los servicios médicos:', error);
      }
    };

    fetchServiciosMedicos();

  }, []);

  useEffect(() => {
    fetchIPS(pagina);
  }, [pagina, fetchIPS]);



  return (
    <Box sx={{ width: '100%' }}>
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
            )
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
                  alt="IPS"
                  sx={{ width: 150, height: 125, borderRadius: 2, objectFit: 'cover' }}
                />
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography variant="h6">{detalle[0].nombre}</Typography>
                  <Typography variant="body2">ID: {detalle[0].id}</Typography>
                  <Typography variant="body2">Dirección: {detalle[0].direccion}</Typography>
                  <Typography variant="body2">Teléfono: {detalle[0].telefono}</Typography>
                  <Typography variant="body2">Fecha de creación: {detalle[0].fechaRegistro}</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <button style={{ background: '#e53935', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4 }}>Desvincular</button>
                  <Button
                    variant="outlined"
                    onClick={() => handleMostrarFormulario(detalle[0])}
                  >
                    Editar
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
