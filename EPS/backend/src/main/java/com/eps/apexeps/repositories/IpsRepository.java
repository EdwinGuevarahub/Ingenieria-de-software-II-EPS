package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.Ips;

/**
 * Esta interfaz es un repositorio de JPA para la entidad Ips.
 * Proporciona métodos para realizar operaciones CRUD en la base de datos.
 * @author Nicolás Sabogal
 */
@Repository
public interface IpsRepository extends JpaRepository<Ips, Integer> {
    
}
