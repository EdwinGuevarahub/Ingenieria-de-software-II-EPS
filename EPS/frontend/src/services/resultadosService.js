import axios from "axios";

const API_URL = "http://localhost:8080/api/resultados";

// Obtener un paciente y el listado de citas pendientes
export const obtenerPacienteCitas = async (dniPaciente) =>
  await axios.get(`${API_URL}/citas?dniPaciente=${dniPaciente}`);

// Listas de valores estaticos
export const obtenerDiagnosticos = async () =>
  await axios.get(`${API_URL}/lista-diagnosticos`);

export const obtenerMedicamentos = async () =>
  await axios.get(`${API_URL}/lista-medicamentos`);

export const obtenerServiciosMedicos = async () =>
  await axios.get(`${API_URL}/lista-servicios`);

// Registro del resultado (formula medica o remision)
export const crearResultado = async (resultado) =>
  await axios.post(`${API_URL}`, resultado);

// Actualizar unicamente el resultado de la agenda (examen medico)
export const actualizarResultado = async (idAgenda, resultado) =>
  await axios.put(`${API_URL}/${idAgenda}`, resultado);

