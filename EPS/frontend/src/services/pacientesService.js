import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

// Obtener todos los pacientes
export async function listarPacientes() {
  try {
    const response = await AxiosInstance.get('users');

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
        message: err.response?.data?.message || err.message,
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

// Crear un nuevo paciente
export async function crearPaciente(datosPaciente) {
  try {
    const response = await AxiosInstance.post('afiliacion', datosPaciente);

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: 'Paciente creado exitosamente.',
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

      if (err.response?.status === 403) {
        return {
          success: false,
          message: 'No tiene permisos para crear pacientes.',
          status: 403,
          data: null,
        };
      }

      if (err.response?.status === 400) {
        return {
          success: false,
          message: 'Datos inválidos. Verifique la información ingresada.',
          status: 400,
          data: null,
        };
      }

      if (err.response?.status === 409) {
        return {
          success: false,
          message: 'El paciente ya existe. DNI duplicado.',
          status: 409,
          data: null,
        };
      }

      if (err.response?.status === 422) {
        return {
          success: false,
          message: 'Error de validación. Verifique que todos los campos requeridos estén completos.',
          status: 422,
          data: null,
        };
      }

      return {
        success: false,
        message: err.response?.data?.message || err.message,
        status: err.response?.status || 400,
        data: null,
      };
    }

    return {
      success: false,
      message: 'Error inesperado al crear el paciente.',
      status: 400,
      data: null,
    };
  }
}

// Obtener detalles de un paciente específico
export async function obtenerPaciente(id) {
  try {
    const response = await AxiosInstance.get(`users/${id}`);

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
        message: err.response?.data?.message || err.message,
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