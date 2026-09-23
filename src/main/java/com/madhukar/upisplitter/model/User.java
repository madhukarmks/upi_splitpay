package com.madhukar.upisplitter.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document("users")
public class User {
 @Id private String id;
 private String name;
 @Indexed(unique=true) private String email;
 private String passwordHash;
 @Builder.Default private Role role=Role.USER;
 private Instant createdAt;
 private Instant updatedAt;
 public enum Role { USER, ADMIN }
}
