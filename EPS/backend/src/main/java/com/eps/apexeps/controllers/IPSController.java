/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.controllers;

import java.util.List;

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
import com.eps.apexeps.services.IPSservice;



/**
 * Controlador para manejar las operaciones relacionadas con las IPS.
 * * @author Alexander
 */
@RestController
@RequestMapping("/api/ips")
@CrossOrigin(origins = "http://localhost:3000")
public class IPSController {

    @Autowired  
    private IPSservice ipsService;
    
    @GetMapping("/all")
    public List<Ips> findAll() {
        return ipsService.findAll();
    }

    @GetMapping
    public List<Ips> findIps(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String telefono,
            @RequestParam(required = false) String direccion,
            @RequestParam(required = false) String fechaRegistro
    ) {

        
        return null;

    }

    @GetMapping("/nombre/{nombre}")
    public List<Ips> findByNombreContainingIgnoreCase(@PathVariable String nombre) {
        return ipsService.findByNombreContainingIgnoreCase(nombre);
    }

    @GetMapping("/id/{id}")
    public Ips findById(@PathVariable Integer id) {
        return ipsService.findById(id);
    }

    @PostMapping
    public Ips save(@RequestBody Ips ips) {
        return ipsService.save(ips);
    }

    @PutMapping    
    public ResponseEntity<?> updateIps(
        @RequestBody  Ips ipsData) {
        Ips antiguaIps = ipsService.findById(ipsData.getId());
        Ips nuevaIps;
        if (antiguaIps == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró la IPS con ID: " + ipsData.getId());
        }else{
            nuevaIps = ipsService.actualizarIps(ipsData);
        }

        if (nuevaIps == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la IPS con ID: " + ipsData.getId());
        }

        return ResponseEntity.ok(nuevaIps);
    }

    @DeleteMapping("/idLike={id}")
    public void deleteById(@PathVariable Integer id) {
        ipsService.deleteById(id);
    }

    @GetMapping("/servicio={nombreServicio}")
    public List<Ips> obtenerIpsPorServicio(@PathVariable String nombreServicio) {
        return ipsService.obtenerIpsPorServicio(nombreServicio);
    }

}
