package com.eps.apexeps.models.DTOs;

import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
public class AfiliacionDto {
    private Long dni;
    private String tipoDni;
    private Long beneficiario; // dni del padre (nullable)
    private String nombre;
    private LocalDate fechaNacimiento;
    private String email;
    private String password;
    private String telefono;
    private String parentezco;
    private String sexo;
    private String direccion;
    private String admRegistradorEmail;
    private Instant fechaAfiliacion;
    private List<AfiliacionDto> beneficiarios;
}