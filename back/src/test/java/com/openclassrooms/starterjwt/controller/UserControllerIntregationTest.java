package com.openclassrooms.starterjwt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.testconfig.TestAuthHelper;
import com.openclassrooms.starterjwt.testconfig.TestSecurityConfig;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import java.io.Console;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
@Import(TestSecurityConfig.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class UserControllerIntregationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String token;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void setUp() throws Exception {
        token = TestAuthHelper.obtainAccessToken(mockMvc, objectMapper);
    }

    @Test
    public void findById_ShouldReturnUser() throws Exception {
        // Récupérer l'utilisateur créé lors de l'authentification
        User user = userRepository.findByEmail("test@example.com")
            .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        mockMvc.perform(get("/api/user/" + user.getId()).header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());
    }

    @Test
    public void findById_BadRequest_NonNumeric() throws Exception {
        mockMvc.perform(get("/api/user/abc").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void findById_NotFound() throws Exception {
        mockMvc.perform(get("/api/user/999").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    //TODO: a finir
    @Test
    public void delete_ShouldReturnOkWhenAuthorized() throws Exception {
        // Récupérer l'utilisateur créé lors de l'authentification (test@example.com)
        User user = userRepository.findByEmail("test@example.com").orElseThrow();

        log.debug(String.valueOf(user));

        // Supprimer avec le token de l'utilisateur authentifié
        mockMvc.perform(delete("/api/user/" + user.getId()).header("Authorization", "Bearer " + token))
            .andExpect(status().isOk());
    }

        @Test
        public void delete_BadRequest_NonNumeric() throws Exception {
        mockMvc.perform(delete("/api/user/abc").header("Authorization", "Bearer " + token))
            .andExpect(status().isBadRequest());
        }

        @Test
        public void delete_NotFound() throws Exception {
        mockMvc.perform(delete("/api/user/999").header("Authorization", "Bearer " + token))
            .andExpect(status().isNotFound());
        }

        @Test
        public void delete_Unauthorized_WhenDifferentUser() throws Exception {

            mockMvc.perform(delete("/api/user/10")
            .header("Authorization", "Bearer " + "someToken"))
            .andExpect(status().isUnauthorized());
        }
}
