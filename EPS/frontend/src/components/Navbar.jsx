import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import Logo from '../assets/Logo/Logo_EnBlanco.png';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { isLogged, logOut, role } = useAuthContext();
  const logged = isLogged();

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ bgcolor: 'primary.main', display: 'flex', justifyContent: 'space-between', height: '80px' }}>
          <Box
            component="img"
            src={Logo}
            alt="Logo EPS"
            sx={{ width: 270, height: 50, borderRadius: 2, objectFit: 'cover' }}
          />

          <Box display="flex" alignItems="center" gap={2}>
            {logged && role === 'ADM_EPS' && (
              <Button color="inherit" component={Link} to="/HomeEPS">Inicio</Button>
            )}

            {logged && role === 'ADM_IPS' && (
              <Button color="inherit" component={Link} to="/HomeIPS">Inicio</Button>
            )}

            {logged && role === 'PACIENTE' && (
              <Button color="inherit" component={Link} to="/">Inicio</Button>
            )}

            {logged ? (
              <>
                <span style={{ fontWeight: 'bold' }}>{role}</span>
                <Button variant="red" onClick={logOut}>Cerrar Sesión</Button>
              </>
            ) : (
              <Button variant="red" component={Link} to="/signIn">Iniciar Sesión</Button>
            )}
          </Box>
        </Toolbar>

        <Toolbar sx={{ height: 4, bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
          <Box sx={{ display: 'flex', gap: 2, mx: 'auto' }}>

            {/* Sin loguear */}
            {!logged && (
              <>
                <Button color="inherit" component={Link} to="/info">¿Quiénes somos?</Button>
                <Button color="inherit" component={Link} to="/servicios">Servicios</Button>
                <Button color="inherit" component={Link} to="/contacto">Contacto</Button>
              </>
            )}

            {/* Rol EPS */}
            {logged && role === 'ADM_EPS' && (
              <>
                <Button color="inherit" component={Link} to="/IPS">Gestionar IPS</Button>
                <Button color="inherit" component={Link} to="/agendar-cita-admin">Solicitar Cita</Button>
                <Button color="inherit" component={Link} to="/solicitar-examen-medico">Solicitar Examen Médico</Button>
                <Button color="inherit" component={Link} to="/">Registrar Afiliado</Button>
                <Button color="inherit" component={Link} to="/">Consultar Estado de Cuenta</Button>
                <Button color="inherit" component={Link} to="/">Ver Historia Clínica</Button>
              </>
            )}

            {/* Rol IPS */}
            {logged && role === 'ADM_IPS' && (
              <>
                <Button color="inherit" component={Link} to="/registrar-resultados">Registrar Resultados</Button>
                <Button color="inherit" component={Link} to="/medicos">Gestionar Médicos</Button>
                <Button color="inherit" component={Link} to="/consultorios">Gestionar Consultorios</Button>
              </>
            )}

            {/* Rol PACIENTE */}
            {logged && role === 'PACIENTE' && (
              <>
                <Button color="inherit" component={Link} to="#">Consultar Afiliación</Button>
                <Button color="inherit" component={Link} to="#">Consultar Agenda</Button>
                <Button color="inherit" component={Link} to="/agendar-cita">Solicitar Cita</Button>
                <Button color="inherit" component={Link} to="/solicitar-examen-medico">Solicitar Examen Médico</Button>
                <Button color="inherit" component={Link} to="/solicitar-medicamento">Solicitar Medicamentos</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
