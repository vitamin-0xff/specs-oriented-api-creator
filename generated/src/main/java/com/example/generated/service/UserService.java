package com.example.generated.service;

import com.example.generated.dto.UserCreateDTO;
import com.example.generated.dto.UserReadDTO;
import com.example.generated.dto.UserUpdateDTO;
import com.example.generated.mapper.UserMapper;
import com.example.generated.repository.UserRepository;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
  private final UserRepository userRepository;
  private final UserMapper userMapper;

@Autowired
  public UserService( UserRepository userRepository,  UserMapper userMapper) {
    this.userRepository = userRepository;
    this.userMapper = userMapper;
  }

  public UserReadDTO getById( UUID id) {
    // TODO: Implement business logic for getById
    // 1. Fetch entity: userRepository.findById(id).orElseThrow();
    // 2. Map entity to DTO and return
    return null;
  }

  public List<UserReadDTO> search( String email,  String status) {
    // TODO: Implement business logic for search
    return Collections.emptyList();
  }

  public UserReadDTO create( UserCreateDTO userCreateDTO) {
    // TODO: Implement business logic for create
    // 1. Map DTO to entity: User user = userMapper.toEntity(userCreateDTO);
    // 2. Save entity: userRepository.save(user);
    // 3. Map saved entity back to DTO and return
    return null;
  }

  public UserReadDTO update( UUID id,  UserUpdateDTO userUpdateDTO) {
    // TODO: Implement business logic for update
    // 1. Fetch existing entity by ID: User existingUser = userRepository.findById(id).orElseThrow();
    // 2. Update existing entity fields from DTO: userMapper.updateUserFromDto(userUpdateDTO, existingUser);
    // 3. Save updated entity: userRepository.save(existingUser);
    // 4. Map saved entity back to DTO and return
    return null;
  }

  public void delete( UUID id) {
    // TODO: Implement business logic for delete
    // 1. Check if entity exists: userRepository.findById(id).orElseThrow();
    // 2. Delete entity by ID: userRepository.deleteById(id);
    
  }

}
