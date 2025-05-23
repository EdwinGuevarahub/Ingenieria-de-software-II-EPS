import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingLayout from '../layouts/LandingLayout';
import Home from '../pages/Home';
import HomeAdmEPS from '../pages/EPS/Home';
import HomeAdmIPS from '../pages/IPS/Home';
import Login from '../pages/Login';
import IPSLista from '../pages/EPS/IPS/IPSLista';
import MedicoLista from '../pages/IPS/Medico/MedicoLista';
import ConsultorioLista from '../pages/IPS/Consultorio/ConsultorioLista';
import RegistrarResultado from "../pages/IPS/RegistrarResultado";

const AppRouter = () => (
  <Routes>

    {/*Rutas varias*/}
    <Route path="/" element={<LandingLayout><Home /></LandingLayout>} />
    <Route path="/HomeEPS" element={<LandingLayout><HomeAdmEPS /></LandingLayout>} />
    <Route path="/HomeIPS" element={<LandingLayout><HomeAdmIPS /></LandingLayout>} />
    <Route path="/signIn" element={<MainLayout><Login /></MainLayout>} />

    {/*Rutas para la parte de EPS*/}
    <Route path="/IPS" element={<MainLayout><IPSLista /></MainLayout>} />

    {/*Rutas para la parte de IPS*/}
    <Route path="/registrar-resultados" element={<MainLayout> <RegistrarResultado /></MainLayout> } />
    <Route path="/medicos" element={<MainLayout><MedicoLista /></MainLayout>} />
    <Route path="/consultorios" element={<MainLayout><ConsultorioLista /></MainLayout>} />

  </Routes>
);

export default AppRouter;
