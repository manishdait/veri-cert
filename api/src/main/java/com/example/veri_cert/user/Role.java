package com.example.veri_cert.user;

import lombok.Getter;

public enum Role {
  ISSUER("ISSUER"),
  USER("USER");

  @Getter
  private String role;

  Role(String role) {
    this.role = role;
  }
}
