package com.madhukar.upisplitter.repository;
import com.madhukar.upisplitter.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface AuditLogRepository extends MongoRepository<AuditLog,String> { List<AuditLog> findTop100ByOrderByTimestampDesc(); }
