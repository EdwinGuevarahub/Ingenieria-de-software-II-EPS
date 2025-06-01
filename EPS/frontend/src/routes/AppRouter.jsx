import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/EPS/Home';
import IPS from '../pages/EPS/IPS';
import AgendarCita from '../pages/EPS/AgendarCita';
import AgendarCitaAdmin from '../pages/EPS/AgendarCitaAdmin';
import SolicitarExamenMedico from '../pages/EPS/SolicitarExamenMedico';  // Importa el componente
import SolicitarMedicamento from '../pages/EPS/SolicitarMedicamento';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/IPS" element={<IPS />} />
    <Route path="/agendar-cita" element={<AgendarCita />} />
    <Route path="/agendar-cita-admin" element={<AgendarCitaAdmin />} />
    <Route path="/solicitar-examen-medico" element={<SolicitarExamenMedico />} />  
    <Route path="/solicitar-medicamento" element={<SolicitarMedicamento />} />
  </Routes>
);

export default AppRouter;
