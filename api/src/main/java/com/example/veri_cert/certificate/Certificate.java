package com.example.veri_cert.certificate;

import java.time.Instant;

import com.example.veri_cert.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "certificate")
public class Certificate {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "certificate_seq_generator")
  @SequenceGenerator(name = "certificate_seq_generator", sequenceName = "certificate_seq", allocationSize = 1, initialValue = 101)
  @Column(name = "id", unique = true)
  private Long id;

  @Column(name = "uuid", nullable = false)
  private String uuid;

  @Column(name = "memo", nullable = false)
  private String memo;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne
  @JoinColumn(name = "issuer_id", nullable = false)
  private User issuer;

  @Column(name = "timestamp", nullable = false)
  private Instant timestamp;

  @Column(name = "revoke", nullable = false)
  private boolean revoke;
}
