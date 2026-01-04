package com.example.generated.domain;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
@Id
@GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;
@Column(unique = true)
  private String email;
  private String password;
@Enumerated(EnumType.STRING)
  private StatusEnum status;
  private LocalDate createdAt;
@ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  private List<Role> roles;

}
