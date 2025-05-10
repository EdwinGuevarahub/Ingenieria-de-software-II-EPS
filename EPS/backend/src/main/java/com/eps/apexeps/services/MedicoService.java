package com.eps.apexeps.services;

import java.time.DayOfWeek;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.Consultorio;
import com.eps.apexeps.models.ServicioMedico;
import com.eps.apexeps.models.relations.EntradaHorario;
import com.eps.apexeps.models.relations.Trabaja;
import com.eps.apexeps.models.users.Medico;
import com.eps.apexeps.repositories.*;
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

    /** Repositorio de consultorios para acceder a la base de datos. */
    private final ConsultorioRepository consultorioRepository;

    /** Repositorio de Trabaja para acceder a la base de datos. */
    private final TrabajaRepository trabajaRepository;

    /** Repositorio de ServicioMedico para acceder a la base de datos. */
    private final ServicioMedicoRepository servicioMedicoRepository;

    /** Repositorio de IPS para acceder a la base de datos. */
    private final IpsRepository ipsRepository;

    /**
     * Método para obtener todos los médicos de la base de datos filtrarlos por diferentes criterios.
     * @param idIps El id de la IPS que se usará para filtrar los médicos (opcional).
     * @param dniNombreLike Cadena que se usará para filtrar los médicos por su DNI o nombre (opcional).
     * @param cupsServicioMedico El CUPS del servicio médico que se usará para filtrar los médicos (opcional).
     * @param diaSemanaIngles Día de la semana para filtrar médicos en inglés y mayúsculas (opcional).
     * @param horaDeInicio La hora de inicio de la jornada laboral del médico (opcional).
     * @param horaDeFin La hora de fin de la jornada laboral del médico (opcional, 0 a 23).
     * @param estaActivo Indica si el médico está activo o no (opcional, 0 a 23).
     * @param qSize Tamaño de la página (opcional).
     * @param qPage Número de la página (opcional).
     * @return Una lista de médicos.
     * @throws IllegalArgumentException Si el día de la semana no está entre 1 y 7 o si las horas no están entre 0 y 23.
     * @see {@link java.time.DayOfWeek} Enumerador para los días de la semana usado.
     */
    public List<Medico> getMedicos(
        Integer idIps,
        String dniNombreLike,
        String cupsServicioMedico,
        String diaSemanaIngles,
        Integer horaDeInicio,
        Integer horaDeFin,
        Boolean estaActivo,
        Integer qSize,
        Integer qPage
    ) {
        // Validar los parámetros temporales.
        String diaSemanaParam = null;
        Integer inicioParam = null;
        Integer finParam = null;
        if (diaSemanaIngles != null) {
            try {
                diaSemanaParam = EntradaHorario.CHAR_MAP.get(DayOfWeek.valueOf(diaSemanaIngles)).toString();
            }
            catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("No se reconoce el día de la semana: " + diaSemanaIngles);
            }

            if (horaDeInicio != null && (horaDeInicio < 0 || horaDeInicio > 23))
                throw new IllegalArgumentException("La hora de inicio debe estar entre 0 y 23.");
            if (horaDeFin != null && (horaDeFin < 0 || horaDeFin > 23))
                throw new IllegalArgumentException("La hora de fin debe estar entre 0 y 23.");

            inicioParam = horaDeInicio;
            finParam = horaDeFin;
        }

        Pageable pageable = Pageable.ofSize(qSize).withPage(qPage);
        List<Medico> medicos = medicoRepository
                .findAllFiltered(
                    idIps,
                    dniNombreLike,
                    cupsServicioMedico,
                    diaSemanaParam,
                    inicioParam,
                    finParam,
                    estaActivo,
                    pageable
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
     * @param trabaja El objeto que contiene el médico a crear y un consultorio y horario de trabajo.
     * @return El objeto Trabaja que representa la relación entre el médico y el consultorio.
     * @throws IllegalArgumentException Si el médico ya existe, si el consultorio no existe o si algún horario es inválido.
     */
    public Trabaja createMedico(Trabaja trabaja) {
        if (medicoRepository.existsById(trabaja.getMedico().getDni()))
            throw new IllegalArgumentException("El médico ya existe.");

        Consultorio consultorio = consultorioRepository
                .findById(trabaja.getConsultorio().getId())
                .orElse(null);
        if (consultorio == null)
            throw new IllegalArgumentException("El consultorio no existe.");
            
        trabaja.setConsultorio(consultorio);
        consultorio.getId().setIps(
                ipsRepository
                    .findById(consultorio.getId().getIps().getId())
                    .orElse(null)
            );
                
        // TODO: Validar que el horario en el consultorio no esté ocupado por otro médico.

        medicoRepository.save(trabaja.getMedico());
        return trabajaRepository.save(trabaja);
    }

    /**
     * Método para actualizar un médico existente.
     * @param medico El médico a actualizar.
     * @return El médico actualizado.
     * @throws IllegalArgumentException Si el médico no existe.
     */
    public Medico updateMedico(Medico medico) {
        Medico medicoExistente = medicoRepository
                                    .findById(medico.getDni())
                                    .orElse(null);
        if (medicoExistente == null)
            throw new IllegalArgumentException("El médico no existe.");
        
        if (medico.getNombre() != null)
            medicoExistente.setNombre(medico.getNombre());
        
        if (medico.getEmail() != null)
            medicoExistente.setEmail(medico.getEmail());
        
        if (medico.getTelefono() != null)
            medicoExistente.setTelefono(medico.getTelefono());
        
        if (medico.getActivo() != null)
            medicoExistente.setActivo(medico.getActivo());

        return medicoRepository.save(medicoExistente);
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
     * Método para agregar un servicio médico a los dominios de un médico.
     * Se anota con @Transactional para asegurar que la sesión de Hibernate esté abierta
     * durante la ejecución del método.
     * @param dniMedico El DNI del médico.
     * @param servicioMedico El servicio médico a agregar.
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
     * @param servicioMedico El servicio médico a eliminar.
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
     * @param dniMedico El DNI del médico a validar.
     * @param servicioMedico El servicio médico a validar.
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
