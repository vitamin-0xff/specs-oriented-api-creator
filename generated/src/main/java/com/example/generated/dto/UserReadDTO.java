package com.example.generated.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserReadDTO {
  private UUID id;
  private String email;
  private StatusEnum status;
  private LocalDate createdAt;
  private List<Role> roles;
  private List<Long> rolesId;

}
