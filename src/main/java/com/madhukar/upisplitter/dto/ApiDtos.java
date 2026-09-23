package com.madhukar.upisplitter.dto;
import java.math.BigDecimal; import java.time.Instant; import java.util.*;
public final class ApiDtos {
 public record ApiResponse<T>(boolean success,String message,T data) {}
 public record TransactionView(String id,String paymentPlanId,BigDecimal amount,String status,Instant createdAt,Instant updatedAt,Instant completedAt,int sequence) {}
 public record Summary(long totalPlans,long totalTransactions,long successful,long pending,long failed,BigDecimal simulatedVolume,double successRate,BigDecimal averagePayment) {}
 public record StatusCount(String status,long count) {}
 public record DailyCount(String date,long count,BigDecimal volume) {}
 public record AmountCount(String amount,long count) {}
 public record FeeResponse(BigDecimal grossAmount,BigDecimal rate,BigDecimal simulatedFee,BigDecimal netAmount) {}
 public record AdminStats(long users,long plans,long transactions,long successful,long pending,long failed,BigDecimal volume) {}
}
