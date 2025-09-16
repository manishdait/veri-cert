package com.example.veri_cert.user;

import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryTest {
  @Container
  @ServiceConnection
  private static PostgreSQLContainer<?> psqlContainer = new PostgreSQLContainer<>(DockerImageName.parse("postgres:alpine"));

  @Autowired
  private UserRepository userRepository;

  @BeforeEach
  void setup() {
    User user = User.builder()
      .uname("Jhon Doe")
      .email("jhon@test.in")
      .password("Password")
      .role(Role.USER)
      .build();
    
      userRepository.save(user);
  }

  @AfterEach
  void purge() {
    userRepository.deleteAll();
  }

  @Test
  void canEstablishConnection() {
    Assertions.assertThat(psqlContainer.isCreated()).isTrue();
    Assertions.assertThat(psqlContainer.isRunning()).isTrue();
  }

  @Test
  void shouldReturn_optionalOfUser_ifUserExists_withEmail() {
    final String email = "jhon@test.in";
    final Optional<User> result = userRepository.findByEmail(email);

    Assertions.assertThat(result).isNotNull();
    Assertions.assertThat(result).isPresent();
  }

  @Test
  void shouldReturn_emptyOptional_ifUserNotExists_withEmail() {
    final String email = "kate@test.in";
    final Optional<User> result = userRepository.findByEmail(email);

    Assertions.assertThat(result).isNotNull();
    Assertions.assertThat(result).isEmpty();
  }
}
