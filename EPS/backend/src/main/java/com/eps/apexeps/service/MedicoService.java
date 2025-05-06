package com.eps.apexeps.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.users.Medico;
import com.eps.apexeps.repositories.MedicoRepository;
import com.eps.apexeps.repositories.TrabajaRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * Servicio para manejar la lógica de negocio relacionada con los médicos de una IPS.
 * Proporciona métodos para obtener, crear y actualizar médicos.
 * @author Nicolás Sabogal
 */
@Service
@RequiredArgsConstructor
public class MedicoService {

    /** Repositorio de médicos para acceder a la base de datos. */
    private final MedicoRepository medicoRepository;

    /** Repositorio de Trabaja para acceder a la base de datos. */
    private final TrabajaRepository trabajaRepository;

    /**
     * Método para obtener todos los médicos de la base de datos filtrarlos por diferentes criterios.
     * @param idIps El id de la IPS que se usará para filtrar los médicos (opcional).
     * @param dniNombreLike Cadena que se usará para filtrar los médicos por su DNI o nombre (opcional).
     * @param cupsServicioMedico El CUPS del servicio médico que se usará para filtrar los médicos (opcional).
     * @param codDiaSemana El día de la semana en el que el médico está disponible (opcional, 1 = Lunes -> 7 = Domingo).
     * @param horaDeInicio La hora de inicio de la jornada laboral del médico (opcional).
     * @param horaDeFin La hora de fin de la jornada laboral del médico (opcional, 0 a 23).
     * @param estaActivo Indica si el médico está activo o no (opcional, 0 a 23).
     * @param qSize Tamaño de la página (opcional).
     * @param qPage Número de la página (opcional).
     * @return Una lista de médicos.
     * @throws IllegalArgumentException Si el día de la semana no está entre 1 y 7 o si las horas no están entre 0 y 23.
     */
    public List<Medico> getMedicos(
        Integer idIps,
        String dniNombreLike,
        String cupsServicioMedico,
        Integer codDiaSemana,
        Integer horaDeInicio,
        Integer horaDeFin,
        Boolean estaActivo,
        Integer qSize,
        Integer qPage
    ) {
        Pageable pageable = Pageable.ofSize(qSize).withPage(qPage);
        List<Medico> medicos = medicoRepository
                .findAllFiltered(
                    idIps,
                    dniNombreLike,
                    cupsServicioMedico,
                    estaActivo,
                    pageable
                );
        
        if (codDiaSemana == null)
            return medicos;

        // Filtrar los médicos que no tienen el horario disponible para el día de la semana y las horas especificadas.
        if (codDiaSemana < 1 || codDiaSemana > 7)
            throw new IllegalArgumentException("El día de la semana debe estar entre 1 y 7.");
        
        if (horaDeInicio != null && (horaDeInicio < 0 || horaDeInicio > 23))
            throw new IllegalArgumentException("La hora de inicio debe estar entre 0 y 23.");

        if (horaDeFin != null && (horaDeFin < 0 || horaDeFin > 23))
            throw new IllegalArgumentException("La hora de fin debe estar entre 0 y 23.");

        // Para cada médico, eliminarlo si,
        medicos.removeIf(medico ->
            // entre sus trabaja
            trabajaRepository.findByMedico(medico).stream()
                // no hay ninguno que,
                .noneMatch(trabaja ->
                    // entre sus horarios
                    trabaja.getHorario().stream()
                        // hay alguno que cumple con el día de la semana y las horas especificadas.
                        .anyMatch(horario ->
                            horario.getDia().getValue() == codDiaSemana
                            && (horaDeInicio == null
                                || horario.getFin().getHour() > horaDeInicio
                            )
                            && (horaDeFin == null
                                || horario.getInicio().getHour() < horaDeFin
                            )
                        )
                        
                )
        );

        return medicos;
    }   

    /**
     * Método para obtener un médico específico por su DNI.
     * Se anota con @Transactional para permitir la carga perezosa de los dominios del médico.
     * @param dniMedico El DNI del médico que se desea obtener.
     * @return El médico correspondiente al DNI proporcionado.
     */
    @Transactional
    public Medico getMedico(Long dniMedico) {
        Medico medico = medicoRepository
                        .findById(dniMedico)
                        .orElse(null);
        
        // Cargar los dominios del médico para evitar problemas de LazyInitializationException.
        medico.getDominios().size();

        return medico;
    }

    /**
     * Método para crear un nuevo médico.
     * @param dniMedico El DNI del médico.
     * @param nombreMedico El nombre del médico.
     * @param emailMedico El correo electrónico del médico.
     * @param telefonoMedico El número de teléfono del médico.
     * @return El médico creado.
     * @throws IllegalArgumentException Si el médico ya existe.
     */
    public Medico createMedico(
        Long dniMedico,
        String nombreMedico,
        String emailMedico,
        String telefonoMedico
    ) {
        if (existsMedico(dniMedico))
            throw new IllegalArgumentException("El médico ya existe.");

        return saveMedico(
                dniMedico,
                nombreMedico,
                emailMedico,
                telefonoMedico
            );
    }

    /**
     * Método para actualizar un médico existente.
     * @param dniMedico El DNI del médico.
     * @param nombreMedico El nombre del médico.
     * @param emailMedico El correo electrónico del médico.
     * @param telefonoMedico El número de teléfono del médico.
     * @return El médico actualizado.
     * @throws IllegalArgumentException Si el médico no existe.
     */
    public Medico updateMedico(
        Long dniMedico,
        String nombreMedico,
        String emailMedico,
        String telefonoMedico
    ) {
        if (!existsMedico(dniMedico))
            throw new IllegalArgumentException("El médico no existe.");

        return saveMedico(
                dniMedico,
                nombreMedico,
                emailMedico,
                telefonoMedico
            );
    }

    /**
     * Método para comprobar si un médico existe en la base de datos.
     * @param dniMedico El DNI del médico.
     * @return true si el médico existe, false en caso contrario.
     */
    private boolean existsMedico(Long dniMedico) {
        return medicoRepository.existsById(dniMedico);
    }

    /**
     * Método para guardar un médico en la base de datos.
     * @param dniMedico El DNI del médico.
     * @param nombreMedico El nombre del médico.
     * @param emailMedico El correo electrónico del médico.
     * @param telefonoMedico El número de teléfono del médico.
     * @return El médico guardado.
     */
    private Medico saveMedico(
        Long dniMedico,
        String nombreMedico,
        String emailMedico,
        String telefonoMedico
    ) {
        return medicoRepository.save(
                    Medico.builder()
                        .dni(dniMedico)
                        .nombre(nombreMedico)
                        .email(emailMedico)
                        .telefono(telefonoMedico)
                        .build()
                );
    }

}
