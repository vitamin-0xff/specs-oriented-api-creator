package com.example.generated.controller

import com.example.generated.dto.UserCreateDTO
import com.example.generated.dto.UserReadDTO
import com.example.generated.dto.UserUpdateDTO
import com.example.generated.service.UserService
import java.util.UUID
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/users")
class UserController(
  private val userService: UserService
) {

  @GetMapping("/{id}")
  suspend fun getById(@PathVariable("id") id: UUID): ResponseEntity<UserReadDTO> {
    return ResponseEntity.ok(userService.getById(id))
  }

  @GetMapping("/")
  suspend fun search(@RequestParam("email") email: String, @RequestParam("status") status: String): ResponseEntity<List<UserReadDTO>> {
    return ResponseEntity.ok(userService.search(email, status))
  }

  @PostMapping("/")
  suspend fun create(@RequestBody userCreateDTO: UserCreateDTO): ResponseEntity<UserReadDTO> {
    return ResponseEntity.ok(userService.create(userCreateDTO))
  }

  @PutMapping("/{id}")
  suspend fun update(@PathVariable("id") id: UUID, @RequestBody userUpdateDTO: UserUpdateDTO): ResponseEntity<UserReadDTO> {
    return ResponseEntity.ok(userService.update(id, userUpdateDTO))
  }

  @DeleteMapping("/{id}")
  suspend fun delete(@PathVariable("id") id: UUID): ResponseEntity<Unit> {
    return ResponseEntity.ok(userService.delete(id))
  }

}