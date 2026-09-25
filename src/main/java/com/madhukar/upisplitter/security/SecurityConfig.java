package com.madhukar.upisplitter.security;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthFilter jwt
    ) throws Exception {

        return http
                .csrf(c -> c.disable())

                .cors(c -> c.configurationSource(corsConfigurationSource()))

                .sessionManagement(s ->
                        s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(a -> a
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/public/**",
                                "/auth/**",
                                "/error"
                        ).permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwt,
                        UsernamePasswordAuthenticationFilter.class
                )

                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration c = new CorsConfiguration();

        c.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://master.d3r1ntufn0voar.amplifyapp.com"
        ));

        c.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        c.setAllowedHeaders(List.of("*"));

        c.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", c);

        return source;
    }
}
