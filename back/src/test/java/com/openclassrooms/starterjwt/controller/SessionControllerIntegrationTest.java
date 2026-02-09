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

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import com.openclassrooms.starterjwt.testconfig.TestSecurityConfig;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
@Import(TestSecurityConfig.class)
public class SessionControllerIntegrationTest {

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
    public void findAll_ShouldReturnSessions() throws Exception {
        mockMvc.perform(get("/api/session").contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Morning Yoga")));
    }

    @Test
    public void findById_ShouldReturnSession() throws Exception {
        mockMvc.perform(get("/api/session/1").contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Morning Yoga")));
    }

    @Test
    public void findById_BadRequest_NonNumeric() throws Exception {
        mockMvc.perform(get("/api/session/abc").contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void findById_NotFound() throws Exception {
        mockMvc.perform(get("/api/session/999").contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    public void participate_ShouldReturnOk() throws Exception {
        mockMvc.perform(post("/api/session/1/participate/1").contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    public void participate_BadRequest_NonNumeric() throws Exception {
        mockMvc.perform(post("/api/session/abc/participate/xyz").contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void create_ShouldReturnOk() throws Exception {
        Map<String, Object> dto = new HashMap<>();
        dto.put("name", "Evening Yoga");
        dto.put("date", 1609459200000L);
        dto.put("teacher_id", 1);
        dto.put("description", "Evening session");

        mockMvc.perform(post("/api/session").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().string(org.hamcrest.Matchers.containsString("Evening Yoga")));
    }

    @Test
    public void create_BadRequest_InvalidBody() throws Exception {
        Map<String, Object> dto = new HashMap<>();
        // missing required name and description
        dto.put("date", null);
        dto.put("teacher_id", null);

        mockMvc.perform(post("/api/session").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }
}
