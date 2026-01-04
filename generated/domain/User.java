package com.example.demo.domain;

import javax.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;

    // Getters and Setters
}