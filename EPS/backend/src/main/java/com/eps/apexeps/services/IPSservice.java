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
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.Ips;
import com.eps.apexeps.repositories.IPSRepository;

/**
 *
 * @author Alexander
 */
@Service
public class IPSService {

    @Autowired
    private IPSRepository ipsRepository;

    public List<Ips> findByNombreContainingIgnoreCase(String nombre) {
        return ipsRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Ips> findAll() {
        return ipsRepository.findAll();
    }

    /**
     * Filtra las IPS según los parámetros proporcionados.
     * 
     * @param nombre        Nombre de la IPS (opcional)..
     * @param telefono      Teléfono de la IPS (opcional).
     * @param direccion     Dirección de la IPS (opcional).
     * @param fechaRegistro Fecha de registro de la IPS (opcional).
     * @return Lista de IPS que cumplen con los criterios de búsqueda.
     */
    /*
    public List<Ips> filtrarIps(String nombre, String telefono, String direccion) {
        nombre = hasText(nombre) ? nombre.trim() : null;
        telefono = hasText(telefono) ? telefono.trim() : null;
        direccion = hasText(direccion) ? direccion.trim() : null;

        // Banderas de depuración
        System.out.println(">> FILTRO nombre: " + nombre);
        System.out.println(">> FILTRO telefono: " + telefono);
        System.out.println(">> FILTRO direccion: " + direccion);

        return ipsRepository.findAllFiltered(nombre, telefono, direccion);
    }
    */

    public List<Ips> filtrarIps(
            String nombre,
            String email,
            String telefono,
            String direccion,
            String fechaRegistro) {
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
                resultado = ipsRepository.findByNombreContainingIgnoreCase(nombre);
            } else if (email != null) {
                resultado = ipsRepository.findByAdmEps_EmailIgnoreCase(email);
            } else if (telefono != null) {
                resultado = ipsRepository.findByTelefono(telefono);
            } else if (direccion != null) {
                resultado = ipsRepository.findByDireccionContainingIgnoreCase(direccion);
            } else if (fechaRegistro != null) {
                Instant fecha = parseFechaSegura(fechaRegistro);
                if (fecha == null) {
                    throw new IllegalArgumentException("Formato de fecha no válido");
                }
                resultado = ipsRepository.findByFechaRegistro(fecha);
            } else {
                resultado = ipsRepository.findAll();
            }

            if (resultado.isEmpty()) {
                throw new IllegalArgumentException("No se encontraron IPS");
            }

            return resultado;

        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Error al filtrar las IPS: " + e.getMessage(), e);
        }
    }

    public List<Ips> filtrarIpsMulti(String nombre, String telefono, String direccion, String fechaRegistro) {
        try {
            // Limpieza de datos
            nombre = (nombre != null && !nombre.trim().isEmpty()) ? nombre.trim() : null;
            telefono = (telefono != null && !telefono.trim().isEmpty()) ? telefono.trim() : null;
            direccion = (direccion != null && !direccion.trim().isEmpty()) ? direccion.trim() : null;
            Instant fecha = (fechaRegistro != null && !fechaRegistro.trim().isEmpty()) 
                ? parseFechaSegura(fechaRegistro) 
                : null;
            System.out.println(">> service FILTRO nombre: " + nombre);
            List<Ips> resultado = ipsRepository.filtrarIpsMultiples(nombre, telefono, direccion, fecha);
            
            if (resultado.isEmpty()) {
                throw new IllegalArgumentException("No se encontraron IPS");
            }

            return resultado;

        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Error al filtrar las IPS: " + e.getMessage(), e);
        }
    }

    public Optional<Ips> findById(Integer id) {
        return ipsRepository.findById(id);
    }

    public Ips save(Ips ips) {
        return ipsRepository.save(ips);
    }

    public void deleteById(Integer id) {
        ipsRepository.deleteById(id);
    }

    public List<Ips> obtenerIpsPorServicio(String nombreServicio) {
        System.out.println("Nombre del servicio: " + nombreServicio);
        return ipsRepository.buscarIpsPorNombreServicio(nombreServicio);
    }

    public Ips actualizarIps(Ips ips) {
        return ipsRepository.save(ips);
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
