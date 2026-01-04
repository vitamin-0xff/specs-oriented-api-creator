package com.example.generated.dto

data class UserCreateDTO(
  val email: String,
  val password: String,
  val roles: List<Role>,
)