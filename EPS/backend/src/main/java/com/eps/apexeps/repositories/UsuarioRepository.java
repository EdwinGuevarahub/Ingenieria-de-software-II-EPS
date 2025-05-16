package com.eps.apexeps.repositories;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.auth.ERol;
import com.eps.apexeps.models.auth.Usuario;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;

/**
 * Repositorio para la gestión de usuarios.
 * Implementa un método para buscar un usuario por su email y cargar sus contraseñas.
 * @author Nicolás Sabogal
 */
@Repository
@RequiredArgsConstructor
public class UsuarioRepository {

    /** EntityManager para la gestión de la base de datos */
    private final EntityManager entityManager;
    
    /**
     * Busca un usuario por su email y carga sus contraseñas en el mapa de contraseñas.
     * @param email Email del usuario a buscar.
     * @see Usuario
     * @return Usuario encontrado con sus contraseñas y sin una contraseña en uso, o null si no se encuentra.
     */
    public Usuario findByEmail(String email) {

        // Se utiliza una consulta SQL nativa para obtener las diferentes contraseñas del usuario.
        Query query = entityManager
                        .createNativeQuery( """
                            WITH
                                cte_admeps AS (
                                    SELECT email_admeps AS "emailAdmeps", pass_admeps
                                    FROM adm_eps
                                    WHERE email_admeps = :email
                                ),
                                cte_admips AS (
                                    SELECT email_admips AS "emailAdmips", pass_admips
                                    FROM adm_ips
                                    WHERE email_admips = :email
                                ),
                                cte_paciente AS (
                                    SELECT email_paciente AS "emailPaciente", pass_paciente
                                    FROM paciente
                                    WHERE email_paciente = :email
                                ),
                                cte_medico AS (
                                    SELECT email_medico AS "emailMedico", pass_medico
                                    FROM medico
                                    WHERE email_medico = :email
                                )
                            SELECT pass_admeps, pass_admips, pass_paciente, pass_medico
                            FROM cte_admeps
                            FULL OUTER JOIN cte_admips ON "emailAdmeps" = "emailAdmips"
                            FULL OUTER JOIN cte_paciente ON "emailAdmeps" = "emailPaciente"
                            FULL OUTER JOIN cte_medico ON "emailAdmeps" = "emailMedico";
                        """);
        query.setParameter("email", email);

        // Se ejecuta la consulta y se obtiene el resultado y se verifica si está vacío.
        List resultadoLista = query.getResultList();
        if (resultadoLista.isEmpty())
            return null;

        // Se obtiene el primer resultado y se construye el mapa de contraseñas.
        Object[] resultado = (Object[]) resultadoLista.get(0);
        Map<ERol, String> passwords = new HashMap<>();
        passwords.put(ERol.ADM_EPS, (String) resultado[0]);
        passwords.put(ERol.ADM_IPS, (String) resultado[1]);
        passwords.put(ERol.PACIENTE, (String) resultado[2]);
        passwords.put(ERol.MEDICO, (String) resultado[3]);

        return Usuario.builder().email(email).passwordMap(passwords).build();
    }
    
}
