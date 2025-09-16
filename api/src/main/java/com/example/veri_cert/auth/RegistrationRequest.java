package com.example.veri_cert.auth;

import com.example.veri_cert.user.Role;

public record RegistrationRequest(String uname, String email, String password, Role role) {

}
