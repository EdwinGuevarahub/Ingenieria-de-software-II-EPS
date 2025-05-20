import { AxiosInstance } from './axios';
import { isAxiosError } from 'axios';

export async function listaServiciosMedicos() {
  try {
    const response = await AxiosInstance.get('servicioMedico');

    return response.data.map(ip => ({
      cups: ip.cupsServicioMedico,
      nombre: ip.nombreServicioMedico
    }));

  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}

export async function listaServiciosMedicosPorMedico(dniMedico) {
  try {
    const response = await AxiosInstance.get(`medico/${dniMedico}/dominio`);

    return response.data.map(ip => ({
      cups: ip.cupsServicioMedico,
      nombre: ip.nombreServicioMedico
    }));

  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}

export async function agregarServiciosMedicosPorMedico(dniMedico, cups) {
  try {
    const response = await AxiosInstance.post(`medico/${dniMedico}/dominio?cupsServicioMedico=${cups}`);
    return response.data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}

export async function eliminarServiciosMedicosPorMedico(dniMedico, cups) {
  try {
    const response = await AxiosInstance.delete(`medico/${dniMedico}/dominio?cupsServicioMedico=${cups}`);
    return response.data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}