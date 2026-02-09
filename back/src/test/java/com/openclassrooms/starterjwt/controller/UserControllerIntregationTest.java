package com.openclassrooms.starterjwt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.testconfig.TestAuthHelper;
import com.openclassrooms.starterjwt.testconfig.TestSecurityConfig;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
@Import(TestSecurityConfig.class)
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
        mockMvc.perform(get("/api/user/1").header("Authorization", "Bearer " + token)
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
        User user = new User();
        user.setId(5L);
        user.setEmail("email@mail.com");
        user.setFirstName("firstname");
        user.setLastName("lastname");
        user.setPassword("password");
        user.setAdmin(false);

        userRepository.save(user);

        mockMvc.perform(delete("/api/user/5").header("Authorization", "Bearer " + token))
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

            mockMvc.perform(delete("/api/user/1")
            .header("Authorization", "Bearer " + "someToken"))
            .andExpect(status().isUnauthorized());
        }
}
