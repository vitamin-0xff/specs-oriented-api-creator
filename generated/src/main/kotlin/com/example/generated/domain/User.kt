package com.example.generated.domain

import java.time.LocalDate
import java.util.UUID
import javax.persistence.CascadeType
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.ManyToMany
import javax.persistence.Table

@Entity
@Table(name = "users")
data class User(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  var id: UUID?,
  @Column(unique = true)
  var email: String,
  var password: String,
  @Enumerated(EnumType.STRING)
  var status: StatusEnum,
  var createdAt: LocalDate,
  @ManyToMany(fetch = FetchType.LAZY, cascade = [CascadeType.MERGE])
  var roles: List<Role>,
)