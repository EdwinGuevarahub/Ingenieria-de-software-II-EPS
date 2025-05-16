import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingLayout from '../layouts/LandingLayout';
import Home from '../pages/Home';
import HomeAdmEPS from '../pages/EPS/Home';
import HomeAdmIPS from '../pages/IPS/Home';
import Login from '../pages/Login';
import IPS from '../pages/EPS/IPS';

const AppRouter = () => (
  <Routes>

    <Route path="/" element={<LandingLayout><Home /></LandingLayout>} />
    <Route path="/HomeEPS" element={<LandingLayout><HomeAdmEPS /></LandingLayout>} />
    <Route path="/HomeIPS" element={<LandingLayout><HomeAdmIPS /></LandingLayout>} />
    <Route path="/IPS" element={<MainLayout><IPS /></MainLayout>} />
    <Route path="/signIn" element={<MainLayout><Login /></MainLayout>} />
  </Routes>
);

export default AppRouter;
