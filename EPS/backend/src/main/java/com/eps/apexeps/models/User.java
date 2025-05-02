package com.eps.apexeps.models;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // o SEQUENCE si Supabase lo requiere
    private Long id;

    private String name;
    private String email;

    // Constructores
    public User() {}
    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}


