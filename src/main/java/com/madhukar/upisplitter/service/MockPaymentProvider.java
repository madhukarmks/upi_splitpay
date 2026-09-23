package com.madhukar.upisplitter.service;
import org.springframework.stereotype.Component; import java.math.BigDecimal; import java.net.URLEncoder; import java.nio.charset.StandardCharsets;
@Component public class MockPaymentProvider implements PaymentProvider {
 public String createPaymentRequest(String paymentId,String planId,BigDecimal amount){return "PAYMENT_ID="+paymentId+"\nORDER_ID="+planId+"\nAMOUNT="+amount.toPlainString()+"\nMODE=SIMULATION";}
 public String createUpiPayload(String paymentId,String planId,BigDecimal amount,String receiverType,String receiver,String receiverName){
  String pa=receiver; String pn=(receiverName==null||receiverName.isBlank())?"UPI SplitPay Receiver":receiverName;
  return "upi://pay?pa="+enc(pa)+"&pn="+enc(pn)+"&tr="+enc(paymentId)+"&tn="+enc("UPI SplitPay "+planId)+"&am="+amount.setScale(2).toPlainString()+"&cu=INR";
 }
 private String enc(String v){return URLEncoder.encode(v,StandardCharsets.UTF_8);} public String getPaymentStatus(String paymentId){return "SIMULATED";}
}