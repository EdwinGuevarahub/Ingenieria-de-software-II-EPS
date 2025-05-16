import { useEffect, useState } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import SearchFilter from '../../components/filters/SearchFilter';
import SelectFilter from '../../components/filters/SelectFilter';
import ExpandableTable from '../../components/list/ExpandableTable';
import { listIPS } from '@/../../src/services/ipsService';
import { listServicioMedico } from '@/../../src/services/medicalServiceService';


const ListaIPS = () => {
  const [ipsList, setIpsList] = useState([]);
  const [medicalServiceList, setMedicalServiceList] = useState([]);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [servicioFiltro, setServicioFiltro] = useState('');

  useEffect(() => {
    async function fetchIPS() {
      try {
        const data = await listIPS();
        setIpsList(data);
      } catch (error) {
        console.error('Error cargando las IPS:', error);
      }
    }

    fetchIPS();
  }, []);

  useEffect(() => {
    async function fetchServicioMedico() {
      try {
        const data = await listServicioMedico();
        setMedicalServiceList(data);
      } catch (error) {
        console.error('Error cargando los servicios médicos:', error);
      }
    }

    fetchServicioMedico();
  }, []);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' }
  ];

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

  const serviciosUnicos = [...new Set(medicalServiceList.map((i) => i.name))];

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
        columns={columns}
        data={ipsList}
        renderExpandedContent={renderExpandedContent}
      />

    </Box>
  );
};

export default ListaIPS;
