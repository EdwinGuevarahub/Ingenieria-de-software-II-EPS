import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

export async function listarMedicos({
    qPage = 0,
    qSize = 10,
    dniNombreLike,
    cupsServicioMedico,
    diaSemanaIngles,
    horaDeInicio,
    horaDeFin,
    estaActivo
} = {}) {
    try {
        const response = await AxiosInstance.get('medico', {
            params: {
                qPage,
                qSize,
                dniNombreLike,
                cupsServicioMedico,
                diaSemanaIngles,
                horaDeInicio,
                horaDeFin,
                estaActivo
            }
        });

        const { totalPages, medicos } = response.data;

        return {
            totalPaginas: totalPages,
            medicos: medicos.map(medico => ({
                dni: medico.dni,
                nombre: medico.nombre
            }))
        };

    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
        return { totalPaginas: 0, medicos: [] };
    }
}

export async function detalleMedico(dniMedico) {
    try {
        const response = await AxiosInstance.get(`medico/${dniMedico}`)
        const medico = response.data;

        return {
            dni: medico.dni,
            nombre: medico.nombre,
            telefono: medico.telefono,
            email: medico.email,
            activo: medico.activo,
        };

    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }
}

export async function crearMedico(data) {
    try {
        console.log(data)
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
        console.log(data)
        const response = await AxiosInstance.put(`/medico`, data);
        return response.data;
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
        if (err.response) {
            console.error('Error en respuesta del servidor:', err.response.status, err.response.data);
        } else {
            console.error('Error en la petición:', err.message);
        }
        throw err;
    }
}


