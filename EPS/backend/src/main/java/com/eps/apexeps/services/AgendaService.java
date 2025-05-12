package com.eps.apexeps.services;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.relations.Agenda;
import com.eps.apexeps.repositories.AgendaRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio para manejar la lógica de negocio relacionada con las agendas médicas.
 * Proporciona métodos para obtener y actualizar agendas.
 * @author Nicolás Sabogal
 */
@Service
@RequiredArgsConstructor
public class AgendaService {

    /** Repositorio de agendas para acceder a la base de datos. */
    private final AgendaRepository agendaRepository;

    /**
     * Método para obtener todas las agendas de la base de datos asociadas a un paciente.
     * @param dniPaciente El DNI del paciente.
     * @param dniNombreMedicoLike Cadena que se usará para filtrar los médicos por su DNI o nombre (opcional).
     * @param cupsServicioMedico El CUPS del servicio médico asociado a la agenda (opcional).
     * @param fecha La fecha de la cita (opcional).
     * @param horaDeInicio Inicio del filtro por hora (opcional).
     * @param horaDeFin Fin del filtro por hora (opcional).
     * @param qSize Tamaño de la página (por defecto, 10).
     * @param qPage Número de la página (por defecto, 0).
     * @return Una colección de entradas de agenda.
     */
    public List<Agenda> getAgendasPaciente(
        Long dniPaciente,
        String dniNombreMedicoLike,
        String cupsServicioMedico,
        String fecha,
        String horaDeInicio,
        String horaDeFin,
        Integer qSize,
        Integer qPage
    ) {
        Pageable pageable = Pageable.ofSize(qSize).withPage(qPage);
        return agendaRepository.findAllFilteredByPaciente(
                    dniPaciente,
                    dniNombreMedicoLike,
                    cupsServicioMedico,
                    fecha,
                    horaDeInicio,
                    horaDeFin,
                    pageable
                );
    }

}
