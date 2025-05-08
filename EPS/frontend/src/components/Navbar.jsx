import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box} from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <>
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ bgcolor: 'primary.main' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Apex EPS
        </Typography>
        <Button color="inherit" component={Link} to="/">Inicio</Button>
      </Toolbar>
      <Toolbar sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
        <Box sx={{ display: 'flex', gap: 2, mx: 'auto' }}>
          <Button color="inherit" component={Link} to="/IPS">Gestionar IPS</Button>
          <Button color="inherit" component={Link} to="/">Consultar Estado de Cuenta</Button>
          <Button color="inherit" component={Link} to="/">Registrar Afiliado</Button>
          <Button color="inherit" component={Link} to="/">Ver Historia Clínica</Button>
        </Box>
      </Toolbar>
    </AppBar>
  </>
);

export default Navbar;
