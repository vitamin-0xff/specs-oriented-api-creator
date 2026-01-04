package com.example.generated.mapper

import com.example.generated.domain.User
import com.example.generated.dto.UserCreateDTO
import com.example.generated.dto.UserReadDTO
import com.example.generated.dto.UserUpdateDTO
import org.mapstruct.Mapper

@Mapper(componentModel = "spring")
interface UserMapper {
  fun toDto(user: User): UserCreateDTO 

  fun toEntity(usercreatedto: UserCreateDTO): User 

  fun toDto(user: User): UserUpdateDTO 

  fun toEntity(userupdatedto: UserUpdateDTO): User 

  fun toDto(user: User): UserReadDTO 

  fun toEntity(userreaddto: UserReadDTO): User 
}