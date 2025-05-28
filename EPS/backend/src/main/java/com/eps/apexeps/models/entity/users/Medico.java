package com.eps.apexeps.models.entity.users;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

import com.eps.apexeps.models.entity.ServicioMedico;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table medico {
//   dni_medico bigint [pk]
//   nom_medico varchar(80) [not null]
//   email_medico varchar(255) [not null, unique]
//   pass_medico varchar(256) [not null]
//   tel_medico varchar(20) [not null]
//   activo_medico boolean [not null, default: true]
// }

// Table domina {
//   medico_domina bigint [pk, ref: > medico.dni_medico]
//   servicio_domina varchar(10) [pk, ref: > servicio_medico.cups_sermed]
// }

/**
 * Esta clase representa la entidad Medico en la base de datos.
 * Se utiliza para mapear la tabla 'medico' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "medico")
public class Medico {

    /** 
     * Ruta donde se guardan las imágenes de los médicos.
     * Se utiliza para guardar y cargar las imágenes de la base de datos.
     */
    public static final String RUTA_IMAGENES = "src/main/resources/static/images/medico/";

    /** Número de identificación del médico. */
    @Id
    @Column(
        name = "dni_medico",
        nullable = false
    )
    private Long dni;

    /** Nombre del médico. */
    @NotEmpty
    @Column(
        name = "nom_medico",
        length = 80,
        nullable = false
    )
    private String nombre;

    /** Correo electrónico del médico. */
    @NotEmpty
    @Column(
        name = "email_medico",
        length = 255,
        nullable = false,
        columnDefinition = "email_valido",
        unique = true
    )
    private String email;

    /** Cpontraseña del médico. */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotEmpty
    @Column(
        name = "pass_medico",
        length = 256,
        nullable = false
    )
    private String password;

    /** Número de teléfono del médico. */
    @NotEmpty
    @Column(
        name = "tel_medico",
        length = 20,
        nullable = false
    )
    private String telefono;

    /** Indica si el médico está activo o no. */
    @Column(
        name = "activo_medico",
        nullable = false,
        columnDefinition = "boolean default true"
    )
    @Builder.Default
    private Boolean activo = true;

    /**
     * Lista de servicios médicos que el médico domina.
     * Esta relación es de muchos a muchos, ya que un médico puede dominar varios servicios.
     * Se utiliza la tabla 'domina' para mapear esta relación.
     */
    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "domina",
        joinColumns = @JoinColumn(name = "medico_domina"),
        inverseJoinColumns = @JoinColumn(name = "servicio_domina")
    )
    private List<ServicioMedico> dominios;

    @Transient
    private byte[] imagen;

    /**
     * Método que se carga justo después de cargar la entidad.
     * Se utiliza para cargar la imagen desde el sistema de archivos.
     * @throws IOException si ocurre un error al cargar la imagen.
     */
    @PostLoad
    public void postLoad() throws IOException {
        loadImage();
    }

    /**
     * Carga la imagen desde el sistema de archivos.
     * @throws IOException si ocurre un error al cargar la imagen.
     */
    private void loadImage() throws IOException {
        String route = RUTA_IMAGENES + dni + ".png";
        File file = new File(route);
        if (!file.exists()) {
            imagen = null;
            return;
        }

        imagen = Files.readAllBytes(file.toPath());
    }

    /**
     * Guarda la imagen en el sistema de archivos.
     * @throws IOException si ocurre un error al guardar la imagen.
     */
    public void saveImage() throws IOException {
        if (imagen == null)
            return;

        String route = RUTA_IMAGENES + dni + ".png";
        File file = new File(route);
        
        try {
            Files.write(file.toPath(), imagen);
        }
        catch (Exception e) {
            throw new IOException("Error al guardar la imagen del médico: " + e.getMessage(), e);
        }

        // Verifica si el archivo es una imagen PNG, y si no lo es, lo elimina.
        String type = Files.probeContentType(file.toPath());
        if (type != null && !type.equals("image/png")) {
            file.delete();
            throw new IOException("El atributo imagen del médico no es una imagen PNG");
        }
    }
}
