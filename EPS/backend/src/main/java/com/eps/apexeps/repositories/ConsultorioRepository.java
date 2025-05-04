package com.eps.apexeps.repositories;

import java.util.List;

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

}
