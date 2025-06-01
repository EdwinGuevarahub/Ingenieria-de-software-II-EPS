import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingLayout from '../layouts/LandingLayout';
import Home from '../pages/Home';
import HomeAdmEPS from '../pages/EPS/Home';
import HomeAdmIPS from '../pages/IPS/Home';
import Login from '../pages/Login';
import IPS from '../pages/EPS/IPS';
import AgendarCita from '../pages/EPS/AgendarCita';
import AgendarCitaAdmin from '../pages/EPS/AgendarCitaAdmin';
import SolicitarExamenMedico from '../pages/EPS/SolicitarExamenMedico';  // Importa el componente
import SolicitarMedicamento from '../pages/EPS/SolicitarMedicamento';
import RegistrarResultado from "../pages/IPS/RegistrarResultado";

const AppRouter = () => (
  <Routes>
    
    <Route path="/" element={<LandingLayout><Home /></LandingLayout>} />
    <Route path="/HomeIPS" element={<LandingLayout><HomeAdmIPS /></LandingLayout>} />
    <Route path="/HomeEPS" element={<LandingLayout><HomeAdmEPS /></LandingLayout>} />
    <Route path="/IPS" element={<MainLayout><IPS /></MainLayout>} />
    <Route path="/signIn" element={<MainLayout><Login /></MainLayout>} />
    <Route path="/registrar-resultados" element={<MainLayout> <RegistrarResultado /></MainLayout> } />


     {/* Grupo 1 */}
    <Route path="/agendar-cita" element={<MainLayout> <AgendarCita /></MainLayout>} />
    <Route path="/agendar-cita-admin" element={<MainLayout><AgendarCitaAdmin /></MainLayout>} />
    <Route path="/solicitar-examen-medico" element={<MainLayout><SolicitarExamenMedico /></MainLayout>} />  
    <Route path="/solicitar-medicamento" element={<MainLayout><SolicitarMedicamento /></MainLayout>} />


  </Routes>
);

export default AppRouter;
