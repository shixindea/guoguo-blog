package com.guoguo.blog.backend.security;

import com.guoguo.blog.backend.entity.User;
import com.guoguo.blog.backend.repository.UserRepository;
import com.guoguo.blog.backend.repository.UserRoleRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;
  private final UserRoleRepository userRoleRepository;

  @Override
  @Transactional(readOnly = true)
  public UserDetails loadUserByUsername(String value) throws UsernameNotFoundException {
    User user =
        userRepository
            .findByUsernameOrEmail(value)
            .orElseThrow(() -> new UsernameNotFoundException("用户不存在"));

    if (Boolean.FALSE.equals(user.getEnabled())) {
      throw new DisabledException("账户已被禁用");
    }
    if (Boolean.TRUE.equals(user.getLocked())) {
      throw new LockedException("账户已被锁定");
    }

    List<String> roleCodes = userRoleRepository.findRoleCodesByUserId(user.getId());
    return new CustomUserDetails(
        user.getId(),
        user.getUsername(),
        user.getEmail(),
        user.getPasswordHash(),
        roleCodes.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()),
        Boolean.TRUE.equals(user.getEnabled()),
        !Boolean.TRUE.equals(user.getLocked()));
  }
}

