package com.example.generated.dto

data class UserUpdateDTO(
  val email: String,
  val password: String,
  val status: StatusEnum,
  val roles: List<Role>,
)