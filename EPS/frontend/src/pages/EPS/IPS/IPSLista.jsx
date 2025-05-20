import { useEffect, useState } from 'react';
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
import SearchFilter from '../../../components/filters/SearchFilter';
import SelectFilter from '../../../components/filters/SelectFilter';
import ExpandableTable from '../../../components/list/ExpandableTable';
import { listarIPS, detallesIPS } from '@/../../src/services/ipsService';
import { listaServiciosMedicos, listaServiciosMedicosPorIPS } from '@/../../src/services/serviciosMedicosService';


const IPSLista = () => {

  // Sobre la tabla
  const [listaIPS, setListaIPS] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Filtros
  const [serviciosUnicos, setServiciosUnicos] = useState([]);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [servicioMedicoFiltro, setServicioMedicoFiltro] = useState('');

  const fetchIPS = async (paginaActual) => {
    try {
      const filtros = {
        qPage: paginaActual - 1,
        qSize: 2,
        nombre: nombreFiltro || undefined,
        telefono: undefined,
        direccion: undefined,
        fechaRegistro: undefined,
        cupsServicioMedico: serviciosUnicos || undefined,
        idConsultorioLike: undefined,
      };

      const data = await listarIPS(filtros);
      setListaIPS(data);
    } catch (error) {
      console.error('Error cargando las IPS:', error);
    }
  };

  const fetchServiciosMedicos = async () => {
    try {
      const servicios = await listaServiciosMedicos();
      const opciones = servicios.map((s) => ({
        label: s.nombre,
        value: s.cups,
      }));
      setServiciosUnicos(opciones);
    } catch (error) {
      console.error('Error cargando los servicios médicos:', error);
    }
  };

  useEffect(() => {
    fetchIPS(pagina);
    fetchServiciosMedicos();
  }, [pagina, nombreFiltro, servicioMedicoFiltro]);

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
      
      {/* Tabla */}
      <ExpandableTable
        columns={[{ key: 'id' }, { key: 'nombre' }]}
        data={listaIPS}
        rowKey="id"
        fetchDetails={[
          (id) => detallesIPS(id),
          (id) => listaServiciosMedicosPorIPS(id)
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
              src="https://picsum.photos/300"
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
        onClick={() => {
          console.log("Vincular IPS")
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default IPSLista;
