package com.eps.apexeps.services;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.eps.apexeps.models.DTOs.SolicitudCitaDTO;
import com.eps.apexeps.models.DTOs.SolicitudExamenDTO;
import com.eps.apexeps.models.DTOs.response.slotDisp;
import com.eps.apexeps.models.entity.ServicioMedico;
import com.eps.apexeps.models.entity.relations.*;
import com.eps.apexeps.models.entity.users.Paciente;
import com.eps.apexeps.repositories.*;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import org.springframework.data.domain.Page;

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

    private final PagoAfiliacionRepository pagoAfiliacionRepository;

    private final ServicioMedicoRepository servicioMedicoRepository;

    private final PacienteRepository pacienteRepository;

    private final AgendaRepository agendaRepo;

    private final OrdenaRepository ordenaRepo;

    private final TrabajaRepository trabajaRepo;

    private final AgendaRepository newAgendaRepo;

    private final PagoAfiliacionRepository pagoRepo;

    private final ServicioMedicoRepository servicioRepo;
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
     * Método para obtener todas las agendas de la base de datos asociadas a un paciente.
     * @param cupsServicioMedico El CUPS del servicio médico asociado a la agenda (opcional).
     * @param fecha La fecha de la cita (opcional).
     * @param horaDeInicio Inicio del filtro por hora (opcional).
     * @param horaDeFin Fin del filtro por hora (opcional).
     * @param qSize Tamaño de la página (por defecto, 10).
     * @param qPage Número de la página (por defecto, 0).
     * @return Una colección de entradas de agenda.
     */
    public Page<slotDisp> getAgendasbyservicio_ips(
            String cupsServicioMedico,
            String idIps,
            String fecha,
            String horaDeInicio,
            String horaDeFin,
            Integer qSize,
            Integer qPage
    ) {

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        LocalDate dia = (fecha != null) ? LocalDate.parse(fecha, dateFormatter) : LocalDate.now();
        LocalTime horaIni = (horaDeInicio != null) ? LocalTime.parse(horaDeInicio, timeFormatter) : LocalTime.of(6, 0);
        LocalTime horaFin = (horaDeFin != null) ? LocalTime.parse(horaDeFin, timeFormatter) : LocalTime.of(20, 0);

        int duracion = 30;

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

        // puestos que ofrecen ese servicio en esa IPS||
        List<Trabaja> puestos = trabajaRepo
                .buscarTrabajosPorIpsYServicio(
                        Integer.valueOf(idIps), cupsServicioMedico);
        if (puestos.isEmpty()) return Page.empty();

        // agendas ya ocupadas para todos esos puestos en rango
        List<Integer> trabajaIds = puestos.stream()
                .map(Trabaja::getId)
                .toList();

        Instant desde = dia.atTime(horaIni).atZone(ZoneId.systemDefault()).toInstant();
        Instant hasta = dia.atTime(horaFin).atZone(ZoneId.systemDefault()).toInstant();

        List<Agenda> ocupadas = agendaRepo
                .findByTrabajaIdInAndFechaBetween(trabajaIds, desde, hasta);

        // Índice rápido: (trabajaId, Instant) →
        Set<String> ocupadasIndex = ocupadas.stream()
                .map(a -> a.getTrabaja().getId() + "|" + a.getFecha())
                .collect(Collectors.toSet());

        // Genera slots libres
        List<slotDisp> libres = new ArrayList<>();
        DayOfWeek diaActual = dia.getDayOfWeek();

        for (Trabaja t : puestos) {
            for (EntradaHorario entrada : t.getHorario()) {
                if (!entrada.getDia().equals(diaActual)) continue;

                LocalTime inicio = entrada.getInicio();
                LocalTime fin = entrada.getFin();

                for (LocalTime hora = inicio; hora.isBefore(fin); hora = hora.plusMinutes(duracion)) {
                    if (hora.isBefore(horaIni) || hora.isAfter(horaFin)) continue;

                    Instant slot = dia.atTime(hora).atZone(ZoneId.systemDefault()).toInstant();
                    String key = t.getId() + "|" + slot;

                    if (!ocupadasIndex.contains(key)) {
                        libres.add(new slotDisp(
                                t.getMedico().getDni(),
                                t.getMedico().getNombre(),
                                t.getConsultorio().getId().getIdConsultorio(),
                                dia,
                                hora
                        ));
                    }
                }
            }
        }

        int start = qPage * qSize;
        int end = Math.min(start + qSize, libres.size());

        List<slotDisp> pagina = libres.subList(start, end);
        return new PageImpl<>(pagina, pageable, libres.size());
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

        // TODO: Validar que no exista otra agenda con la misma fecha, hora y trabaja.

        Agenda agendaActualizada = agendaRepository.findById(agenda.getId()).orElse(null);
        agendaActualizada.setFecha(agenda.getFecha());
        agendaActualizada.setTrabaja(agenda.getTrabaja());
        return agendaRepository.save(agendaActualizada);
    }

    /**
     * Método para cancelar la cita de la agenda por su ID.
     * @param id El ID de la agenda a cancelar.
     * @return La agenda actualizada.
     */
    @Transactional
    public Agenda cancelarAgendaById(Integer id) {
        Agenda agenda = agendaRepository.findById(id).orElse(null);
        if (agenda == null)
            return agenda;

        agenda.setEstado("CANCELADA");
        agenda = agendaRepository.save(agenda);

        // Cargar las relaciones necesarias para evitar LazyInitializationException.
        agenda.getGeneraciones().size();
        agenda.getOrdenes().size();
        return agenda;
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

    @Transactional
    public Agenda registrarExamen(SolicitudExamenDTO dto) {

        /* 1. Valida afiliación (≤ 1 año) */
        verificarAfiliacion(dto.getDniPaciente());

        /* 2. Valida que la orden exista y corresponda al paciente */
        Ordena orden = ordenaRepo.validar(
                        dto.getAgendaOrden(),
                        dto.getCupsServicio(),
                        dto.getDniPaciente())
                .orElseThrow(() ->
                        new IllegalArgumentException("La orden no existe o no pertenece al paciente"));

        /* 3. Localiza médico-consultorio */
        Trabaja trabaja = trabajaRepo
                .findByMedico_DniAndConsultorio_Id_IdConsultorio(
                        dto.getDniMedico(), dto.getIdConsultorio())
                .orElseThrow(() ->
                        new IllegalArgumentException("El médico no trabaja en ese consultorio"));

        /* 4. Comprueba disponibilidad */
        Instant fechaHora = dto.getFecha()
                .atTime(dto.getHora())
                .atZone(ZoneId.systemDefault())
                .toInstant();

        if (agendaRepo.existsByTrabajaAndFecha(trabaja, fechaHora)) {
            throw new IllegalStateException("Horario ocupado");
        }

        /* 5. Registra en agenda */
        Agenda nueva = Agenda.builder()
                .paciente(orden.getId().getAgenda().getPaciente())
                .trabaja(trabaja)
                .fecha(fechaHora)
                .estado("PENDIENTE")
                .build();

        Agenda guardada = newAgendaRepo.save(nueva);

        ServicioMedico servicio = servicioRepo.findByCups(dto.getCupsServicio())
                .orElseThrow(() -> new IllegalArgumentException(
                        "El servicio " + dto.getCupsServicio() + " no existe"));

        /* 6. Relaciona nuevo examen con servicio solicitado */
        OrdenaId ordenaId = OrdenaId.builder()
                .agenda(guardada)
                .servicio(servicio)
                .build();

        Ordena examen = Ordena.builder()
                .id(ordenaId)
                .build();

        ordenaRepo.save(examen);

        return guardada;
    }

    /* -------- utilidades ---------- */

    private void verificarAfiliacion(Long dni) {
        Instant ultimoPago = pagoRepo.findUltimoPago(dni);
        if (ultimoPago == null ||
                ultimoPago.isBefore(Instant.now().minus(365, ChronoUnit.DAYS))) {
            throw new IllegalStateException("Afiliación vencida");
        }
    }
}
