import axios from "axios";

const API_URL = "http://localhost:8080/api/resultados";

// Obtener un paciente y el listado de citas pendientes
export const obtenerPacienteCitas = async (dniPaciente) =>
  await axios.get(`${API_URL}/citas?dniPaciente=${dniPaciente}`);