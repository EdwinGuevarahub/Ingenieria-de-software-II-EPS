import {useEffect, useState} from 'react';
import {
  Typography, Box, Container, Grid, Card, CardContent, CardMedia
} from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import Doctor from '../../assets/Images/Banner.png';
import Citas from '../../assets/Images/Cita.jpg';
import Examen from '../../assets/Images/Examen.jpg';
import Laboratorio from '../../assets/Images/Laboratorio.jpg';
import { useAuthContext } from '../../contexts/AuthContext';

const services = [
  {
    title: 'Citas médicas',
    image: Citas,
    description: 'Agenda y gestiona tus consultas con médicos y especialistas de forma rápida y segura.',
  },
  {
    title: 'Exámenes',
    image: Examen,
    description: 'Solicita y consulta tus exámenes diagnósticos con cobertura en nuestra red de prestadores.',
  },
  {
    title: 'Laboratorios',
    image: Laboratorio,
    description: 'Accede a servicios de laboratorio clínico para apoyar el diagnóstico y seguimiento de tu salud.',
  },
];

const Home = () => {
  const { isLogged, subEmail, role } = useAuthContext();
  const logged = isLogged();

  const [ isAuthLoading, setIsAuthLoading ] = useState(true);
  const [ willRedirect, setWillRedirect ] = useState(true);

  // Redirigir si el usuario no está logueado o no es un administrador de EPS.
  useEffect(() => {
    if (logged === false || role)
      setIsAuthLoading(false);
    else
      return;

    if (logged && role === 'ADM_EPS')
      setWillRedirect(false);
    else
      window.location.href = '/';

  }, [logged, role]);

  if (isAuthLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Cargando...</Typography>
      </Box>
    );
  }

  if (willRedirect)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Redirigiendo...</Typography>
      </Box>
    )

  return (
    <Box>
      <Box sx={{ bgcolor: '#f9f5ef', position: 'relative', overflow: 'visible' }}>
        <Grid container alignItems="center">
          <Grid size={{ xs: 6, md: 4 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box
              component="img"
              src={Doctor}
              alt='Doctor'
              sx={{
                width: '80%',
                maxHeight: '80%',
                position: 'relative',
                bottom: '-6px',
                zIndex: 2,
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 8 }} sx={{ textAlign: { xs: 'center', md: 'right' }, pr: { md: 6 } }}>
            <Typography variant="h3" gutterBottom>
              Administrando <b>ApexEPS</b>
            </Typography>
            <Typography variant="body1">
              Como administrador de EPS, puede gestionar las IPS asociadas, registrar afiliados, ver historia clinica y supervisar estados de cuenta.
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
            © 2025 ApexEPS. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box >
  );
};

export default Home;
