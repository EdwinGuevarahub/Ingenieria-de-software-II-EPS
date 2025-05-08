/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.Ips;

/**
 *
 * @author Alexander
 */
@Repository
public interface IPSRespository extends JpaRepository<Ips, Integer>{
    
    List<Ips> findByNombreContainingIgnoreCase(String nombre);


    @Query(
        value = """
            SELECT DISTINCT i.*
            FROM ips i
            JOIN consultorio c ON c.ips_consultorio = i.id_ips
            JOIN servicio_medico sm ON sm.cups_sermed = c.sermed_consultorio
            WHERE LOWER(sm.nom_sermed) LIKE LOWER(CONCAT('%', :nombreServicio, '%'))
            ORDER BY i.nom_ips
            """,
        nativeQuery = true
    )
    List<Ips> buscarIpsPorNombreServicio(@Param("nombreServicio") String nombreServicio);

}
