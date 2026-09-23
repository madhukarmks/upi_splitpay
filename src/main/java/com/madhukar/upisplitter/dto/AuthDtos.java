package com.madhukar.upisplitter.dto;
import jakarta.validation.constraints.*;
public final class AuthDtos {
 public record RegisterRequest(@NotBlank String name,@NotBlank @Email String email,@NotBlank @Size(min=8,max=100) String password,@NotBlank String confirmPassword) {}
 public record LoginRequest(@NotBlank @Email String email,@NotBlank String password) {}
 public record AuthResponse(String token,String userId,String name,String email,String role) {}
 public record MeResponse(String userId,String name,String email,String role) {}
}
