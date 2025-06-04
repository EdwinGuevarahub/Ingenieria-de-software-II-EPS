package com.eps.apexeps.services;

import com.eps.apexeps.models.DTOs.AfiliacionDto;
import com.eps.apexeps.models.entity.users.Paciente;
import com.eps.apexeps.models.entity.users.AdmEps;
import com.eps.apexeps.repositories.PacienteRepository;
import com.eps.apexeps.repositories.AdmEpsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AfiliacionService {

    private final PacienteRepository pacienteRepository;
    private final AdmEpsRepository admEpsRepository;

    /**
     * Registra un afiliado y sus beneficiarios (si existen).
     *
     * @param dto Datos del afiliado principal.
     * @return El ID (DNI) del afiliado creado.
     */
    @Transactional
    public Long registrarAfiliacion(AfiliacionDto dto) {
        Paciente beneficiario = null;
        Long beneficiarioId = dto.getBeneficiario();
        System.out.println("Buscando beneficiario con ID: " + beneficiarioId + " para el paciente: " + dto.getDni());
        if (beneficiarioId != null) {
            beneficiario = pacienteRepository.findById(beneficiarioId).orElse(null);
        }

        AdmEps admEps = admEpsRepository.findById(dto.getAdmRegistradorEmail())
                .orElseThrow(() -> new IllegalArgumentException("Administrador no encontrado"));

        Paciente paciente = Paciente.builder()
                .dni(dto.getDni())
                .tipoDni(dto.getTipoDni())
                .beneficiario(beneficiario)
                .nombre(dto.getNombre())
                .fechaNacimiento(dto.getFechaNacimiento())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .telefono(dto.getTelefono())
                .parentezco(dto.getParentezco())
                .sexo(dto.getSexo() != null && !dto.getSexo().isEmpty() ? dto.getSexo().charAt(0) : null) // <-- aquí el cambio
                .direccion(dto.getDireccion())
                .admRegistrador(admEps)
                .fechaAfiliacion(dto.getFechaAfiliacion())
                .build();

        pacienteRepository.save(paciente);

        if (dto.getBeneficiarios() != null) {
            for (AfiliacionDto benDto : dto.getBeneficiarios()) {
                benDto.setBeneficiario(paciente.getDni());
                registrarAfiliacion(benDto);
            }
        }

        return paciente.getDni();
    }
}