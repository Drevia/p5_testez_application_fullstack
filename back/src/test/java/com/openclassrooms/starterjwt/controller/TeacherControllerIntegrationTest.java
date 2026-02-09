package com.openclassrooms.starterjwt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
@Import(com.openclassrooms.starterjwt.testconfig.TestSecurityConfig.class)
public class TeacherControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String token;

    @org.junit.jupiter.api.BeforeEach
    public void setUp() throws Exception {
        token = com.openclassrooms.starterjwt.testconfig.TestAuthHelper.obtainAccessToken(mockMvc, objectMapper);
    }

    @Test
    public void findAll_ShouldReturnTeachers() throws Exception {
        mockMvc.perform(get("/api/teacher").contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("TeacherFirst")));
    }

    @Test
    public void findById_ShouldReturnTeacher() throws Exception {
        mockMvc.perform(get("/api/teacher/1").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("TeacherFirst")));
    }

    @Test
    public void findById_BadRequest_NonNumeric() throws Exception {
        mockMvc.perform(get("/api/teacher/abc").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void findById_NotFound() throws Exception {
        mockMvc.perform(get("/api/teacher/999").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }
}
