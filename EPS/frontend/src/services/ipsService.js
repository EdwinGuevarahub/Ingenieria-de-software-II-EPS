import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

export async function listarIPS({
  qPage = 0,
  qSize = 10,
  nombre,
  telefono,
  direccion,
  fechaRegistro,
  cupsServicioMedico,
  idConsultorioLike } = {}) {
  try {
    const response = await AxiosInstance.get('ips', {
      params: {
        qPage,
        qSize,
        nombre,
        telefono,
        direccion,
        fechaRegistro,
        cupsServicioMedico,
        idConsultorioLike
      }
    });

    return response.data.map(ip => ({
      id: ip.id,
      nombre: ip.nombre
    }));

  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}

export async function detallesIPS(id) {
  try {
    const response = await AxiosInstance.get(`ips/${id}`);
    const ips = response.data;

    return {
      dni: ips.dni,
      nombre: ips.nombre,
      telefono: ips.telefono,
      email: ips.email,
      activo: ips.activo,
    };



  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}