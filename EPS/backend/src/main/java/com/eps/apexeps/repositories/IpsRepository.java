/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.DTOs.ServicioEnIpsDTO;
import com.eps.apexeps.models.entity.Ips;

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
                            (:cupsServicio IS NULL OR LOWER(sm.cups_sermed) LIKE LOWER(CONCAT('%', CAST(:cupsServicio AS TEXT), '%')))
                        """, nativeQuery = true)
        Page<Ips> filtrarIpsMultiples(
                        @Param("nombre") String nombre,
                        @Param("telefono") String telefono,
                        @Param("direccion") String direccion,
                        @Param("fechaRegistro") String fechaRegistro,
                        @Param("cupsServicio") String cupsServicio,
                        Pageable pageable);

        // Consulta personalizada: buscar IPS que ofrezcan servicios médicos con nombre similar
        @Query(value = """
                            SELECT DISTINCT i.*
                            FROM ips i
                            JOIN consultorio c ON c.ips_consultorio = i.id_ips
                            JOIN servicio_medico sm ON sm.cups_sermed = c.sermed_consultorio
                            WHERE LOWER(sm.cups_sermed) LIKE LOWER(CONCAT('%', :cupsServicio, '%'))
                            ORDER BY i.nom_ips
                        """, nativeQuery = true)
        List<Ips> buscarIpsPorCupsServicio(@Param("cupsServicio") String cupsServicio);

        /**
         * Consulta personalizada: buscar servicios médicos por nombre de IPS o ID de
         * IPS.
         */
        @Query(value = """
                            SELECT DISTINCT sm.cups_sermed, sm.nom_sermed
                            FROM ips i
                            JOIN consultorio c ON c.ips_consultorio = i.id_ips
                            JOIN servicio_medico sm ON sm.cups_sermed = c.sermed_consultorio
                            WHERE (:idIps IS NOT NULL AND i.id_ips = :idIps)
                        """, nativeQuery = true)
        List<ServicioEnIpsDTO> buscarServicioPorNombreOIdIps(@Param("idIps") Integer idIps);
}
