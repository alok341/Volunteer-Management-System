package com.alok.volunteer_management_system.security;

import com.alok.volunteer_management_system.model.User;
import com.alok.volunteer_management_system.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String userId = null;
        String role = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                userId = jwtUtil.extractUserId(token);
                role = jwtUtil.extractRole(token);
                log.debug("Extracted userId: {}, role: {} from token", userId, role);
            } catch (Exception e) {
                log.error("Invalid JWT Token: {}", e.getMessage());
            }
        }

        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {

                    // Verify user exists in database
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    // Create authorities based on role
                    Collection<GrantedAuthority> authorities = new ArrayList<>();
                    if (user.getRole() != null) {
                        // Spring Security expects roles with "ROLE_" prefix
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
                        log.debug("Added authority: ROLE_{}", user.getRole().name());
                    }

                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userId, null, authorities);
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                    log.info("Authentication set for user: {} with role: {}", userId, user.getRole());
                }
            } catch (Exception e) {
                log.error("Error setting authentication: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}