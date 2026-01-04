package com.example.generated.controller;

import com.example.generated.dto.UserCreateDTO;
import com.example.generated.dto.UserReadDTO;
import com.example.generated.dto.UserUpdateDTO;
import com.example.generated.service.UserService;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
  private final UserService userService;


@Autowired
  public UserController( UserService userService) {
    this.userService = userService;
  }

@GetMapping("/{id}")
  public ResponseEntity<UserReadDTO> getById(@PathVariable("id") UUID id) {
    return ResponseEntity.ok(userService.getById(id));
  }

@GetMapping("/")
  public ResponseEntity<List<UserReadDTO>> search(@RequestParam("email") String email, @RequestParam("status") String status) {
    return ResponseEntity.ok(userService.search(email, status));
  }

@PostMapping("/")
  public ResponseEntity<UserReadDTO> create(@RequestBody UserCreateDTO userCreateDTO) {
    return ResponseEntity.ok(userService.create(userCreateDTO));
  }

@PutMapping("/{id}")
  public ResponseEntity<UserReadDTO> update(@PathVariable("id") UUID id, @RequestBody UserUpdateDTO userUpdateDTO) {
    return ResponseEntity.ok(userService.update(id, userUpdateDTO));
  }

@DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
    return ResponseEntity.ok(userService.delete(id));
  }

}
