import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

export async function listIPS() {
  try {
    const response = await AxiosInstance.get('ips/all');

    return response.data.map(ip => ({
      id: ip.id,
      name: ip.nombre,
      address: ip.direccion,
      phone: ip.telefono,
      admin: {
        name: ip.admEps.nombre,
        email: ip.admEps.email,
        phone: ip.admEps.telefono,
      },
      registrationDate: ip.fechaRegistro,
    }));

  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}