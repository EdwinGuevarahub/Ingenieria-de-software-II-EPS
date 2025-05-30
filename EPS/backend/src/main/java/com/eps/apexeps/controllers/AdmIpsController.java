/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.services.AdmIpsService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.eps.apexeps.models.entity.users.AdmIps;


/**
 *
 * @author Alexander
 */
@RestController
@RequestMapping("/api/admips")
public class AdmIpsController {

    @Autowired
    private AdmIpsService admIpsService;

    @GetMapping("/all")
    public ResponseEntity<List<AdmIps>> getAllAdmIps() {
        List<AdmIps> admIpsList = admIpsService.findAll();
        return ResponseEntity.ok(admIpsList);
    }

    @GetMapping
    public AdmIps findByEmail(@RequestParam String email) {
        return admIpsService.findByEmail(email);
    }
}
