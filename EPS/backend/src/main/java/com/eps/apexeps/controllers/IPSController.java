/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.Ips;
import com.eps.apexeps.response.IpsEntradaLista;
import com.eps.apexeps.services.IPSService;

/**
 * Controlador para manejar las operaciones relacionadas con las IPS.
 * * @author Alexander
 */
@RestController
@RequestMapping("/api/ips")
@CrossOrigin(origins = "http://localhost:3000")
public class IPSController {

    @Autowired
    private IPSService ipsService;

    @GetMapping("/all")
    public List<Ips> findAll() {
        return ipsService.findAll();
    }

    @GetMapping
    public List<IpsEntradaLista> filtrarIps(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String telefono,
            @RequestParam(required = false) String direccion,
            @RequestParam(required = false) String fechaRegistro,
            @RequestParam(required = false) String nombreServicio) {
        try {
            return ipsService
                    .filtrarIpsMulticriterio(
                        nombre, 
                        telefono, 
                        direccion, 
                        fechaRegistro,
                        nombreServicio
                    )
                    .stream()
                    .map(IpsEntradaLista::of)
                    .toList();
        } catch (RuntimeException e) {
            throw new RuntimeException("Error al obtener las IPS: " + e.getMessage(), e);
        }
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Ips> findById(
        @PathVariable Integer id_user,
        @RequestParam(required = true) Integer id) {
        return ipsService.findById(id)
                .map(ResponseEntity::ok) // ahora Optional.map existe
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public Ips save(@RequestBody Ips ips) {
        return ipsService.save(ips);
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
            nuevaIps = ipsService.actualizarIps(ipsData);
        }

        if (nuevaIps == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la IPS con ID: " + ipsData.getId());
        }

        return ResponseEntity.ok(nuevaIps);
    }

    @DeleteMapping
    public void deleteById(@RequestParam(required = true) Integer id) {
        ipsService.deleteById(id);
    }

    @GetMapping("/servicio")
    public List<Ips> obtenerIpsPorServicio(@RequestParam(required = true) String nombreServicio) {
        return ipsService.obtenerIpsPorServicio(nombreServicio);
    }
    

    /*
     * Consulta personalizada: buscar servicios médicos por nombre de IPS o ID
     * de IPS.
     */
    @GetMapping("/servicio/ips")
    public ResponseEntity<List<String>> buscarServicios(
            @RequestParam(required = false) String nombreIps,
            @RequestParam(required = false) Integer idIps) {

        List<String> servicios = ipsService.obtenerServiciosPorNombreOIdIps(nombreIps, idIps);
        return ResponseEntity.ok(servicios);
    }
}
