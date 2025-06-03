package com.eps.apexeps.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.entity.users.AdmEps;

@Repository
public interface AdmEpsRepository extends JpaRepository<AdmEps, String> {

    List<AdmEps> findByNombreContainingIgnoreCase(String nombre);

    boolean existsByEmail(String email);

    Optional<AdmEps> findByTelefono(String telefono);

    Optional<AdmEps> findByEmail(String email);
}