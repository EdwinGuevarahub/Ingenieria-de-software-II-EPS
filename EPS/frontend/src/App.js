import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/api/users")
      .then(response => {
        console.log("Usuarios recibidos:", response.data); // Debug
        setUsuarios(response.data);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al obtener los usuarios:", error);
        setCargando(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the EPS</h1>
        <img src={logo} className="App-logo" alt="logo" />

        <p>Lista de usuarios:</p>
        {cargando ? (
          <p>Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p>No se encontraron usuarios.</p>
        ) : (
          <ul>
            {usuarios.map(usuario => (
              <li key={usuario.dni}>{usuario.nombre}</li>
            ))}
          </ul>
        )}
      </header>
    </div>
  );
}

export default App;
