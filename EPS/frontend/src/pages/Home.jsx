import React, {useCallback, useEffect, useState} from 'react';
import {
  Typography, Button, Box, Container, Grid, Card, CardContent, CardMedia
} from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import Doctor from '../assets/Images/Banner.png';
import { useAuthContext } from '../contexts/AuthContext';
import { getIpsByAdmIpsEmail } from '../services/ipsService';

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

const LandingPage = () => {
  const { isLogged, role } = useAuthContext();
  const logged = isLogged();

  const [willRedirect, setWillRedirect] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    if (logged === false || role)
      setLoadingAuth(false);
    else
      return;

    if (logged === false || !['ADM_IPS', 'ADM_EPS'].includes(role)) {
      setWillRedirect(false);
      return;
    }

    if (role === 'ADM_EPS')
      window.location.href = '/HomeEPS';
    else
      window.location.href = '/HomeIPS';

  }, [logged, role]);

  if (loadingAuth)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Cargando...</Typography>
      </Box>
    )

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
              Bienvenido a <b>ApexEPS</b>
            </Typography>
            <Typography variant="body1">
              En ApexEPS trabajgamos cada día por tu bienestar y el de tu familia.
              Te ofrecemos servicios de salud con calidad, oportunidad y atención humana.
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

export default LandingPage;
