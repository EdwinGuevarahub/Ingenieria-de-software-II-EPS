import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { loginAuth } from '../services/authService';
import { decodeToken } from '../utils/DecodeToken';

const Login = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const result = await loginAuth({}, formData);
    console.log('Login result:', result);

    setIsPending(false);

    if (result.status === 200) {
      setSuccessMessage(result.message);
      setAuthToken(result.authToken);

      const decoded = decodeToken(result.authToken);
      const role = decoded?.roles?.[0];

      setTimeout(() => {
        if (role === 'ADM_IPS') {
          navigate('/homeIPS');
        } else if (role === 'ADM_EPS') {
          navigate('/homeEPS');
        } else {
          navigate('/');
        }
      }, 500);
    } else {
      setErrorMessage(result.message || 'Error de inicio de sesión');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'color_secondary' }}>
          Iniciar Sesión
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            type="email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: 'color_secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: 'color_third' }} />
                </InputAdornment>
              ),
            }}
          />

          {errorMessage && (
            <Typography sx={{ color: 'red', mt: 1 }}>{errorMessage}</Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="red"
            disabled={isPending}
          >
            {isPending ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;