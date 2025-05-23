package com.eps.apexeps.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.Consultorio;
import com.eps.apexeps.models.relations.Trabaja;
import com.eps.apexeps.models.users.Medico;



/**
 * Repositorio para la entidad Trabaja, que representa la relación entre un médico y un consultorio.
 * Proporciona métodos para realizar operaciones CRUD en la base de datos.
 * @author Nicolás Sabogal
 */
@Repository
public interface TrabajaRepository extends JpaRepository<Trabaja, Integer> {

    /**
     * Método para encontrar todas las relaciones de trabajo asociadas a un conjunto de médicos.
     * @param medicos Una lista de médicos para los cuales se desean encontrar las relaciones de trabajo.
     * @return Una lista de relaciones de trabajo asociadas a los médicos proporcionados.
     */
    List<Trabaja> findByMedicoIn(List<Medico> medicos);
    
    List<Trabaja> findByMedico_Dni(long dniMedico);

    List<Trabaja> findByConsultorio(Consultorio consultorio);
    
}
