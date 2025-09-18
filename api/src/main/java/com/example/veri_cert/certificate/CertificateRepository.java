package com.example.veri_cert.certificate;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.veri_cert.user.User;


public interface CertificateRepository extends JpaRepository<Certificate, Long> {
  Optional<Certificate> findByUuid(String uuid);
  List<Certificate> findByUser(User user);
  List<Certificate> findByIssuer(User issuer);
}
