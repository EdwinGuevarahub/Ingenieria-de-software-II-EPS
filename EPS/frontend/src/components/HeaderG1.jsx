import React from 'react';
import { Box, Button, Typography, Link } from '@mui/material';

const HeaderG1 = () => {
  return (
    <Box>
      {/* Barra azul superior */}
      <Box
        sx={{
          bgcolor: '#1E88E5', // 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 1.5,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Apex EPS
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Link href="/" underline="none" color="inherit" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
            Inicio
          </Link>
          <Link href="/buscar" underline="none" color="inherit" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
            Buscar
          </Link>
          <Link href="/administrativo" underline="none" color="inherit" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
            Administrativo
          </Link>
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ textTransform: 'none' }}
            onClick={() => {
              // Aquí la lógica para cerrar sesión
              alert('Cerrar sesión');
            }}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Box>

      {/* Barra gris inferior con enlaces */}
      <Box
        sx={{
          bgcolor: '#D9D9D9',
          display: 'flex',
          gap: 4,
          px: 3,
          py: 1,
          fontSize: 14,
          color: 'black',
          fontWeight: 'bold',
        }}
      >
        <Link href="/consultar-afiliacion" underline="none" color="inherit" sx={{ cursor: 'pointer' }}>
          Consultar Afiliación
        </Link>
        <Link href="/consultar-agenda" underline="none" color="inherit" sx={{ cursor: 'inherit' }}>
          Consultar Agenda
        </Link>
        <Link href="/agendar-cita" underline="none" color="#1E88E5" sx={{ cursor: 'pointer' }}>
          Solicitar Cita
        </Link>
        <Link href="/solicitar-examen-medico" underline="none" color="inherit" sx={{ cursor: 'pointer' }}>
          Solicitar Examen Médico
        </Link>
        <Link href="/solicitar-medicamento" underline="none" color="inherit" sx={{ cursor: 'pointer' }}>
          Solicitar Medicamento
        </Link>
      </Box>
    </Box>
  );
};

export default HeaderG1;
