import { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Pagination,
  Chip,
  Fab,
  Button,
} from '@mui/material';
import SearchFilter from '../../../components/filters/SearchFilter';
import SelectFilter from '../../../components/filters/SelectFilter';
import ExpandableTable from '../../../components/list/ExpandableTable';
import { listarIPS } from '@/../../src/services/ipsService';


const IPSLista = () => {
  const [listaIPS, setListaIPS] = useState([]);
  const [servicioMedicoLista, setServicioMedicoLista] = useState([]);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [servicioFiltro, setServicioFiltro] = useState('');

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    async function fetchIPS() {
      try {
        const data = await listarIPS(pagina - 1, 2);
        setListaIPS(data);
        setTotalPaginas(totalPaginas);
      } catch (error) {
        console.error('Error cargando las IPS:', error);
      }
    }

    fetchIPS();
  }, [pagina]);

  const renderExpandedContent = (row) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
        borderRadius: 2,
        gap: 2,
      }}
    >
      {/* Imagen izquierda */}
      <Box
        component="img"
        src="https://picsum.photos/300"
        alt="IPS"
        sx={{ width: 150, height: 125, borderRadius: 2, objectFit: 'cover' }}
      />

      {/* Información */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6">{row.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          ID: {row.id}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Dirección: {row.address}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Teléfono: {row.phone}
        </Typography>
      </Box>

      {/* Botones */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <button style={{ background: '#e53935', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4 }}>Desvincular</button>
        <button style={{ background: '#fb8c00', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4 }}>Modificar</button>
        <button style={{ background: '#1e88e5', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4 }}>Cerrar</button>
      </Box>
    </Box>
  );

  const serviciosUnicos = Array.isArray(servicioMedicoLista)
    ? [...new Set(servicioMedicoLista.map((i) => i.name))]
    : [];

  const handleChange = (_, value) => {
    setPagina(value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Lista de IPS
      </Typography>

      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid
          item
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
          item
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
            value={servicioFiltro}
            onChange={setServicioFiltro}
            options={serviciosUnicos}
          />
        </Grid>
      </Grid>

      <ExpandableTable
        columns={[{ key: 'id' }, { key: 'nombre' }]}
        data={listaIPS}
        renderExpandedContent={renderExpandedContent}
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
  );
};

export default IPSLista;
