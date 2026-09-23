package com.madhukar.upisplitter.repository;
import com.madhukar.upisplitter.model.PaymentTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.*;
public interface PaymentTransactionRepository extends MongoRepository<PaymentTransaction,String> { List<PaymentTransaction> findByUserIdOrderByCreatedAtDesc(String userId); List<PaymentTransaction> findByPaymentPlanIdOrderBySequenceAsc(String planId); long countByUserId(String userId); }
