package com.openclassrooms.starterjwt.testconfig;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TestAuthHelper {
    public static String obtainAccessToken(MockMvc mockMvc, ObjectMapper mapper) throws Exception {
        return obtainAccessToken(mockMvc, mapper, "test@example.com", "testpassword");
    }

    public static String obtainAccessToken(MockMvc mockMvc, ObjectMapper mapper, String email, String password) throws Exception {
        String loginJson = mapper.writeValueAsString(new LoginDto(email, password));
        String result = mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(loginJson))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode node = mapper.readTree(result);
        return node.get("token").asText();
    }

    static class LoginDto {
        public String email;
        public String password;

        public LoginDto(String email, String password) {
            this.email = email;
            this.password = password;
        }
    }
}
