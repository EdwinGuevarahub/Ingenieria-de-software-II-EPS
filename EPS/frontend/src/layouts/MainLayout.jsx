import React from 'react';
import Navbar from '../components/Navbar';
import { Container } from '@mui/material';

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <Container sx={{ mt: 4 }}>
      {children}
    </Container>
  </>
);

export default MainLayout;
