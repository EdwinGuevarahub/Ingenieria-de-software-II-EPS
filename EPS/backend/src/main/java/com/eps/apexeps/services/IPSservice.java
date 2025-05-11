/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.services;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.Ips;
import com.eps.apexeps.repositories.IPSRepository;

/**
 *
 * @author Alexander
 */
@Service
public class IPSservice {

    @Autowired
    private IPSRepository ipsRespository;

    public List<Ips> findByNombreContainingIgnoreCase(String nombre) {
        return ipsRespository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Ips> findAll() {
        return ipsRespository.findAll();
    }

    public ResponseEntity<?> filtrarIps(
            String nombre,
            String email,
            String telefono,
            String direccion,
            String fechaRegistro
    ) {
        try {
            List<Ips> resultado;

            // Limpieza de datos
            nombre = (nombre != null && !nombre.trim().isEmpty()) ? nombre.trim() : null;
            email = (email != null && !email.trim().isEmpty()) ? email.trim() : null;
            telefono = (telefono != null && !telefono.trim().isEmpty()) ? telefono.trim() : null;
            direccion = (direccion != null && !direccion.trim().isEmpty()) ? direccion.trim() : null;
            fechaRegistro = (fechaRegistro != null && !fechaRegistro.trim().isEmpty()) ? fechaRegistro.trim() : null;

            // Filtros por prioridad
            if (nombre != null) {
                resultado = ipsRespository.findByNombreContainingIgnoreCase(nombre);
            } else if (email != null) {
                resultado = ipsRespository.findByAdmEps_EmailIgnoreCase(email);
            } else if (telefono != null) {
                resultado = ipsRespository.findByTelefono(telefono);
            } else if (direccion != null) {
                resultado = ipsRespository.findByDireccionContainingIgnoreCase(direccion);
            } else if (fechaRegistro != null) {
                Instant fecha = parseFechaSegura(fechaRegistro);
                if (fecha == null) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "error", "Formato de fecha inválido",
                        "detalle", "Usa formatos como: '2024-05-10T14:30:00Z', '2024-05-10', '10/05/2024'"
                    ));
                }
                resultado = ipsRespository.findByFechaRegistro(fecha);
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "No se proporcionó ningún parámetro de búsqueda"
                ));
            }

            if (resultado.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "No se encontraron resultados"));
            }

            return ResponseEntity.ok(resultado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor", "detalle", e.getMessage()));
        }
    }

    public Ips findById(Integer id) {
        return ipsRespository.findById(id).orElse(null);
    }
    public Ips save(Ips ips) {
        return ipsRespository.save(ips);
    } 
    public void deleteById(Integer id) {
        ipsRespository.deleteById(id);
    }
    
    public List<Ips> obtenerIpsPorServicio(String nombreServicio) {
        System.out.println("Nombre del servicio: " + nombreServicio);
        return ipsRespository.buscarIpsPorNombreServicio(nombreServicio);
    }

    public Ips actualizarIps(Ips ips) {
        return ipsRespository.save(ips);
    }

    private Instant parseFechaSegura(String fechaStr) {
        try {
            // Intentar con ISO-8601 (Instant.parse)
            return Instant.parse(fechaStr);
        } catch (DateTimeParseException e1) {
            try {
                // Intentar con "yyyy-MM-dd"
                LocalDate date = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                return date.atStartOfDay(ZoneId.of("UTC")).toInstant();
            } catch (DateTimeParseException e2) {
                try {
                    // Intentar con "dd/MM/yyyy"
                    LocalDate date = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                    return date.atStartOfDay(ZoneId.of("UTC")).toInstant();
                } catch (DateTimeParseException e3) {
                    return null;
                }
            }
        }
    }
}
