import { AxiosInstance } from "../services/axios";

const API_URL = "/resultados";

// Obtener un paciente y el listado de citas pendientes
export const obtenerPacienteCitas = async (dniPaciente) =>
  await AxiosInstance.get(`${API_URL}/citas?dniPaciente=${dniPaciente}`);

// Listas de valores estaticos
export const obtenerDiagnosticos = async () =>
  await AxiosInstance.get(`${API_URL}/lista-diagnosticos`);

export const obtenerMedicamentos = async () =>
  await AxiosInstance.get(`${API_URL}/lista-medicamentos`);

export const obtenerServiciosMedicos = async () =>
  await AxiosInstance.get(`${API_URL}/lista-servicios`);

// Registro del resultado (formula medica o remision)
export const registrarResultado = async (resultado) =>
  await AxiosInstance.post(`${API_URL}`, resultado);

// Actualizar unicamente el resultado de la agenda
export const actualizarResultadoAgenda = async (idAgenda, resultado) =>
  await AxiosInstance.put(`${API_URL}/${idAgenda}`, resultado);
