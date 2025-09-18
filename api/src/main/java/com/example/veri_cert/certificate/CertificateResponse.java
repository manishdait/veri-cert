package com.example.veri_cert.certificate;

import java.time.Instant;

public record CertificateResponse(String user, String issuer, Instant timestamp, String memo, String uuid, boolean revoke) {
  
}
