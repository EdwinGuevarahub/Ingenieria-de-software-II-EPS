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
              <>
                <Button color="inherit" component={Link} to="/HomeEPS">Inicio</Button>
              </>
            )}

            {logged && role === 'ADM_IPS' && (
              <>
                <Button color="inherit" component={Link} to="/HomeIPS">Inicio</Button>
              </>
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

        <Toolbar sx={{ height: 4, bgcolor: 'secondary.main', color: 'secondary.contrastText'}}>
          <Box sx={{ display: 'flex', gap: 2, mx: 'auto' }}>

            {/* Sin loguear */}
            {!logged && (
              <>
                <Button color="inherit" component={Link} to="/info">¿Quiénes somos?</Button>
                <Button color="inherit" component={Link} to="/servicios">Servicios</Button>
                <Button color="inherit" component={Link} to="/contacto">Contacto</Button>
              </>
            )}

            {/* Con roles */}
            {logged && role === 'ADM_EPS' && (
              <>
                <Button color="inherit" component={Link} to="/gestion-pagos">Gestión de pagos</Button>
                <Button color="inherit" component={Link} to="/IPS">Gestionar IPS</Button>
                <Button color="inherit" component={Link} to="/registrar-afiliado">Registrar Afiliado</Button>
                <Button color="inherit" component={Link} to="/estado-afiliado">Consultar Estado del Afiliado</Button>
                <Button color="inherit" component={Link} to="/estado-cuenta">Consultar Estado de Cuenta</Button>
                <Button color="inherit" component={Link} to="/historia-clinica">Ver Historia Clínica</Button>
              </>
            )}

            {logged && role === 'ADM_IPS' && (
              <>
                <Button color="inherit" component={Link} to="/">Gestionar Médicos</Button>
                <Button color="inherit" component={Link} to="/">Gestionar Consultorios</Button>
                <Button color="inherit" component={Link} to="/registrar-resultados">Registrar Resultados</Button>
              </>
            )}

            {logged && role === 'PACIENTE' && (
              <>
                <Button color="inherit" component={Link} to="/gestion-pagos">Gestión de pagos</Button>
                <Button color="inherit" component={Link} to="/IPS">Gestionar IPS</Button>
                <Button color="inherit" component={Link} to="/registrar-afiliado">Registrar Afiliado</Button>
                <Button color="inherit" component={Link} to="/">Consultar Estado de Cuenta</Button>
                <Button color="inherit" component={Link} to="/historia-clinica">Ver Historia Clínica</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
