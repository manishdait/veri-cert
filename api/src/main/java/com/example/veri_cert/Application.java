package com.example.veri_cert;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.openelements.hiero.spring.EnableHiero;

@SpringBootApplication
@EnableTransactionManagement
@EnableHiero
public class Application {
  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
