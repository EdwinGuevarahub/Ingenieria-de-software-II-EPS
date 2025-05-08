import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/EPS/Home';
import IPS from '../pages/EPS/IPS';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/IPS" element={<IPS />} />
  </Routes>
);

export default AppRouter;
