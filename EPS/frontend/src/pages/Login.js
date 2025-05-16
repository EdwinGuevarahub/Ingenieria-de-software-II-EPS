import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const fakeToken = (role) => {
  const payload = {
    role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
  };
  const base64Payload = btoa(JSON.stringify(payload));
  return `fakeHeader.${base64Payload}.fakeSignature`;
};

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('adminEPS');
  const { setAuthToken } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = () => {
    const token = fakeToken(selectedRole);
    setAuthToken(token);

    if (selectedRole === 'adminEPS') {
      navigate('/HomeEPS');
    } else if (selectedRole === 'adminIPS') {
      navigate('/HomeIPS');
    } else {
      navigate('/');
    }

  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Iniciar Sesión de Prueba</h2>
      <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
        <option value="adminEPS">AdministradorEPS</option>
        <option value="adminIPS">AdministradorIPS</option>
      </select>
      <button onClick={handleLogin} style={{ marginLeft: 10 }}>Entrar</button>
    </div>
  );
};

export default Login;