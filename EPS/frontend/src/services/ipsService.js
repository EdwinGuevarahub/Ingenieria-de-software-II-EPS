export const getIPS = async () => {
  // Simulando llamada a API
  return [
    { id: 1, nombre: 'Clínica Norte', servicio: 'Urgencias' },
    { id: 2, nombre: 'Hospital Central', servicio: 'Pediatría' },
    { id: 3, nombre: 'IPS Vida', servicio: 'Consulta General' },
  ];
};

{/*
import { AxiosInstance } from '@/axios';
import { isAxiosError } from 'axios';

export async function listIPS() {
  try {
    const response = await AxiosInstance.get(' ');
    const ips = response.data;

    return ips.map(c => ({
      name: c.name,
      id: c._id
    }));
  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}

  */}