import {
  Typography, Box, Container, Grid, Card, CardContent, CardMedia
} from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import { useIpsContext } from '../../contexts/UserIPSContext';

const services = [
  {
    title: 'Citas médicas',
    image: '/images/citas-medicas.jpg',
    description: 'Agenda y gestiona tus consultas con médicos generales y especialistas de forma rápida y segura.',
  },
  {
    title: 'Exámenes',
    image: '/images/examenes.jpg',
    description: 'Solicita y consulta tus exámenes diagnósticos con cobertura en nuestra red de prestadores.',
  },
  {
    title: 'Laboratorios',
    image: '/images/laboratorios.jpg',
    description: 'Accede a servicios de laboratorio clínico para apoyar el diagnóstico y seguimiento de tu salud.',
  },
];

const Home = () => {
  const { ips } = useIpsContext();

  return (
    <Box>
      <Box sx={{ bgcolor: 'secondary.main', position: 'relative', overflow: 'visible' }}>
        <Grid container alignItems="center">
          <Grid size={{ xs: 6, md: 4 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box
              component="img"
              src={ips ? `data:image/png;base64,${ips.imagen}` : ''}
              alt={ips ? ips.nombre : 'No disponible'}
              sx={{
                width: '100%',
                maxHeight: 500,
                position: 'relative',
                bottom: -20,
                zIndex: 2,
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 8 }} sx={{ textAlign: { xs: 'center', md: 'right' }, pr: { md: 6 } }}>
            <Typography variant="h3" gutterBottom>
              Administrando <b>{ips ? ips.nombre : ''}</b>
            </Typography>
            <Typography variant="body1">
              En este espacio podrá gestionar los los médicos y consultorios de su IPS registrados en <b>ApexEPS</b>.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Services */}
      <Box sx={{ py: 8, backgroundColor: '#fff' }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            <SpaIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Nuestros servicios
          </Typography>
          <Grid container spacing={4} mt={4}>
            {services.map((service, index) => (
              <Grid columnspan={{ xs: 12, sm: 6, md: 6 }} size="grow" key={index}>
                <Card elevation={3}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={service.image}
                    alt={service.title}
                  />
                  <CardContent>
                    <Typography variant="h6">{service.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#222', color: 'white', py: 4 }}>
        <Container>
          <Typography variant="body2" align="center">
            © 2024 ApexEPS. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box >
  );
};

export default Home;
