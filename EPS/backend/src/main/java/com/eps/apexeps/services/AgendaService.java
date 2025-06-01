package com.eps.apexeps.services;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

import com.eps.apexeps.models.DTOs.SolicitudCitaDTO;
import com.eps.apexeps.models.ServicioMedico;
import com.eps.apexeps.models.users.Paciente;
import com.eps.apexeps.repositories.*;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.relations.Agenda;
import com.eps.apexeps.models.relations.Trabaja;

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

    private final PagoAfiliacionRepository pagoAfiliacionRepository;

    private final ServicioMedicoRepository servicioMedicoRepository;

    private final PacienteRepository pacienteRepository;

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
    public List<Agenda> getAgendas(
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

    @Transactional
    public Agenda registrarCita(SolicitudCitaDTO dto) {

        // 1. Paciente
        Paciente paciente = pacienteRepository.findById(dto.getDniPaciente())
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));

        // 2. Afiliación vigente (último pago < 1 año)
        Instant ultimoPago = pagoAfiliacionRepository.findUltimoPago(dto.getDniPaciente());
        if (ultimoPago == null
                || ultimoPago.isBefore(Instant.now().minus(365, ChronoUnit.DAYS))) {
            throw new IllegalStateException("El paciente no tiene afiliación activa");
        }

        // 3. Relación médico-consultorio
        Trabaja trabaja = dto.getIdConsultorio() == null
                ? trabajaRepository.findByMedico_Dni(dto.getDniMedico())
                .stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("El médico no tiene consultorio asignado"))
                : trabajaRepository.findByMedico_DniAndConsultorio_Id_IdConsultorio(
                        dto.getDniMedico(), dto.getIdConsultorio())
                .orElseThrow(() -> new IllegalStateException("Médico y consultorio no coinciden"));

        // 4. Fecha/hora solicitadas
        Instant fechaHora = dto.getFecha()
                .atTime(dto.getHora())
                .atZone(ZoneId.systemDefault())
                .toInstant();

        // 5. Disponibilidad
        if (agendaRepository.existsByTrabajaAndFecha(trabaja, fechaHora)) {
            throw new IllegalStateException("Ese horario ya está ocupado");
        }


        // 6. Servicios médicos
        List<ServicioMedico> servicios = servicioMedicoRepository
                .findAllById(dto.getCupsServicios());
        if (servicios.size() != dto.getCupsServicios().size()) {
            throw new IllegalArgumentException("Algún CUPS no es válido");
        }

        // 7. Persistir en base de datos
        Agenda agenda = Agenda.builder()
                .paciente(paciente)
                .trabaja(trabaja)
                .fecha(fechaHora)
                .ordenes(servicios)
                .estado("PENDIENTE")
                .build();

        return agendaRepository.save(agenda);
    }
    
}
