package com.eps.apexeps.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.relations.Agenda;
import com.eps.apexeps.models.relations.Trabaja;
import com.eps.apexeps.repositories.AgendaRepository;
import com.eps.apexeps.repositories.TrabajaRepository;

import jakarta.transaction.Transactional;
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

    /** Repositorio de relaciones trabaja para acceder a la base de datos. */
    private final TrabajaRepository trabajaRepository;

    /**
     * Método para obtener todas las agendas de la base de datos asociadas a un paciente.
     * @param dniPaciente El DNI del paciente.
     * @param dniMedico El DNI del médico.
     * @param dniNombrePacienteLike Cadena que se usará para filtrar los pacientes por su DNI o nombre (opcional).
     * @param dniNombreMedicoLike Cadena que se usará para filtrar los médicos por su DNI o nombre (opcional).
     * @param cupsServicioMedico El CUPS del servicio médico asociado a la agenda (opcional).
     * @param fecha La fecha de la cita (opcional).
     * @param horaDeInicio Inicio del filtro por hora (opcional).
     * @param horaDeFin Fin del filtro por hora (opcional).
     * @param qSize Tamaño de la página (por defecto, 10).
     * @param qPage Número de la página (por defecto, 0).
     * @return Una colección de entradas de agenda.
     */
    public Page<Agenda> getAgendas(
        Long dniPaciente,
        Long dniMedico,
        String dniNombrePacienteLike,
        String dniNombreMedicoLike,
        String cupsServicioMedico,
        String fecha,
        String horaDeInicio,
        String horaDeFin,
        Integer qSize,
        Integer qPage
    ) {
        if (fecha != null)
            try {
                LocalDate.parse(fecha, DateTimeFormatter.ofPattern("dd-MM-yyyy"));
            } catch (Exception e) {
                throw new IllegalArgumentException("Fecha inválida. Formato esperado: dd-MM-yyyy");
            }

        if (horaDeInicio != null)
            try {
                LocalTime.parse(horaDeInicio, DateTimeFormatter.ofPattern("HH:mm"));
            } catch (Exception e) {
                throw new IllegalArgumentException("Hora de inicio inválida. Formato esperado: HH:mm");
            }

        if (horaDeFin != null)
            try {
                LocalTime.parse(horaDeFin, DateTimeFormatter.ofPattern("HH:mm"));
            } catch (Exception e) {
                throw new IllegalArgumentException("Hora de fin inválida. Formato esperado: HH:mm");
            }

        Pageable pageable = Pageable.ofSize(qSize).withPage(qPage);
        return agendaRepository.findAllFiltered(
                    dniPaciente,
                    dniMedico,
                    dniNombrePacienteLike,
                    dniNombreMedicoLike,
                    cupsServicioMedico,
                    fecha,
                    horaDeInicio,
                    horaDeFin,
                    pageable
                );
    }

    /**
     * Método para obtener una agenda por su ID.
     * La etiqueta @Transactional asegura que la operación se realice dentro de una transacción.
     * @param id El ID de la agenda.
     * @return La agenda correspondiente al ID proporcionado o null si no se encuentra.
     */
    @Transactional
    public Agenda getAgendaById(Integer id) {
        Agenda agenda = agendaRepository.findById(id).orElse(null);
        if (agenda == null)
            return agenda;

        // Cargar las relaciones necesarias para evitar LazyInitializationException.
        agenda.getGeneraciones().size();
        agenda.getOrdenes().size();
        return agenda;
    }

    /**
     * Método para actualizar la fecha y la relación trabaja de una agenda.
     * @param agenda La agenda a actualizar.
     * @return La agenda actualizada.
     * @throws IllegalArgumentException Si la agenda no existe.
     */
    public Agenda updateTrabajaFechaAgenda(Agenda agenda) {
        if (!agendaRepository.existsById(agenda.getId()))
            throw new IllegalArgumentException("La agenda no existe");

        if (agenda.getFecha() == null)
            throw new IllegalArgumentException("La fecha no puede ser nula");
        
        Trabaja trabaja = trabajaRepository.findById(agenda.getTrabaja().getId()).orElseThrow( () ->
                                new IllegalArgumentException("La relación trabaja no existe")
                            );
        
        if (    agenda.getTrabaja().getConsultorio().getId() != null
             && agenda.getTrabaja().getConsultorio().getId() != trabaja.getConsultorio().getId()
           )
            throw new IllegalArgumentException("El consultorio de la relación trabaja no coincide con el de la agenda");
        
        if (    agenda.getTrabaja().getMedico().getDni() != null
             && agenda.getTrabaja().getMedico().getDni() != trabaja.getMedico().getDni()
           )
            throw new IllegalArgumentException("El médico de la relación trabaja no coincide con el de la agenda");

        Agenda agendaActualizada = agendaRepository.findById(agenda.getId()).orElse(null);
        agendaActualizada.setFecha(agenda.getFecha());
        agendaActualizada.setTrabaja(agenda.getTrabaja());
        return agendaRepository.save(agendaActualizada);
    }

}
