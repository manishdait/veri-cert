package com.example.veri_cert.handler;

import java.time.Instant;

public record ErroResponse(Instant timestamp, Integer status, String error, String message, String path) {

}
