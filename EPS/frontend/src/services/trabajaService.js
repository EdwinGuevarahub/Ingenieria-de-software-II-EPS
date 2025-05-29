import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

export async function obtenerHorario(dniMedico = '1001234567') {
    try {
        const response = await AxiosInstance.get(`/medico/${dniMedico}/trabaja`);
        console.log(response.data);
    } catch (err) {
        if (isAxiosError(err)) throw err;
        return null;
    }
}

export async function crearHorario(data) {
    try {
        const response = await AxiosInstance.post('/medico/${dniMedico}/trabaja', data);
        return response.data;
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}

export async function actualizarMedico(dniMedico, idTrabaja, data) {
    try {
        const response = await AxiosInstance.put(`/medico/${dniMedico}/trabaja/${idTrabaja}`, data);
        return response.data;
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}


