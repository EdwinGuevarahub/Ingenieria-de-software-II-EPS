/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.controllers;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.DTOs.ServicioEnIpsDTO;
import com.eps.apexeps.models.entity.Ips;
import com.eps.apexeps.models.entity.users.AdmIps;
import com.eps.apexeps.models.DTOs.response.IpsEntradaLista;
import com.eps.apexeps.models.DTOs.response.IpsConServicios;
import com.eps.apexeps.models.DTOs.response.IpsLista;
import com.eps.apexeps.services.IpsService;

/**
 * Controlador para manejar las operaciones relacionadas con las IPS.
 * * @author Alexander
 */
@RestController
@RequestMapping("/api/ips")
public class IpsController {

    @Autowired
    private IpsService ipsService;

    @GetMapping("/all")
    public ResponseEntity<List<Ips>> findAll() {
        return ResponseEntity.ok(ipsService.findAll());
    }

    @GetMapping
    public ResponseEntity<IpsLista> filtrarIps(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String telefono,
            @RequestParam(required = false) String direccion,
            @RequestParam(required = false) String fechaRegistro,
            @RequestParam(required = false) String cupsServicioMedico,
            @RequestParam(defaultValue = "10") Integer qSize,
            @RequestParam(defaultValue = "0") Integer qPage) {
        try {
            Page<Ips> entradas = ipsService.filtrarIpsMulticriterio(
                    nombre,
                    telefono,
                    direccion,
                    fechaRegistro,
                    cupsServicioMedico,
                    qSize,
                    qPage);
            return ResponseEntity.ok(
                    new IpsLista(
                            entradas.getTotalPages(),
                            entradas.stream()
                                    .map(IpsEntradaLista::of)
                                    .toList()));
        } catch (RuntimeException e) {
            throw new RuntimeException("Error al obtener las IPS: " + e.getMessage(), e);
        }
    }

    /**
     * Obtiene los datos completos de una IPS junto con sus servicios, dado su ID.
     * 
     * @param id ID de la IPS
     * @return ResponseEntity con datos de la IPS o 404 si no se encuentra
     */
    @GetMapping("/ips/detalle")
    public ResponseEntity<IpsConServicios> obtenerDetalleIps(
            @RequestParam(required = false) Integer idIps) {
        return ipsService.obtenerIpsConServicios(idIps)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody AdmIps admIps) throws IOException {
        try {
            return ResponseEntity.ok(ipsService.create(admIps));
        } catch (IOException e) {
            RuntimeException re = new RuntimeException("Error al guardar la IPS: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(re);
        }
    }

    @PutMapping
    public ResponseEntity<?> updateIps(
            @RequestBody Ips ipsData) {
        Optional<Ips> antiguaIps = ipsService.findById(ipsData.getId());
        Ips nuevaIps;
        if (antiguaIps == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró la IPS con ID: " + ipsData.getId());
        } else {
            try {
                nuevaIps = ipsService.actualizarIps(ipsData);
            } catch (Exception e) {
                throw new RuntimeException("Error al actualizar la IPS: " + e.getMessage(), e);
            }
        }

        if (nuevaIps == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la IPS con ID: " + ipsData.getId());
        }

        return ResponseEntity.ok(nuevaIps);
    }

    @PutMapping("/{idIps}/activo")
    public ResponseEntity<Ips> cambiarEstadoIps(
            @PathVariable Integer idIps) {
        try {
            Ips ipsActualizada = ipsService.actualizarActivo(idIps);
            return ResponseEntity.ok(ipsActualizada);
        } catch (Exception e) {
            throw new RuntimeException("Error al cambiar el estado de la IPS: " + e.getMessage(), e);
        }
    }

    @DeleteMapping
    public void deleteById(@RequestParam(required = true) Integer id) {
        ipsService.deleteById(id);
    }

    @GetMapping("/servicio")
    public ResponseEntity<List<Ips>> obtenerIpsPorServicio(@RequestParam(required = true) String cupsServicioMedico) {
        return ResponseEntity.ok(ipsService.obtenerIpsPorServicio(cupsServicioMedico));
    }

    /*
     * Consulta personalizada: buscar servicios médicos por nombre de IPS o ID
     * de IPS.
     */
    @GetMapping("/servicio/ips")
    public ResponseEntity<List<ServicioEnIpsDTO>> buscarServicios(
            @RequestParam(required = false) Integer idIps) {

        List<ServicioEnIpsDTO> servicios = ipsService.obtenerServiciosPorNombreOIdIps(idIps);
        return ResponseEntity.ok(servicios);
    }

}
