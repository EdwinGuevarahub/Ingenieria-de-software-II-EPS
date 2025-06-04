import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

// Registrar pago de una agenda médica por parte de un paciente
export async function registrarPagos(pacienteId, datosPago) {
  try {
    const response = await AxiosInstance.post('pagos', datosPago, {
      params: {
        pacienteId: pacienteId
      }
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: 'Pago registrado exitosamente.',
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

      if (err.response?.status === 400) {
        return {
          success: false,
          message: 'Datos de pago inválidos. Verifique la información ingresada.',
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
          message: 'No tiene permisos para registrar pagos.',
          status: 403,
          data: null,
        };
      }

      if (err.response?.status === 404) {
        return {
          success: false,
          message: 'Paciente o agenda no encontrada.',
          status: 404,
          data: null,
        };
      }

      if (err.response?.status === 409) {
        return {
          success: false,
          message: 'El pago ya fue registrado anteriormente.',
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
      message: 'Error inesperado al registrar el pago.',
      status: 500,
      data: null,
    };
  }
}

// Función auxiliar para crear el objeto de pago con la estructura correcta
export function crearDatosPago(agendaId, fechaPago = null) {
  return {
    agendaId: agendaId,
    fechaPago: fechaPago || new Date().toISOString() // Fecha actual si no se especifica
  };
}