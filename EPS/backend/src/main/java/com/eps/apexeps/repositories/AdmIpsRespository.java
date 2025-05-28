/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */

package com.eps.apexeps.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.entity.users.AdmIps;

/**
 *
 * @author Alexander
 */
@Repository
public interface AdmIpsRespository extends JpaRepository<AdmIps, String> {

    List<AdmIps> findByNombreContainingIgnoreCase(String nombre);
    
    boolean existsByEmail(String email);
    
    Optional<AdmIps> findByTelefono(String telefono);
}
