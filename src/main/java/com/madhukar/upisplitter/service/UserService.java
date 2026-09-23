package com.madhukar.upisplitter.service;
import com.madhukar.upisplitter.model.User; import com.madhukar.upisplitter.repository.UserRepository; import org.springframework.stereotype.Service; import java.util.List;
@Service public class UserService {private final UserRepository repo;public UserService(UserRepository r){repo=r;}public long count(){return repo.count();}public List<User> all(){return repo.findAll();}}
