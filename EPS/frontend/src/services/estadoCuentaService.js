import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

// Obtener estado de cuenta por ID de paciente
export async function obtenerEstadoCuentaPorPaciente(pacienteId) {
  try {
    const response = await AxiosInstance.get('estado-cuenta', {
      params: {
        pacienteId: pacienteId
      }
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: 'Estado de cuenta obtenido exitosamente.',
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
          message: 'No tiene permisos para consultar este estado de cuenta.',
          status: 403,
          data: null,
        };
      }

      if (err.response?.status === 404) {
        return {
          success: false,
          message: 'No se encontró estado de cuenta para el paciente especificado.',
          status: 404,
          data: null,
        };
      }

      if (err.response?.status === 400) {
        return {
          success: false,
          message: 'ID de paciente inválido.',
          status: 400,
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
      message: 'Error inesperado al obtener el estado de cuenta.',
      status: 400,
      data: null,
    };
  }
}

// Buscar estados de cuenta por múltiples pacientes (opcional - para búsquedas)
export async function buscarEstadosCuenta(filtros) {
  try {
    const response = await AxiosInstance.get('estado-cuenta', {
      params: {
        pacienteId: filtros.pacienteId,
        dni: filtros.dni,
        nombre: filtros.nombre
      }
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: 'Búsqueda completada exitosamente.',
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
          message: 'No tiene permisos para realizar búsquedas.',
          status: 403,
          data: [],
        };
      }

      if (err.response?.status === 400) {
        return {
          success: false,
          message: 'Parámetros de búsqueda inválidos.',
          status: 400,
          data: [],
        };
      }

      if (err.response?.status === 404) {
        return {
          success: false,
          message: 'No se encontraron estados de cuenta.',
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
      message: 'Error inesperado en la búsqueda.',
      status: 400,
      data: [],
    };
  }
}