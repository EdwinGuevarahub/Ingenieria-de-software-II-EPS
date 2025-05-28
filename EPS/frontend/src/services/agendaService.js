import { AxiosInstance } from '../services/axios';
import { isAxiosError } from 'axios';

/**
 * Lista las citas agendadas de un paciente según los parámetros proporcionados.
 * @param dniMedico DNI del médico (opcional para administradores).
 * @param dniNombrePacienteLike Subcadena para buscar pacientes por DNI o nombre (opcional).
 * @param cupsServicioMedico Código del servicio médico (opcional).
 * @param fecha Fecha de la cita (opcional).
 * @param horaDeInicio Hora de inicio de la cita (opcional).
 * @param hordaDeFin Hora de fin de la cita (opcional).
 * @param qPage Número de página para la paginación (default: 0).
 * @param qSize Tamaño de la página para la paginación (default: 10).
 * @returns {Promise<Object>} Un objeto con el total de páginas y una lista de agendas.
 */
export async function listarAgendaMedico({
    dniMedico,
    dniNombrePacienteLike,
    cupsServicioMedico,
    fecha,
    horaDeInicio,
    hordaDeFin,
    qPage = 0,
    qSize = 10
} = {}) {
    try {

        const response = await AxiosInstance.get('agenda/medico', {
            params: {
                dniMedico,
                dniNombrePacienteLike,
                cupsServicioMedico,
                fecha,
                horaDeInicio,
                hordaDeFin,
                qPage,
                qSize
            }
        });

        const { totalPages, agendas } = response.data;

        return {
            totalPaginas: totalPages,
            agendas: agendas.map(agenda => ({
                id: agenda.idAgenda,
                fecha: agenda.fecha,
                horaInicio: agenda.horaInicio,
                idConsultorio: agenda.idConsultorio,
                nombreServicioMedico: agenda.nombreServicioMedico,
                nombrePaciente: agenda.nombrePaciente
            }))
        };
    
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
        return { totalPaginas: 0, agendas: [] };
    }
}

/**
 * Lista las citas agendadas de un médico según los parámetros proporcionados.
 * @param dniPaciente DNI del paciente (opcional para administradores).
 * @param dniNombreMedicoLike Subcadena para buscar médicos por DNI o nombre (opcional).
 * @param cupsServicioMedico Código del servicio médico (opcional).
 * @param fecha Fecha de la cita (opcional).
 * @param horaDeInicio Hora de inicio de la cita (opcional).
 * @param hordaDeFin Hora de fin de la cita (opcional).
 * @param qPage Número de página para la paginación (default: 0).
 * @param qSize Tamaño de la página para la paginación (default: 10).
 * @returns {Promise<Object>} Un objeto con el total de páginas y una lista de agendas.
 */
export async function listarAgendaPaciente({
    dniPaciente,
    dniNombreMedicoLike,
    cupsServicioMedico,
    fecha,
    horaDeInicio,
    hordaDeFin,
    qPage = 0,
    qSize = 10
} = {}) {
    try {

        const response = await AxiosInstance.get('agenda/paciente', {
            params: {
                dniPaciente,
                dniNombreMedicoLike,
                cupsServicioMedico,
                fecha,
                horaDeInicio,
                hordaDeFin,
                qPage,
                qSize
            }
        });

        const { totalPages, agendas } = response.data;

        return {
            totalPaginas: totalPages,
            agendas: agendas.map(agenda => ({
                id: agenda.idAgenda,
                fecha: agenda.fecha,
                horaInicio: agenda.horaInicio,
                nombreIps: agenda.nombreIps,
                nombreServicioMedico: agenda.nombreServicioMedico,
                nombreMedico: agenda.nombreMedico
            }))
        };
    
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
        return { totalPaginas: 0, agendas: [] };
    }
}

/**
 * Detalle de una cita agendada.
 * @param idAgenda ID de la agenda a consultar.
 * @returns {Promise<Object>} Un objeto con los detalles de la agenda.
 */
export async function detalleAgenda(idAgenda) {
    try {
        const response = await AxiosInstance.get(`agenda/${idAgenda}`);
        const agenda = response.data;

        return {
            id: agenda.idAgenda,
            paciente: agenda.paciente,
            trabaja: agenda.trabaja,
            fecha: agenda.fecha,
            fechaPago : agenda.fechaPago,
            resultado: agenda.resultado,
            estado: agenda.estado,
            generaciones: agenda.generaciones,
            ordenes: agenda.ordenes
        };
    
    } catch (err) {
        if (isAxiosError(err)) {
            throw err;
        }
    }

}
