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
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;

@TestConfiguration
public class TestSecurityConfig {
    @Bean
    @Primary
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationManager authenticationManager(UserRepository userRepository) {
        return new AuthenticationManager() {
            @Override
            public Authentication authenticate(Authentication authentication) throws AuthenticationException {
                String username = authentication.getName();
                String password = String.valueOf(authentication.getCredentials());
                if ("test@example.com".equals(username) && "testpassword".equals(password)) {
                    // Créer ou récupérer l'utilisateur en BD, si le repo est disponible
                    Long userId = 1L;
                    if (userRepository != null) {
                        try {
                            User user = userRepository.findByEmail(username)
                                .orElseGet(() -> {
                                    User newUser = new User();
                                    newUser.setEmail(username);
                                    newUser.setPassword(password);
                                    newUser.setFirstName("Test");
                                    newUser.setLastName("User");
                                    newUser.setAdmin(false);
                                    return userRepository.save(newUser);
                                });
                            userId = user.getId();
                        } catch (Exception e) {
                            // Si la BD échoue (par ex. MockBean), utiliser l'ID par défaut
                            userId = 1L;
                        }
                    }

                    UserDetailsImpl userDetails = UserDetailsImpl.builder()
                        .id(userId)
                        .username(username)
                        .firstName("Test")
                        .lastName("User")
                        .admin(false)
                        .password(password)
                        .build();
                    return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
                }
                throw new BadCredentialsException("Bad credentials");
            }
        };
    }
}
