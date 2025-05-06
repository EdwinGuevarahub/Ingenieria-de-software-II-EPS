/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @GetMapping("/nameLike={nombre}")
    public List<Ips> findByNombreContainingIgnoreCase(@PathVariable String nombre) {
        return ipsService.findByNombreContainingIgnoreCase(nombre);
    }
    
    @GetMapping("/all")
    public List<Ips> findAll() {
        return ipsService.findAll();
    }

    @GetMapping("/idLike={id}")
    public Ips findById(@PathVariable Integer id) {
        return ipsService.findById(id);
    }

    @PostMapping
    public Ips save(@RequestBody Ips ips) {
        return ipsService.save(ips);
    }

    @DeleteMapping("/idLike={id}")
    public void deleteById(Integer id) {
        ipsService.deleteById(id);
    }

    @GetMapping("/servicio={nombreServicio}")
    public List<Ips> obtenerIpsPorServicio(@PathVariable String nombreServicio) {
        return ipsService.obtenerIpsPorServicio(nombreServicio);
    }

}
