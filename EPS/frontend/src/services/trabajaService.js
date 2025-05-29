import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

export async function listarTrabaja(dniMedico) {
    try {
        const response = await AxiosInstance.get(`medico/trabaja/trabaja/dni/`, {
            params: { dniMedico }
        });
        const trabaja = response.data;
        console.log(trabaja);
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}


export async function obtenerHorarioCompleto(dniMedico = '1001234567', sedeId = 1, diaSemana = 'MONDAY') {
    try {
        const response = await AxiosInstance.get(`medico/trabaja/${dniMedico}/full/trabaja/${sedeId}/${diaSemana}`);
        console.log(response.data);
    } catch (err) {
        if (isAxiosError(err)) throw err;
        return null;
    }
}

export async function obtenerHorario(dniMedico = '1001234567', sedeId = 1, diaSemana = 'MONDAY') {
    try {
        const response = await AxiosInstance.get(`medico/trabaja/${dniMedico}/trabaja/${sedeId}/${diaSemana}`);
        console.log(response.data);
    } catch (err) {
        if (isAxiosError(err)) throw err;
        return null;
    }
}


export async function crearMedico(data) {
    try {
        const response = await AxiosInstance.post('/medico', data);
        return response.data;
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}

export async function actualizarMedico(data) {
    try {
        const response = await AxiosInstance.put(`/medico`, data);
        return response.data;
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}


