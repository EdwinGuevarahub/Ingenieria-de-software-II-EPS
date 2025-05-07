package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.relations.Trabaja;
import java.util.List;
import com.eps.apexeps.models.users.Medico;


/**
 * Repositorio para la entidad Trabaja, que representa la relación entre un médico y un consultorio.
 * Proporciona métodos para realizar operaciones CRUD en la base de datos.
 * @author Nicolás Sabogal
 */
@Repository
public interface TrabajaRepository extends JpaRepository<Trabaja, Integer> {
    
    /**
     * Método para encontrar todas las relaciones de trabajo de un médico específico.
     * @param medico El médico del que se desean obtener las relaciones de trabajo.
     * @return Una lista de relaciones de trabajo asociadas al médico.
     */
    List<Trabaja> findByMedico(Medico medico);
    
}
