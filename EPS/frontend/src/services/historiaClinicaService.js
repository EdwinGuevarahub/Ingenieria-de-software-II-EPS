import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

// Obtener historias clínicas por paciente DNI
export async function obtenerHistoriasClinicasPorPaciente(pacienteDni) {
  try {
    const response = await AxiosInstance.get('historia-clinica', {
      params: {
        pacienteId: pacienteDni
      }
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: 'Historias clínicas del paciente cargadas exitosamente.',
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
          message: 'No se encontraron historias clínicas para este paciente.',
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
      message: 'Error inesperado al cargar las historias clínicas del paciente.',
      status: 400,
      data: [],
    };
  }
}