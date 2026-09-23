package com.madhukar.upisplitter.controller;
import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api/public") public class PublicController {@GetMapping("/health") public Map<String,String> health(){return Map.of("status","UP","mode","SIMULATION");}}
