package com.madhukar.upisplitter.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import com.madhukar.upisplitter.model.PaymentPlan.PlanStatus;
import com.madhukar.upisplitter.model.PaymentTransaction.Status;
public final class PaymentDtos {
 public record CreatePlanRequest(
  @NotNull @DecimalMin(value="0.01") BigDecimal totalAmount,
  @NotNull @DecimalMin(value="0.01") BigDecimal maxPerPayment,
  @Size(max=200) String description,
  @NotBlank @Size(max=20) String receiverType,
  @NotBlank @Size(max=200) String receiver,
  @Size(max=100) String receiverName
 ) {}
 public record PaymentItem(String id,int sequence,BigDecimal amount,Status status,String qrPayload,Instant createdAt,Instant completedAt) {}
 public record PlanResponse(String id,String orderId,BigDecimal totalAmount,BigDecimal maxPerPayment,int numberOfPayments,String description,String receiverType,String receiver,String receiverName,PlanStatus status,Instant createdAt,Instant updatedAt,List<PaymentItem> payments) {}
 public record StatusResponse(String message, PaymentItem payment, PlanStatus planStatus) {}
}
