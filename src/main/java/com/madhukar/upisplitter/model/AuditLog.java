package com.madhukar.upisplitter.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import java.time.Instant;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document("audit_logs")
@CompoundIndex(name="user_timestamp_idx", def="{'userId':1,'timestamp':-1}")
@CompoundIndex(name="entity_timestamp_idx", def="{'entityType':1,'timestamp':-1}")
public class AuditLog {
 @Id private String id;
 private String userId;
 private String action;
 private String entityType;
 private String entityId;
 private Instant timestamp;
 private Map<String,Object> metadata;
}
