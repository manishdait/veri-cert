package com.example.veri_cert.user;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
  @Mock
  private UserRepository userRepository;

  private UserService userService;

  @BeforeEach
  void setup() {
    userService = new UserService(userRepository);
  }

  @AfterEach
  void purge() {
    userService = null;
  }

  @Test
  void shouldReturn_userDetails_ifUserExists_withUsername() {
    final User mockUser = Mockito.mock(User.class);
    final String username = "jhon@test.in";

    when(userRepository.findByEmail(username)).thenReturn(Optional.of(mockUser));
    
    final UserDetails result = userService.loadUserByUsername(username);

    verify(userRepository, times(1)).findByEmail(username);
    
    Assertions.assertThat(result).isNotNull();
  }

  @Test
  void shouldThrow_usernameNotFoundException_ifUserNotExists_withUsername() {
    final String username = "kate@test.in";

    when(userRepository.findByEmail(username)).thenReturn(Optional.empty());

    Assertions.assertThatThrownBy(() -> userService.loadUserByUsername(username))
      .isInstanceOf(UsernameNotFoundException.class)
      .hasMessage("User with username `kate@test.in` not exists");
  }
}
