package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.AuthResponse;
import com.guoguo.blog.backend.dto.LoginRequest;
import com.guoguo.blog.backend.dto.RegisterRequest;
import com.guoguo.blog.backend.dto.UserDTO;
import com.guoguo.blog.backend.entity.User;
import com.guoguo.blog.backend.entity.UserRole;
import com.guoguo.blog.backend.exception.BusinessException;
import com.guoguo.blog.backend.repository.UserRepository;
import com.guoguo.blog.backend.repository.UserRoleRepository;
import com.guoguo.blog.backend.security.JwtTokenProvider;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {
  private final UserRepository userRepository;
  private final UserRoleRepository userRoleRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwtTokenProvider;

  @Override
  public AuthResponse register(RegisterRequest request) {
    if (!StringUtils.hasText(request.getPassword()) || !request.getPassword().equals(request.getConfirmPassword())) {
      throw new BusinessException("PASSWORD_MISMATCH", "两次输入的密码不一致");
    }
    if (Boolean.FALSE.equals(request.getAgreeToTerms())) {
      throw new BusinessException("TERMS_NOT_ACCEPTED", "必须同意用户协议");
    }
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new BusinessException("USERNAME_EXISTS", "用户名已存在");
    }
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new BusinessException("EMAIL_EXISTS", "邮箱已被注册");
    }

    User user =
        User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .displayName(request.getUsername())
            .enabled(true)
            .locked(false)
            .createdAt(LocalDateTime.now())
            .build();
    user = userRepository.save(user);

    UserRole role = UserRole.builder().user(user).roleCode("ROLE_USER").build();
    userRoleRepository.save(role);

    Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    return buildAuthResponse(authentication, user);
  }

  @Override
  public AuthResponse login(LoginRequest request) {
    Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    User user =
        userRepository
            .findByUsernameOrEmail(request.getEmail())
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

    user.setLastLoginTime(LocalDateTime.now());
    userRepository.save(user);

    return buildAuthResponse(authentication, user);
  }

  private AuthResponse buildAuthResponse(Authentication authentication, User user) {
    String accessToken = jwtTokenProvider.generateAccessToken(authentication);
    String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);
    List<String> roles = userRoleRepository.findRoleCodesByUserId(user.getId());

    UserDTO userDTO =
        UserDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .displayName(user.getDisplayName())
            .avatarUrl(user.getAvatarUrl())
            .bio(user.getBio())
            .roles(roles)
            .createdAt(user.getCreatedAt())
            .build();

    return AuthResponse.builder()
        .user(userDTO)
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .expiresIn(3600L)
        .tokenType("Bearer")
        .build();
  }
}

