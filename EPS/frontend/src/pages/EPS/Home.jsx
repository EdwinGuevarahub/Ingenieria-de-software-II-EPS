import React from 'react';
import { Box, Typography, Button, Grid, Paper, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h3" gutterBottom>
            Bienvenido a Apex EPS
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Cuidamos tu salud, protegemos tu futuro. Accede a tus servicios médicos de manera fácil, rápida y segura.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/afiliarse"
            size="large"
          >
            Afíliate ahora
          </Button>
        </Container>
      </Box>

      {/* Servicios */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Nuestros Servicios
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[
            {
              title: 'Red de IPS',
              desc: 'Consulta nuestra red de clínicas, hospitales y laboratorios disponibles en todo el país.',
            },
            {
              title: 'Atención en línea',
              desc: 'Solicita citas médicas, autorizaciones o atención prioritaria desde nuestra plataforma.',
            },
            {
              title: 'Historia Clínica',
              desc: 'Consulta tu historia clínica y resultados de laboratorio de forma segura.',
            },
          ].map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body1">{service.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box
        sx={{
          bgcolor: 'secondary.main',
          color: 'secondary.contrastText',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          ¿Necesitas ayuda médica urgente?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Nuestra línea de atención 24/7 está disponible para ti.
        </Typography>
        <Button variant="outlined" color="inherit" size="large" component={Link} to="/contacto">
          Contáctanos
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 3, textAlign: 'center' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Apex EPS. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;


