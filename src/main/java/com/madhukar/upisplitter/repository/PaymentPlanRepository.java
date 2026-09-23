package com.madhukar.upisplitter.repository;
import com.madhukar.upisplitter.model.PaymentPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.*;
public interface PaymentPlanRepository extends MongoRepository<PaymentPlan,String> { List<PaymentPlan> findByUserIdOrderByCreatedAtDesc(String userId); long countByUserId(String userId); }
