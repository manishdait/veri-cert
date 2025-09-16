package com.example.veri_cert.user;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService { 
  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository.findByEmail(username).orElseThrow(
      () -> new UsernameNotFoundException("User with username `%s` not exists".formatted(username))
    );
  }

  public UserDto getCurrentUser(Authentication authentication) {
    User user = (User) authentication.getPrincipal();
    return new UserDto(user.getUname(), user.getEmail(), user.getRole());
  }
}
