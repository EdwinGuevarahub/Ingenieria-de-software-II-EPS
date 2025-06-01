package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.relations.Trabaja;
import java.util.List;
import java.util.Optional;

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

    /*  Todos los consultorios donde labora un médico (por su DNI) */
    List<Trabaja> findByMedico_Dni(Long dniMedico);

    Optional<Trabaja> findByMedico_DniAndConsultorio_Id(Long dniMedico,
                                                        Integer idConsultorio);

    Optional<Trabaja> findByMedico_DniAndConsultorio_Id_IdConsultorio(
            Long dniMedico,
            Integer idConsultorio);


    @Query("""
       SELECT t
         FROM Trabaja t
        WHERE t.medico.dni = :dni
          AND t.consultorio.id.idConsultorio = :idCons
       """)
    Optional<Trabaja> buscarPorMedicoYConsultorio(Long dniMedico, Integer idConsultorio);

}
