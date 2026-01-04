package com.example.generated.dto

import java.time.LocalDate
import java.util.UUID

data class UserReadDTO(
  val id: UUID?,
  val email: String,
  val status: StatusEnum,
  val createdAt: LocalDate,
  val roles: List<Role>,
  val rolesId: List<Long>,
)