import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

export async function getIpsByAdmIpsEmail(email) {
  try {
    const response = await AxiosInstance.get('admips', { params: {email} });
    return response.data.ips;
  } catch (err) {
    if (isAxiosError(err))
      throw err;
  }
};

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

    const { totalPages, ips } = response.data;

    return {
            totalPaginas: totalPages,
            ips: ips.map(ips => ({
                id: ips.id,
                nombre: ips.nombre
            }))
        };

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
      activo: ips.activo,
      imagen: ips.imagen,
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
        return response.data;
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}

export async function actualizarIPS(data) {
    try {
        const response = await AxiosInstance.put(`/ips`, data);
        return response.data;
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}
