package com.guoguo.blog.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guoguo.blog.backend.entity.User;
import com.guoguo.blog.backend.entity.UserRole;
import com.guoguo.blog.backend.repository.UserRepository;
import com.guoguo.blog.backend.repository.UserRoleRepository;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private UserRepository userRepository;
  @Autowired private UserRoleRepository userRoleRepository;
  @Autowired private PasswordEncoder passwordEncoder;

  @Test
  void register_success() throws Exception {
    Map<String, Object> payload =
        Map.of(
            "email",
            "test@example.com",
            "password",
            "Password123",
            "confirmPassword",
            "Password123",
            "username",
            "testuser",
            "agreeToTerms",
            true);

    mockMvc
        .perform(
            post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.data.user.email").value("test@example.com"))
        .andExpect(jsonPath("$.data.accessToken").exists())
        .andExpect(jsonPath("$.data.refreshToken").exists());
  }

  @Test
  void login_success() throws Exception {
    User user =
        userRepository.save(
            User.builder()
                .username("loginuser")
                .email("login@example.com")
                .passwordHash(passwordEncoder.encode("Password123"))
                .enabled(true)
                .locked(false)
                .build());
    userRoleRepository.save(UserRole.builder().user(user).roleCode("ROLE_USER").build());

    Map<String, Object> payload = Map.of("email", "login@example.com", "password", "Password123");

    mockMvc
        .perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.data.user.email").value("login@example.com"))
        .andExpect(jsonPath("$.data.accessToken").exists());
  }
}

