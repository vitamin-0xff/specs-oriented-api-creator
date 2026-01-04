package com.example.generated.mapper;

import com.example.generated.domain.User;
import com.example.generated.dto.UserCreateDTO;
import com.example.generated.dto.UserReadDTO;
import com.example.generated.dto.UserUpdateDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
  public UserCreateDTO toDto( User user) {
  }

  public User toEntity( UserCreateDTO usercreatedto) {
  }

  public UserUpdateDTO toDto( User user) {
  }

  public User toEntity( UserUpdateDTO userupdatedto) {
  }

  public UserReadDTO toDto( User user) {
  }

  public User toEntity( UserReadDTO userreaddto) {
  }

}
