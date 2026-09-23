package com.madhukar.upisplitter.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import java.math.BigDecimal;
import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document("payment_transactions")
@CompoundIndex(name="user_created_idx", def="{'userId':1,'createdAt':-1}")
@CompoundIndex(name="plan_created_idx", def="{'paymentPlanId':1,'createdAt':-1}")
@CompoundIndex(name="status_created_idx", def="{'status':1,'createdAt':-1}")
public class PaymentTransaction {
 @Id private String id;
 private String paymentPlanId;
 private String userId;
 private int sequence;
 private BigDecimal amount;
 @Builder.Default private Status status=Status.PENDING;
 private String qrPayload;
 private Instant createdAt;
 private Instant updatedAt;
 private Instant completedAt;
 public enum Status { PENDING, SUCCESS, FAILED }
}
