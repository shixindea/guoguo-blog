package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.UserDTO;
import com.guoguo.blog.backend.entity.User;
import com.guoguo.blog.backend.exception.BusinessException;
import com.guoguo.blog.backend.repository.UserRepository;
import com.guoguo.blog.backend.repository.UserRoleRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;
  private final UserRoleRepository userRoleRepository;

  @Override
  public UserDTO getUserById(Long id) {
    User user =
        userRepository.findById(id).orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
    List<String> roles = userRoleRepository.findRoleCodesByUserId(user.getId());
    return UserDTO.builder()
        .id(user.getId())
        .username(user.getUsername())
        .email(user.getEmail())
        .displayName(user.getDisplayName())
        .avatarUrl(user.getAvatarUrl())
        .bio(user.getBio())
        .roles(roles)
        .createdAt(user.getCreatedAt())
        .build();
  }
}

