package com.eps.apexeps.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.Consultorio;
import com.eps.apexeps.models.ConsultorioId;
import com.eps.apexeps.models.ServicioMedico;
import com.eps.apexeps.repositories.ConsultorioRepository;
import com.eps.apexeps.repositories.IpsRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio para manejar la lógica de negocio relacionada con los consultorios de una IPS.
 * Proporciona métodos para obtener, crear y actualizar consultorios.
 * @author Nicolás Sabogal
 */
@Service
@RequiredArgsConstructor
public class ConsultorioService {

    /** Repositorio de consultorios para acceder a la base de datos. */
    private final ConsultorioRepository consultorioRepository;

    /** Repositorio de IPS para acceder a la base de datos. */
    private final IpsRepository ipsRepository;

    /**
     * Método para obtener todos los consultorios de la base de datos o de una IPS específica.
     * @param idIps El id de la IPS. Si es null, se obtienen todos los consultorios.
     * @param idConsultorioLike Cadena que se usará para filtrar los consultorios por su id (opcional).
     * @param cupsServicioMedico El CUPS del servicio médico asociado a los consultorios (opcional).
     * @param qPage Tamaño de la página (opcional).
     * @param qSize Número de la página (opcional).
     * @return Una lista de consultorios.
     */
    public List<Consultorio> getConsultorios(
        Integer idIps,
        Integer idConsultorioLike,
        String cupsServicioMedico,
        Integer qSize,
        Integer qPage
    ) {
        String idConsultorioLikeStr = "";
        if (idConsultorioLike != null)
            idConsultorioLikeStr = String.valueOf(idConsultorioLike);

        Pageable pageable = Pageable.ofSize(qSize).withPage(qPage);
        return consultorioRepository
                .findAllFiltered(
                    idIps,
                    idConsultorioLikeStr,
                    cupsServicioMedico,
                    pageable
                );
    }

    /**
     * Método para obtener un consultorio específico por su id de IPS y el id del consultorio.
     * @param idIps El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @return El consultorio encontrado o null si no existe.
     */
    public Consultorio getConsultorio(Integer idIps, Integer idConsultorio) {
        return consultorioRepository
                .findById_Ips_IdAndId_IdConsultorio(idIps, idConsultorio)
                .orElse(null);
    }

    /**
     * Método para crear un nuevo consultorio.
     * @param idIps El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @param cupsServicioMedico El CUPS del servicio médico que presta el consultorio.
     * @return El consultorio creado.
     * @throws IllegalArgumentException Si el consultorio ya existe.
     */
    public Consultorio createConsultorio(
        Integer idIps, Integer idConsultorio, String cupsServicioMedico
    ) {
        if (existsConsultorio(idIps, idConsultorio))
            throw new IllegalArgumentException( "El consultorio ya existe.");

        return saveConsultorio(idIps, idConsultorio, cupsServicioMedico);
    }

    /**
     * Método para actualizar un consultorio existente.
     * @param idIps El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @param cupsServicioMedico El CUPS del servicio médico que presta el consultorio.
     * @return El consultorio actualizado.
     * @throws IllegalArgumentException Si el consultorio no existe.
     */
    public Consultorio updateConsultorio(
        Integer idIps, Integer idConsultorio, String cupsServicioMedico
    ) {
        if (!existsConsultorio(idIps, idConsultorio))
            throw new IllegalArgumentException( "El consultorio no existe.");

        return saveConsultorio(idIps, idConsultorio, cupsServicioMedico);
    }

    /**
     * Método para comprobar si un consultorio existe en la base de datos.
     * @param idIps El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @return true si el consultorio existe, false en caso contrario.
     */
    private boolean existsConsultorio(Integer idIps, Integer idConsultorio) {
        return consultorioRepository
            .existsById_Ips_IdAndId_IdConsultorio(idIps, idConsultorio);
    }

    /**
     * Método para guardar un consultorio en la base de datos.
     * @param idIps El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @param cupsServicioMedico El CUPS del servicio médico que presta el consultorio.
     * @return El consultorio guardado.
     */
    private Consultorio saveConsultorio(
        Integer idIps, Integer idConsultorio, String cupsServicioMedico
    ) {
        return consultorioRepository.save(
                    Consultorio.builder()
                        .id(ConsultorioId
                            .builder()
                            .ips(ipsRepository
                                .findById(idIps)
                                .orElse(null)
                            )
                            .idConsultorio(idConsultorio)
                            .build()
                        )
                        .servicioMedico(ServicioMedico
                            .builder()
                            .cups(cupsServicioMedico)
                            .build()
                        )
                        .build()
                );
    }
    
}
