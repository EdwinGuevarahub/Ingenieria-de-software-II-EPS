package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.ServicioMedico;

/**
 * Repositorio para la entidad ServicioMedico.
 * Proporciona métodos para realizar operaciones CRUD en la base de datos.
 * @author Nicolás Sabogal
 */
@Repository
public interface ServicioMedicoRepository extends JpaRepository<ServicioMedico, String> {

}
