import { AxiosInstance } from "../services/axios";
import { isAxiosError } from "axios";

/**
 * Listar consultorios de una IPS o todos los consultorios.
 * @param {Object} params - Parámetros de consulta.
 * @param {number|null} params.idIps - ID de la IPS para filtrar consultorios.
 * @param {number} params.qPage - Página de resultados (default: 0).
 * @param {number} params.qSize - Tamaño de página (default: 10).
 * @param {string} params.cupsServicioMedico - CUPS del servicio médico.
 * @param {string} params.idConsultorioLike - ID del consultorio para filtrar.
 * @returns {Promise<Object>} - Objeto con total de páginas y lista de consultorios.
 * @throws {Error} - Si ocurre un error al hacer la solicitud.
 * @example
 * listarConsultorios({
 *  idIps: 1,
 *  qPage: 0,
 * qSize: 10,
 *  cupsServicioMedico: 'CUPS123',
 * idConsultorioLike: 'CONS123'
 * })
 * .then(data => console.log(data))
 */
export async function listarConsultorios({
  qPage = 0,
  qSize = 10,
  cupsServicioMedico,
  idConsultorioLike,
} = {}) {
  try {
    const response = await AxiosInstance.get("/consultorio", {
      params: {
        qPage,
        qSize,
        cupsServicioMedico,
        idConsultorioLike,
      },
    });

    return {
      totalPaginas: response.data.totalPaginas,
      consultorios: response.data.consultorios,
    };
  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}

export async function obtenerConsultorio(idIps, idConsultorio) {
  try {
    const response = await AxiosInstance.get(
      `/consultorio/${idIps}?idConsultorioLike=${idConsultorio}`
    );
    const consultorio = response.data;

    return {
      id: consultorio.id,
      nombre: consultorio.nombre,
      telefono: consultorio.telefono,
      direccion: consultorio.direccion,
      fechaRegistro: consultorio.fechaRegistro,
      admEps: consultorio.admEps,
    };
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
    const response = await AxiosInstance.put("/consultorio", consultorio);
    return response.data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}