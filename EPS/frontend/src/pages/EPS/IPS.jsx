import { useEffect, useState } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { getIPS } from '../../services/ipsService';
import SearchFilter from '../../components/filters/SearchFilter';
import SelectFilter from '../../components/filters/SelectFilter';
import ExpandableTable from '../../components/list/ExpandableTable';

const ListaIPS = () => {
  const [ipsList, setIpsList] = useState([]);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [servicioFiltro, setServicioFiltro] = useState('');

  useEffect(() => {
    getIPS().then(setIpsList);
  }, []);

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'servicio', label: 'Servicio' }
  ];

  const renderExpandedContent = (row) => (
    <div>
      <strong>Información adicional:</strong>
      <p>ID: {row.id}</p>
      <p>Servicio que presta: {row.servicio}</p>
    </div>
  );

  const serviciosUnicos = [...new Set(ipsList.map((i) => i.servicio))];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Lista de IPS
      </Typography>

      <Grid container spacing={2} sx={{ width: '100%', mb: 3 }}>
        <Grid
          item
          sx={{
            flexGrow: 1,
            flexBasis: 0,
            minWidth: '250px',
          }}
        >
          <SearchFilter label="Buscar por nombre" value={nombreFiltro} onChange={setNombreFiltro} />
        </Grid>
        <Grid
          item
          sx={{
            flexGrow: 1,
            flexBasis: 0,
            minWidth: '250px',
          }}
        >
          <SelectFilter
            label="Servicio Médico"
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
