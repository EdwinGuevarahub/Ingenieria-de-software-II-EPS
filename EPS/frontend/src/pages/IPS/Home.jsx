import {useEffect, useState} from 'react';
import {
  Typography, Box, Container, Grid, Card, CardContent, CardMedia
} from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import { useAuthContext } from '../../contexts/AuthContext';
import { getIpsByAdmIpsEmail } from '../../services/ipsService';

const services = [
  {
    title: 'Citas médicas',
    image: '/images/Banner.png',
    description: 'Agenda y gestiona tus consultas con médicos generales y especialistas de forma rápida y segura.',
  },
  {
    title: 'Exámenes',
    image: '/images/Banner.png',
    description: 'Solicita y consulta tus exámenes diagnósticos con cobertura en nuestra red de prestadores.',
  },
  {
    title: 'Laboratorios',
    image: '/images/Banner.png',
    description: 'Accede a servicios de laboratorio clínico para apoyar el diagnóstico y seguimiento de tu salud.',
  },
];

const Home = () => {
  const { isLogged, subEmail, role } = useAuthContext();
  const logged = isLogged();

  const [ isAuthLoading, setIsAuthLoading ] = useState(true);
  const [ willRedirect, setWillRedirect ] = useState(true);
  const [ ips, setIps ] = useState({});

  // Redirigir si el usuario no está logueado o no es un administrador de IPS.
  useEffect(() => {
    if (logged === false || role)
      setIsAuthLoading(false);
    else
      return;

    if (logged && role === 'ADM_IPS')
      setWillRedirect(false);
    else
      window.location.href = '/';

  }, [logged, role]);

  useEffect(() => {
    if (willRedirect)
      return;

    const fetchIps = async () => {
      try {
        const result = await getIpsByAdmIpsEmail(subEmail);
        setIps(result);
      } catch(error) {
        console.error('Error al cargar la ips del médico: ', error);
      }
    };

    fetchIps();
  }, [willRedirect, subEmail]);

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
