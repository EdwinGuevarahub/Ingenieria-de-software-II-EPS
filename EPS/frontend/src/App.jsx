import React from 'react';
import MainLayout from './layouts/MainLayout';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <MainLayout>
      <AppRouter />
    </MainLayout>
  );
}

export default App;

