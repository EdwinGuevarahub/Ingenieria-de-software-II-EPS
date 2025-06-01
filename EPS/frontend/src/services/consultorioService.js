import { AxiosInstance } from "../services/axios";
import { isAxiosError } from "axios";

export async function listarConsultorios({
  qPage = 0,
  qSize = 10,
  cupsServicioMedico,
  idConsultorioLike,
} = {}) {
  try {
    console.log(
      "Listando consultorios con parámetros:",
      qPage,
      qSize,
      cupsServicioMedico,
      idConsultorioLike
    );
    const response = await AxiosInstance.get("consultorio", {
      params: {
        qPage,
        qSize,
        cupsServicioMedico,
        idConsultorioLike,
      },
    });
    
    const { totalPages, consultorios } = response.data;

    return {
      totalPaginas: totalPages,
      consultorios: consultorios.map((c) => ({
        idConsultorio: c.idConsultorio,
        cupsServicioMedico: c.cupsServicioMedico,
        nombreServicioMedico: c.nombreServicioMedico,
        idIps: c.idIps,
      })),
    };
  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
    console.error("Error inesperado al listar consultorios:", err);
    return { totalPaginas: 0, consultorios: [] };
  }
}

export async function obtenerConsultorio(idIps, idConsultorio) {
  try {
    console.log(
      "Obteniendo consultorio con ID IPS:",
      idIps,
      "y ID Consultorio:",
      idConsultorio
    );
    const response = await AxiosInstance.get(
      `/consultorio/${idIps}?idConsultorioLike=${idConsultorio}`
    );
    const consultorioAPI = response.data;
    console.log("API response data (wrapper):", consultorioAPI);
    if (
      consultorioAPI &&
      consultorioAPI.consultorios &&
      consultorioAPI.consultorios.length > 0
    ) {
      const consultorioActual = consultorioAPI.consultorios[0];
      console.log("Consultorio actual extraído:", consultorioActual);
      return {
        idIps: consultorioActual.idIps,
        idConsultorio: consultorioActual.idConsultorio,
        cupsServicioMedico: consultorioActual.cupsServicioMedico,
        nombreServicioMedico: consultorioActual.nombreServicioMedico,
      };
    } else {
      console.warn(
        "Consultorio no encontrado en la respuesta o estructura inesperada:",
        consultorioAPI
      );
    }
  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}

/**
 * Crear un nuevo consultorio.
 * @param {Object} consultorio - Objeto del consultorio a crear.
 * @param {string} consultorio.nombre - Nombre del consultorio.
 * @param {string} consultorio.telefono - Teléfono del consultorio.
 * @param {string} consultorio.direccion - Dirección del consultorio.
 * @param {number} consultorio.idIps - ID de la IPS a la que pertenece.
 * @param {string} consultorio.cupsServicioMedico - Código CUPS del servicio médico.
 * @returns {Promise<Object>} - Consultorio creado.
 * @throws {Error} - Si ocurre un error al hacer la solicitud.
 */
export async function crearConsultorio(consultorio) {
  try {
    console.log("Creando consultorio con datos:", consultorio);
    const response = await AxiosInstance.post("/consultorio", consultorio);
    return response.data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}

/**
 * Actualizar un consultorio existente.
 * @param {Object} consultorio - Objeto del consultorio actualizado.
 * @param {number} consultorio.id - ID del consultorio.
 * @param {string} consultorio.nombre - Nombre del consultorio.
 * @param {string} consultorio.telefono - Teléfono del consultorio.
 * @param {string} consultorio.direccion - Dirección del consultorio.
 * @param {number} consultorio.idIps - ID de la IPS a la que pertenece.
 * @param {string} consultorio.cupsServicioMedico - Código CUPS del servicio médico.
 * @returns {Promise<Object>} - Consultorio actualizado.
 * @throws {Error} - Si ocurre un error al hacer la solicitud.
 */
export async function actualizarConsultorio(consultorio) {
  try {
  console.log("Actualizando consultorio con datos:", consultorio);
    const response = await AxiosInstance.put("/consultorio", consultorio);
    return response.data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}
