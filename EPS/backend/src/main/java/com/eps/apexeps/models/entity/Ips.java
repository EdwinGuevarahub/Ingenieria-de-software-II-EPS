package com.eps.apexeps.models.entity;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.Instant;

import com.eps.apexeps.models.entity.users.AdmEps;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Esta clase representa la entidad Ips en la base de datos.
 * Se utiliza para mapear la tabla 'ips' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "ips")
public class Ips {

    /** 
     * Ruta donde se guardan las imágenes de las IPS.
     * Se utiliza para guardar y cargar las imágenes de la base de datos.
     */
    public static final String RUTA_IMAGENES = "EPS/backend/src/main/resources/static/images/ips/";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ips")
    private Integer id;

    @NotEmpty
    @Column(
        name = "nom_ips",
        length = 200,
        nullable = false
    )
    private String nombre;

    @NotEmpty
    @Column(
        name = "dir_ips",
        length = 255,
        nullable = false
    )
    private String direccion;

    @NotEmpty
    @Column(
        name = "tel_ips",
        length = 20,
        nullable = false
    )
    private String telefono;

    @ManyToOne
    @JoinColumn(
        name = "admreg_ips",
        referencedColumnName = "email_admeps",
        nullable = false
    )
    private AdmEps admEps;

    @Column(
        name = "freg_ips",
        nullable = false
    )
    private Instant fechaRegistro;

    @Column(
        name = "activo_ips",
        nullable = false,
        columnDefinition = "boolean default true"
    )
    private Boolean activo;

    /**
     * Imagen de la IPS en formato PNG cargada como un arreglo de bytes.
     * Se utiliza la anotación @Transient para indicar que este campo no se debe persistir en la base de datos.
     */
    @Transient
    private byte[] imagen;
    
    @PrePersist
    public void prePersist() {
        if (fechaRegistro == null) {
            fechaRegistro = Instant.now();
        }
    }

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
     */
    private void loadImage() throws IOException {
        String route = RUTA_IMAGENES + id + ".png";
        File file = new File(route);
        if (!file.exists()) {
            imagen = null;
            return;
        }

        imagen = Files.readAllBytes(file.toPath());
    }

    /**
     * Guarda la imagen en el sistema de archivos.
     */
    public void saveImage() throws IOException {
        if (imagen == null)
            return;

        String route = RUTA_IMAGENES + id + ".png";
        File file = new File(route);
        try {
            Files.write(file.toPath(), imagen);
        }
        catch (Exception e) {
            throw new IOException("Error al guardar la imagen de la IPS: " + e.getMessage(), e);
        }

        // Verifica si el archivo es una imagen PNG, y si no lo es, lo elimina.
        String type = Files.probeContentType(file.toPath());
        if (type != null && !type.equals("image/png")) {
            file.delete();
            throw new IOException("El atributo imagen de la IPS no es una imagen PNG");
        }
    }

}
