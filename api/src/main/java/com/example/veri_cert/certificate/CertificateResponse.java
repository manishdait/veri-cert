package com.example.veri_cert.certificate;

import java.time.Instant;

public record CertificateResponse(String issuer, Instant timestamp, String memo, String pubKey) {
  
}
