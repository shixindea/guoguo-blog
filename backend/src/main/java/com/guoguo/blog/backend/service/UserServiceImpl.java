package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.UserDTO;
import com.guoguo.blog.backend.dto.UpdateMyProfileRequest;
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
@Transactional
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;
  private final UserRoleRepository userRoleRepository;

  @Override
  @Transactional(readOnly = true)
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

  @Override
  public UserDTO updateMyProfile(Long id, UpdateMyProfileRequest request) {
    User user =
        userRepository.findById(id).orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

    if (request.getDisplayName() != null) {
      String displayName = request.getDisplayName().trim();
      user.setDisplayName(displayName.isEmpty() ? null : displayName);
    }
    if (request.getAvatarUrl() != null) {
      String avatarUrl = request.getAvatarUrl().trim();
      user.setAvatarUrl(avatarUrl.isEmpty() ? null : avatarUrl);
    }
    if (request.getBio() != null) {
      String bio = request.getBio().trim();
      user.setBio(bio.isEmpty() ? null : bio);
    }

    userRepository.save(user);
    return getUserById(id);
  }
}
