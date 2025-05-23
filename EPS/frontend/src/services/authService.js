import axios, { isAxiosError } from 'axios';

export async function loginAuth(prevState, queryData) {
  const data = {
    email: queryData.get('email'),
    password: queryData.get('password'),
  };

  try {
    const response = await axios.post('http://localhost:8080/auth/login', data);
    localStorage.setItem('authToken', response.data);

    return {
      success: true,
      message: 'Inicio de sesión satisfactorio.',
      status: response.status,
      authToken: response.data.token,
    };
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'Error de conexión, revise su conexión a internet o inténtelo más tarde.',
          status: 400,
        };
      }

      if (err.response?.status === 403) {
        return {
          success: false,
          message: 'Usuario o contraseña incorrectos.',
          status: 403,
        };
      }

      return {
        success: false,
        message: err.message,
        status: err.response?.status || 400,
      };
    }

    return {
      success: false,
      message: 'Error inesperado, revise las credenciales o inténtelo más tarde.',
      status: 400,
    };
  }
}