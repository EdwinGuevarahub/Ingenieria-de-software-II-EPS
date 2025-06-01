import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { IpsContextProvider } from '../contexts/UserIPSContext';
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
import IPSLista from '../pages/EPS/IPS/IPSLista';
import MedicoLista from '../pages/IPS/Medico/MedicoLista';
import ConsultorioLista from '../pages/IPS/Consultorio/ConsultorioLista';
import AgendaListaMedico from '../pages/Medico/AgendaListaMedico';
import AgendaListaPaciente from '../pages/Paciente/AgendaListaPaciente';
import RegistrarResultado from "../pages/IPS/RegistrarResultado";
import HistoriaClinica from '../pages/EPS/HistoriaClinica';
import GestionAfiliado from '../pages/EPS/GestionAfiliado';
import GestionPagos from '../pages/EPS/GestionPagos';
import EstadoAfiliacion from '../pages/EPS/EstadoAfiliacion';
import EstadoCuenta from '../pages/EPS/EstadoCuenta';
import DetalleEstadoCuenta from '../pages/EPS/DetalleEstadoCuenta';
import EdicionAfiliado from '../pages/EPS/EdicionAfiliado';

const AppRouter = () => (
  <Routes>
    {/*Rutas varias*/}
    <Route path="/" element={<LandingLayout><Home /></LandingLayout>} />
    <Route path="/HomeEPS" element={<LandingLayout><HomeAdmEPS /></LandingLayout>} />
    <Route path="/HomeIPS" element={
      <IpsContextProvider>
        <LandingLayout><HomeAdmIPS /></LandingLayout>
      </IpsContextProvider>
    } />
    <Route path="/signIn" element={<MainLayout><Login /></MainLayout>} />

    {/*Rutas para la parte de EPS*/}
    <Route path="/IPS" element={<MainLayout><IPSLista /></MainLayout>} />

    {/*Rutas para la parte de IPS*/}
    <Route path="/registrar-resultados" element={<MainLayout> <RegistrarResultado /></MainLayout>} /> 
    <Route path="/medicos" element={
      <IpsContextProvider>
        <MainLayout><MedicoLista /></MainLayout>
      </IpsContextProvider>
    } />
    <Route path="/consultorios" element={
      <IpsContextProvider>
        <MainLayout><ConsultorioLista /></MainLayout>
      </IpsContextProvider>
    } />

    {/*Rutas para la parte de médico */}
    <Route path="/medico/agenda" element={<MainLayout><AgendaListaMedico /></MainLayout>} />

    {/*Rutas para la parte de paciente*/}
    <Route path="/paciente/agenda" element={<MainLayout><AgendaListaPaciente /></MainLayout>} />

    <Route path="/historia-clinica" element={<MainLayout><HistoriaClinica /></MainLayout>} />
    <Route path="/registrar-afiliado" element={<MainLayout><GestionAfiliado /></MainLayout>} />
    <Route path="/gestion-pagos" element={<MainLayout><GestionPagos /></MainLayout>} />
    <Route path="/estado-afiliado" element={<MainLayout><EstadoAfiliacion /></MainLayout>} />
    <Route path="/estado-cuenta" element={<MainLayout><EstadoCuenta /></MainLayout>} />
    <Route path="/detalle-estado-cuenta/:userId" element={<MainLayout><DetalleEstadoCuenta /></MainLayout>} />
    <Route path="/editar-afiliado/:afiliadoId" element={<MainLayout><EdicionAfiliado /></MainLayout>} />


     {/* Grupo 1 */}
    <Route path="/agendar-cita" element={<MainLayout> <AgendarCita /></MainLayout>} />
    <Route path="/agendar-cita-admin" element={<MainLayout><AgendarCitaAdmin /></MainLayout>} />
    <Route path="/solicitar-examen-medico" element={<MainLayout><SolicitarExamenMedico /></MainLayout>} />  
    <Route path="/solicitar-medicamento" element={<MainLayout><SolicitarMedicamento /></MainLayout>} />


  </Routes>
);

export default AppRouter;
