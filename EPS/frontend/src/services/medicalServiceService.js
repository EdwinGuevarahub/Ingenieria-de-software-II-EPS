import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

export async function listServicioMedico() {
  try {
    const response = await AxiosInstance.get('servicioMedico');

    console.log(response)


  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
  }
}