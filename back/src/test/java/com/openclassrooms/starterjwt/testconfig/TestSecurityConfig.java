package com.openclassrooms.starterjwt.testconfig;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import java.util.Collections;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

@TestConfiguration
public class TestSecurityConfig {
    @Bean
    @Primary
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new AuthenticationManager() {
            @Override
            public Authentication authenticate(Authentication authentication) throws AuthenticationException {
                String username = authentication.getName();
                String password = String.valueOf(authentication.getCredentials());
                if ("test@example.com".equals(username) && "testpassword".equals(password)) {
                    UserDetailsImpl user = UserDetailsImpl.builder()
                        .id(1L)
                        .username(username)
                        .firstName("Test")
                        .lastName("User")
                        .admin(false)
                        .password(password)
                        .build();
                    return new UsernamePasswordAuthenticationToken(user, password, user.getAuthorities());
                }
                throw new BadCredentialsException("Bad credentials");
            }
        };
    }
}
