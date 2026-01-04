package com.example.generated.service

import com.example.generated.dto.UserCreateDTO
import com.example.generated.dto.UserReadDTO
import com.example.generated.dto.UserUpdateDTO
import com.example.generated.mapper.UserMapper
import com.example.generated.repository.UserRepository
import java.util.UUID
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UserService(
  private val userRepository: UserRepository,
  private val userMapper: UserMapper
) {

  suspend fun getById(id: UUID): UserReadDTO {
    // TODO: Implement business logic for ${op.name}
    throw NotImplementedError("Method not implemented")
  }

  suspend fun search(email: String, status: String): List<UserReadDTO> {
    // TODO: Implement business logic for ${op.name}
    throw NotImplementedError("Method not implemented")
  }

  suspend fun create(userCreateDTO: UserCreateDTO): UserReadDTO {
    // TODO: Implement business logic for ${op.name}
    throw NotImplementedError("Method not implemented")
  }

  suspend fun update(id: UUID, userUpdateDTO: UserUpdateDTO): UserReadDTO {
    // TODO: Implement business logic for ${op.name}
    throw NotImplementedError("Method not implemented")
  }

  suspend fun delete(id: UUID): Unit {
    // TODO: Implement business logic for ${op.name}
    
  }

}