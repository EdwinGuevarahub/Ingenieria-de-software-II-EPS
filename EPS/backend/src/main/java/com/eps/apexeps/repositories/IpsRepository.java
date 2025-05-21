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
 * Repositorio para la entidad Ips.
 * Proporciona métodos de consulta personalizados y por convención.
 * 
 * @author Alexander
 */
@Repository
public interface IpsRepository extends JpaRepository<Ips, Integer> {

        /*
         * Consulta personalizada: filtrar IPS por nombre, teléfono, dirección y fecha
         * de registro.
         */
        @Query(value = """
                        SELECT DISTINCT i.*
                        FROM ips i
                        JOIN consultorio c ON c.ips_consultorio = i.id_ips
                        JOIN servicio_medico sm ON sm.cups_sermed = c.sermed_consultorio
                        WHERE
                            (:nombre IS NULL OR LOWER(i.nom_ips) LIKE LOWER(CONCAT('%', CAST(:nombre AS TEXT), '%'))) AND
                            (:telefono IS NULL OR LOWER(i.tel_ips) LIKE LOWER(CONCAT('%', CAST(:telefono AS TEXT), '%'))) AND
                            (:direccion IS NULL OR LOWER(i.dir_ips) LIKE LOWER(CONCAT('%', CAST(:direccion AS TEXT), '%'))) AND
                            (:fechaRegistro IS NULL OR date_trunc('day', i.freg_ips) = TO_TIMESTAMP(CAST(:fechaRegistro AS TEXT), 'DD-MM-YYYY')) AND
                            (:nombreServicio IS NULL OR LOWER(sm.nom_sermed) LIKE LOWER(CONCAT('%', CAST(:nombreServicio AS TEXT), '%')))
                        """, nativeQuery = true)
        List<Ips> filtrarIpsMultiples(
                        @Param("nombre") String nombre,
                        @Param("telefono") String telefono,
                        @Param("direccion") String direccion,
                        @Param("fechaRegistro") String fechaRegistro,
                        @Param("nombreServicio") String nombreServicio);

        // Consulta personalizada: buscar IPS que ofrezcan servicios médicos con nombre similar
        @Query(value = """
                            SELECT DISTINCT i.*
                            FROM ips i
                            JOIN consultorio c ON c.ips_consultorio = i.id_ips
                            JOIN servicio_medico sm ON sm.cups_sermed = c.sermed_consultorio
                            WHERE LOWER(sm.nom_sermed) LIKE LOWER(CONCAT('%', :nombreServicio, '%'))
                            ORDER BY i.nom_ips
                        """, nativeQuery = true)
        List<Ips> buscarIpsPorNombreServicio(@Param("nombreServicio") String nombreServicio);

        /**
         * Consulta personalizada: buscar servicios médicos por nombre de IPS o ID de
         * IPS.
         */
        @Query(value = """
                            SELECT DISTINCT sm.nom_sermed
                            FROM ips i
                            JOIN consultorio c ON c.ips_consultorio = i.id_ips
                            JOIN servicio_medico sm ON sm.cups_sermed = c.sermed_consultorio
                            WHERE (:nombreIps IS NULL OR LOWER(i.nom_ips) LIKE LOWER(CONCAT('%', :nombreIps, '%')))
                              OR (:idIps IS NOT NULL AND i.id_ips = :idIps)
                        """, nativeQuery = true)
        List<String> buscarServicioPorNombreOIdIps(@Param("nombreIps") String nombreIps, @Param("idIps") Integer idIps);
}
