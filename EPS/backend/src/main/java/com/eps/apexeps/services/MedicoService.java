package com.eps.apexeps.services;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.ServicioMedico;
import com.eps.apexeps.models.users.Medico;
import com.eps.apexeps.repositories.MedicoRepository;
import com.eps.apexeps.repositories.ServicioMedicoRepository;
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

    /** Repositorio de ServicioMedico para acceder a la base de datos. */
    private final ServicioMedicoRepository servicioMedicoRepository;

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

        // Para cada trabaja que tenga algún medico de la lista.
        trabajaRepository.findByMedicoIn(medicos).stream()
            // no hay ninguno que,
            .noneMatch(trabaja ->
                // entre sus horarios
                trabaja.getHorario().stream()
                    // hay alguno que cumple con el día de la semana y las horas especificadas.
                    .anyMatch(horario ->
                        horario.getDia().getValue() == codDiaSemana
                        && (horaDeInicio == null
                            || horario.getInicio().getHour() <= horaDeInicio
                        )
                        && (horaDeFin == null
                            || horario.getFin().getHour() >= horaDeFin
                        )
                    )
                    
            );

        return medicos;
    }   

    /**
     * Método para obtener un médico específico por su DNI.
     * @param dniMedico El DNI del médico que se desea obtener.
     * @return El médico correspondiente al DNI proporcionado.
     */
    public Medico getMedico(Long dniMedico) {
        return medicoRepository
                .findById(dniMedico)
                .orElse(null);
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

    /**
     * Método para obtener todos los servicios médicos dominados por un médico.
     * Se anota con @Transactional para asegurar que la sesión de Hibernate esté abierta
     * durante la ejecución del método.
     * @param dniMedico El DNI del médico.
     * @return Una lista de servicios médicos dominados por el médico.
     * @throws IllegalArgumentException Si el médico no existe.
     */
    @Transactional
    public List<ServicioMedico> getAllDominiosMedico(Long dniMedico) {
        Medico medico = medicoRepository
                            .findById(dniMedico)
                            .orElse(null);

        if (medico == null)
            throw new IllegalArgumentException("El médico no existe.");
        
        List<ServicioMedico> dominios = medico.getDominios();
        dominios.size(); // Inicializa la colección para evitar LazyInitializationException.
        return dominios;
    }

    /**
     * Método para obtener un servicio médico específico dominado por un médico.
     * Se anota con @Transactional para asegurar que la sesión de Hibernate esté abierta
     * durante la ejecución del método.
     * @param dniMedico El DNI del médico.
     * @param cupsServicioMedico El CUPS del servicio médico.
     * @return El servicio médico correspondiente al CUPS o null si el médico no lo domina.
     * @throws IllegalArgumentException Si el médico o el servicio médico no existen.
     */
    @Transactional
    public ServicioMedico getDominioMedico(Long dniMedico, String cupsServicioMedico) {
        Object[] validados = validarMedicoAndServicio(dniMedico, cupsServicioMedico);
        Medico medico = (Medico) validados[0];
        ServicioMedico servicioMedico = (ServicioMedico) validados[1];
        
        if (!medico.getDominios().contains(servicioMedico))
            return null;
        
        return servicioMedico;
    }

    /**
     * Método para agregar un servicio médico a los dominios de un médico.
     * Se anota con @Transactional para asegurar que la sesión de Hibernate esté abierta
     * durante la ejecución del método.
     * @param dniMedico El DNI del médico.
     * @param cupsServicioMedico El CUPS del servicio médico.
     * @return Una lista de servicios médicos restantes asociados al médico.
     * @throws IllegalArgumentException Si el médico o el servicio médico no existen.
     */
    @Transactional
    public List<ServicioMedico> addDominioMedico(Long dniMedico, String cupsServicioMedico) {
        Object[] validados = validarMedicoAndServicio(dniMedico, cupsServicioMedico);
        Medico medico = (Medico) validados[0];
        ServicioMedico servicioMedico = (ServicioMedico) validados[1];

        List<ServicioMedico> dominios = medico.getDominios();
        if (dominios.contains(servicioMedico))
            throw new IllegalArgumentException("El médico ya tiene este servicio médico como dominio.");

        dominios.add(servicioMedico);
        medico = medicoRepository.save(medico);
        return dominios;
    }

    /**
     * Método para eliminar un servicio médico de los dominios de un médico.
     * Se anota con @Transactional para asegurar que la sesión de Hibernate esté abierta
     * durante la ejecución del método.
     * @param dniMedico El DNI del médico.
     * @param cupsServicioMedico El CUPS del servicio médico.
     * @return Una lista de servicios médicos restantes asociados al médico.
     * @throws IllegalArgumentException Si el médico o el servicio médico no existen o si el médico no lo domina.
     */
    @Transactional
    public List<ServicioMedico> deleteDominioMedico(Long dniMedico, String cupsServicioMedico) {
        Object[] validados = validarMedicoAndServicio(dniMedico, cupsServicioMedico);
        Medico medico = (Medico) validados[0];
        ServicioMedico servicioMedico = (ServicioMedico) validados[1];

        List<ServicioMedico> dominios = medico.getDominios();
        if (!dominios.contains(servicioMedico))
            throw new IllegalArgumentException("El médico no tiene este servicio médico como dominio.");

        dominios.remove(servicioMedico);
        medico = medicoRepository.save(medico);
        return dominios;
    }

    /**
     * Método privado para validar la existencia de un médico y un servicio médico.
     * @param dniMedico El DNI del médico.
     * @param cupsServicioMedico El CUPS del servicio médico.
     * @return Un array con el médico y el servicio médico validados.
     * @throws IllegalArgumentException Si el médico o el servicio médico no existen.
     */
    private Object[] validarMedicoAndServicio(Long dniMedico, String cupsServicioMedico) {
        Medico medico = medicoRepository
                            .findById(dniMedico)
                            .orElse(null);

        if (medico == null)
            throw new IllegalArgumentException("El médico no existe.");

        ServicioMedico servicioMedico = servicioMedicoRepository
                                            .findById(cupsServicioMedico)
                                            .orElse(null);

        if (servicioMedico == null)
            throw new IllegalArgumentException("El servicio médico no existe.");

        return new Object[] { medico, servicioMedico };
    }

}
