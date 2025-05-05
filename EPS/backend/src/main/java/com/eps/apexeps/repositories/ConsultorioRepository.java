package com.eps.apexeps.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.Consultorio;
import com.eps.apexeps.models.ConsultorioId;

/**
 * Esta interfaz es un repositorio de JPA para la entidad Consultorio.
 * Proporciona métodos para realizar operaciones CRUD en la base de datos.
 * @author Nicolás Sabogal
 */
@Repository
public interface ConsultorioRepository extends JpaRepository<Consultorio, ConsultorioId> {

    /**
     * Método para encontrar todos los consultorios de una IPS por su id.
     * @param idIps El id de la IPS.
     * @return Una lista de consultorios asociados a la IPS.
     */
    List<Consultorio> findAllById_Ips_Id(Integer idIps);

    /**
     * Método para encontrar un consultorio específico por su id de IPS y el id del consultorio.
     * @param idIps El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @return El consultorio encontrado o null si no existe.
     */
    Optional<Consultorio> findById_Ips_IdAndId_IdConsultorio(Integer idIps, Integer idConsultorio);

    /**
     * Método para encontrar todos los consultorios por el CUPS del servicio médico asociado.
     * @param cupsServicioMedico El CUPS del servicio médico.
     * @return Una lista de consultorios asociados al servicio médico.
     */
    List<Consultorio> findAllByServicioMedico_Cups(String cupsServicioMedico);

    /**
     * Método para encontrar todos los consultorios de una IPS por su id y el CUPS del servicio médico asociado.
     * @param idIps El id de la IPS.
     * @param cupsServicioMedico El CUPS del servicio médico.
     * @return Una lista de consultorios asociados a la IPS y al servicio médico.
     */
    List<Consultorio> findAllById_Ips_IdAndServicioMedico_Cups(Integer idIps, String cupsServicioMedico);

    /**
     * Método para verificar si existe un consultorio por su id de IPS y el id del consultorio.
     * @param idIps El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @return true si existe, false en caso contrario.
     */
    boolean existsById_Ips_IdAndId_IdConsultorio(Integer idIps, Integer idConsultorio);

}
