import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

export async function listarIPS({
  qPage = 0,
  qSize = 10,
  nombre,
  telefono,
  direccion,
  fechaRegistro,
  nombreServicio,
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
        nombreServicio,
        cupsServicioMedico,
        idConsultorioLike,
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
    const response = await AxiosInstance.get(`ips/ips/detalle?idIps=${id}`);
    const ips = response.data;

    return {
      id: ips.id,
      nombre: ips.nombre,
      telefono: ips.telefono,
      direccion: ips.direccion,
      fechaRegistro: ips.fechaRegistro,
      admEps: ips.admEps,
    };

  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}

export async function crearIPS(data) {
    try {
        const response = await AxiosInstance.post('/ips', data);
        console.log("Respuesta del backend ", response.data)
        return response.data;
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}

export async function actualizarIPS(data) {
    try {
        console.log(data)
        const response = await AxiosInstance.put(`/ips`, data);
        return response.data;
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}