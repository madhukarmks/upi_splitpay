package com.madhukar.upisplitter.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import java.math.BigDecimal;
import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document("payment_requests")
@CompoundIndex(name="user_created_idx", def="{'userId':1,'createdAt':-1}")
public class PaymentPlan {
 @Id private String id;
 private String userId;
 private String orderId;
 private BigDecimal totalAmount;
 private BigDecimal maxPerPayment;
 private int numberOfPayments;
 private String description;
 private String receiverType;
 private String receiver;
 private String receiverName;
 @Builder.Default private PlanStatus status=PlanStatus.PENDING;
 private Instant createdAt;
 private Instant updatedAt;
 public enum PlanStatus { PENDING, PARTIALLY_COMPLETED, COMPLETED, FAILED }
}
