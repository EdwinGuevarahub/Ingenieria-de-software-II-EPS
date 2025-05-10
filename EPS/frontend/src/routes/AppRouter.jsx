import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/EPS/Home";
import IPS from "../pages/EPS/IPS";
import RegistrarResultado from "../pages/IPS/RegistrarResultado";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/IPS" element={<IPS />} />
    <Route path="/registrar-resultado" element={<RegistrarResultado />} />
  </Routes>
);

export default AppRouter;
