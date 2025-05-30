import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

export async function obtenerHorario(dniMedico = '1001234567') {
    try {
        const response = await AxiosInstance.get(`/medico/${dniMedico}/trabaja`);
    } catch (err) {
        if (isAxiosError(err)) throw err;
        return null;
    }
}

export async function crearHorario(dniMedico, data) {
    try {
        const response = await AxiosInstance.post('/medico/${dniMedico}/trabaja', data);
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}

export async function actualizarHorario(dniMedico, idTrabaja, data) {
    try {
        const response = await AxiosInstance.put(`/medico/${dniMedico}/trabaja/${idTrabaja}`, data);
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}
