import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

export async function obtenerHorario(dniMedico = '1001234567') {
    try {
        const response = await AxiosInstance.get(`/medico/${dniMedico}/trabaja`);

        return response.data.map(horario => ({
            id: horario.idTrabaja,
            dniMedico: horario.dniMedico,
            idIps: horario.idIps,
            idConsultorio: horario.idConsultorio,
            horario: horario.horario.map(h => ({
                dia: h.dia,
                inicio: h.inicio,
                fin: h.fin
            }))
        }));

    } catch (err) {
        if (isAxiosError(err)) throw err;
        return null;
    }
}

export async function crearHorario(dniMedico, data) {
    try {
        const response = await AxiosInstance.post(`/medico/${dniMedico}/trabaja`, data);
        console.log(response.data);
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}

export async function actualizarHorario(dniMedico, idTrabaja, data) {
    try {
        const response = await AxiosInstance.put(`/medico/${dniMedico}/trabaja/${idTrabaja}`, data);
        console.log(response.data);
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}



