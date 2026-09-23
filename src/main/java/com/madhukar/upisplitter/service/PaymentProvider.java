package com.madhukar.upisplitter.service;
import java.math.BigDecimal;
public interface PaymentProvider {
 String createPaymentRequest(String paymentId,String planId,BigDecimal amount);
 String createUpiPayload(String paymentId,String planId,BigDecimal amount,String receiverType,String receiver,String receiverName);
 String getPaymentStatus(String paymentId);
}
