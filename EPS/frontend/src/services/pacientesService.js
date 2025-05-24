import axios, { isAxiosError } from 'axios';

// Obtener todos los pacientes
export async function listarPacientes() {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get('http://localhost:8080/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: 'Pacientes cargados exitosamente.',
    };
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'Error de conexión, revise su conexión a internet o inténtelo más tarde.',
          status: 400,
          data: [],
        };
      }

      if (err.response?.status === 401) {
        return {
          success: false,
          message: 'Token de autenticación inválido o expirado.',
          status: 401,
          data: [],
        };
      }

      if (err.response?.status === 403) {
        return {
          success: false,
          message: 'No tiene permisos para acceder a esta información.',
          status: 403,
          data: [],
        };
      }

      if (err.response?.status === 404) {
        return {
          success: false,
          message: 'No se encontraron pacientes.',
          status: 404,
          data: [],
        };
      }

      return {
        success: false,
        message: err.message,
        status: err.response?.status || 400,
        data: [],
      };
    }

    return {
      success: false,
      message: 'Error inesperado al cargar los pacientes.',
      status: 400,
      data: [],
    };
  }
}

// Obtener detalles de un paciente específico
export async function obtenerPaciente(id) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`http://localhost:8080/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: 'Paciente obtenido exitosamente.',
    };
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'Error de conexión, revise su conexión a internet o inténtelo más tarde.',
          status: 400,
          data: null,
        };
      }

      if (err.response?.status === 401) {
        return {
          success: false,
          message: 'Token de autenticación inválido o expirado.',
          status: 401,
          data: null,
        };
      }

      if (err.response?.status === 404) {
        return {
          success: false,
          message: 'Paciente no encontrado.',
          status: 404,
          data: null,
        };
      }

      return {
        success: false,
        message: err.message,
        status: err.response?.status || 400,
        data: null,
      };
    }

    return {
      success: false,
      message: 'Error inesperado al obtener el paciente.',
      status: 400,
      data: null,
    };
  }
}