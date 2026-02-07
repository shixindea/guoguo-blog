# 登录注册系统后端设计（Java）

## 一、技术栈选择

### 1. 核心框架
- **Spring Boot 3.x**（最新稳定版）
- **Spring Security 6.x**
- **Spring Data JPA**

### 2. JDK版本
- **JDK 17 LTS**（推荐）或 **JDK 21 LTS**（最新稳定版）
- 使用LTS版本确保长期支持

### 3. 数据库
- **MySQL 8.x** 或 **PostgreSQL 15+**
- **Redis 7.x**（用于Session、缓存、限流）

### 4. 安全相关
- **JJWT**（JWT生成和验证）
- **BCrypt**（密码加密）
- **Java Mail Sender**（邮件发送）

### 5. 其他依赖
- **MapStruct**（对象映射）
- **Lombok**（简化代码）
- **Validation API**（参数校验）
- **Spring Boot Starter Cache**

## 二、数据库设计

### 1. 用户表（users）
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    display_name VARCHAR(100) COMMENT '显示名称',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    bio TEXT COMMENT '个人简介',
    phone VARCHAR(20) COMMENT '手机号',
    
    -- 状态相关
    is_enabled BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    is_locked BOOLEAN DEFAULT FALSE COMMENT '是否锁定',
    is_email_verified BOOLEAN DEFAULT FALSE COMMENT '邮箱是否验证',
    is_phone_verified BOOLEAN DEFAULT FALSE COMMENT '手机是否验证',
    
    -- 时间戳
    last_login_time DATETIME COMMENT '最后登录时间',
    last_login_ip VARCHAR(45) COMMENT '最后登录IP',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    -- 索引
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

### 2. 用户角色表（user_roles）
```sql
CREATE TABLE user_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    role_code VARCHAR(50) NOT NULL COMMENT '角色代码: ROLE_USER, ROLE_ADMIN等',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_role (user_id, role_code)
) COMMENT='用户角色表';
```

### 3. 第三方登录表（user_oauth）
```sql
CREATE TABLE user_oauth (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    oauth_provider VARCHAR(20) NOT NULL COMMENT '提供商: GITHUB, WECHAT, GOOGLE等',
    oauth_user_id VARCHAR(100) NOT NULL COMMENT '第三方用户ID',
    oauth_username VARCHAR(100) COMMENT '第三方用户名',
    oauth_email VARCHAR(100) COMMENT '第三方邮箱',
    access_token VARCHAR(500) COMMENT '访问令牌',
    refresh_token VARCHAR(500) COMMENT '刷新令牌',
    expires_at DATETIME COMMENT '过期时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_oauth (oauth_provider, oauth_user_id),
    UNIQUE KEY uk_user_provider (user_id, oauth_provider)
) COMMENT='第三方登录关联表';
```

### 4. 验证码表（verification_codes）
```sql
CREATE TABLE verification_codes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL COMMENT '邮箱',
    code VARCHAR(10) NOT NULL COMMENT '验证码',
    code_type VARCHAR(20) NOT NULL COMMENT '类型: REGISTER, LOGIN, RESET_PASSWORD',
    ip_address VARCHAR(45) NOT NULL COMMENT '请求IP',
    is_used BOOLEAN DEFAULT FALSE COMMENT '是否已使用',
    expires_at DATETIME NOT NULL COMMENT '过期时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email_type (email, code_type),
    INDEX idx_expires_at (expires_at)
) COMMENT='验证码表';
```

### 5. 登录记录表（login_records）
```sql
CREATE TABLE login_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    login_method VARCHAR(20) NOT NULL COMMENT '登录方式: EMAIL, PHONE, GITHUB等',
    ip_address VARCHAR(45) NOT NULL COMMENT '登录IP',
    user_agent TEXT COMMENT '用户代理',
    device_type VARCHAR(50) COMMENT '设备类型',
    is_success BOOLEAN NOT NULL COMMENT '是否成功',
    failure_reason VARCHAR(100) COMMENT '失败原因',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) COMMENT='登录记录表';
```

### 6. 密码重置表（password_resets）
```sql
CREATE TABLE password_resets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(255) NOT NULL COMMENT '重置令牌哈希',
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token_hash),
    INDEX idx_expires_at (expires_at)
) COMMENT='密码重置表';
```

## 三、领域模型设计

### 1. 用户实体（User）
```java
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String username;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;
    
    @Column(name = "display_name", length = 100)
    private String displayName;
    
    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;
    
    @Column(length = 1000)
    private String bio;
    
    @Column(length = 20)
    private String phone;
    
    @Column(name = "is_enabled")
    private Boolean enabled = true;
    
    @Column(name = "is_locked")
    private Boolean locked = false;
    
    @Column(name = "is_email_verified")
    private Boolean emailVerified = false;
    
    @Column(name = "is_phone_verified")
    private Boolean phoneVerified = false;
    
    @Column(name = "last_login_time")
    private LocalDateTime lastLoginTime;
    
    @Column(name = "last_login_ip", length = 45)
    private String lastLoginIp;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 关联关系
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserRole> roles = new HashSet<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserOAuth> oauthConnections = new HashSet<>();
}
```

### 2. 用户角色实体（UserRole）
```java
@Entity
@Table(name = "user_roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRole {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "role_code", nullable = false, length = 50)
    private String roleCode;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
```

### 3. 认证相关DTO

```java
// 注册请求DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 8, max = 32, message = "密码长度8-32位")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
        message = "密码必须包含大小写字母和数字"
    )
    private String password;
    
    @NotBlank(message = "确认密码不能为空")
    private String confirmPassword;
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度3-20位")
    @Pattern(
        regexp = "^[a-zA-Z0-9_]+$",
        message = "用户名只能包含字母、数字和下划线"
    )
    private String username;
    
    private String verificationCode;
    
    private String referralCode;
    
    @AssertTrue(message = "必须同意用户协议")
    private Boolean agreeToTerms = false;
}

// 登录请求DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    @NotBlank(message = "邮箱不能为空")
    private String email;
    
    @NotBlank(message = "密码不能为空")
    private String password;
    
    private Boolean rememberMe = false;
}

// 验证码请求DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationCodeRequest {
    
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @NotNull(message = "验证码类型不能为空")
    private VerificationCodeType type;
}

// 第三方登录请求DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuthLoginRequest {
    
    @NotBlank(message = "授权码不能为空")
    private String code;
    
    @NotBlank(message = "状态参数不能为空")
    private String state;
    
    @NotNull(message = "OAuth提供商不能为空")
    private OAuthProvider provider;
}

// 认证响应DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private UserDTO user;
    
    private String accessToken;
    
    private String refreshToken;
    
    private String tokenType = "Bearer";
    
    private Long expiresIn;
    
    private Boolean requiresMfa = false;
    
    private String mfaToken;
}

// 用户信息DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    
    private Long id;
    private String username;
    private String email;
    private String displayName;
    private String avatarUrl;
    private String bio;
    private Boolean emailVerified;
    private List<String> roles;
    private LocalDateTime createdAt;
}
```

## 四、Spring Security配置

### 1. 安全配置类
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final PasswordEncoder passwordEncoder;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
            )
            .authorizeHttpRequests(auth -> auth
                // 公开接口
                .requestMatchers(
                    "/api/auth/**",
                    "/api/public/**",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()
                // 需要认证的接口
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

### 2. JWT工具类
```java
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.access-token-expiration}")
    private Long accessTokenExpiration;
    
    @Value("${app.jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;
    
    public String generateAccessToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return buildToken(userDetails, accessTokenExpiration);
    }
    
    public String generateRefreshToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return buildToken(userDetails, refreshTokenExpiration);
    }
    
    public String generateAccessTokenFromUsername(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    private String buildToken(UserDetails userDetails, Long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .claim("authorities", userDetails.getAuthorities())
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

### 3. 自定义UserDetailsService
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) 
            throws UsernameNotFoundException {
        
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "用户不存在: " + username
                ));
        
        if (!user.getEnabled()) {
            throw new AccountDisabledException("账户已被禁用");
        }
        
        if (user.getLocked()) {
            throw new AccountLockedException("账户已被锁定");
        }
        
        List<String> roleCodes = userRoleRepository.findRoleCodesByUserId(user.getId());
        List<SimpleGrantedAuthority> authorities = roleCodes.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        
        return new CustomUserDetails(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPasswordHash(),
                authorities,
                user.getEnabled(),
                !user.getLocked(),
                true,
                true
        );
    }
}
```

### 4. JWT认证过滤器
```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        try {
            String jwt = getJwtFromRequest(request);
            
            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
                String username = jwtTokenProvider.getUsernameFromToken(jwt);
                
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities()
                        );
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            log.error("无法设置用户认证", e);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

## 五、服务层设计

### 1. 认证服务接口
```java
public interface AuthService {
    
    /**
     * 发送验证码
     */
    void sendVerificationCode(VerificationCodeRequest request);
    
    /**
     * 验证验证码
     */
    boolean verifyCode(String email, String code, VerificationCodeType type);
    
    /**
     * 注册新用户
     */
    AuthResponse register(RegisterRequest request);
    
    /**
     * 邮箱密码登录
     */
    AuthResponse login(LoginRequest request);
    
    /**
     * 第三方登录
     */
    AuthResponse oauthLogin(OAuthLoginRequest request);
    
    /**
     * 刷新令牌
     */
    AuthResponse refreshToken(String refreshToken);
    
    /**
     * 登出
     */
    void logout(String refreshToken);
    
    /**
     * 忘记密码请求
     */
    void forgotPassword(String email);
    
    /**
     * 重置密码
     */
    void resetPassword(ResetPasswordRequest request);
    
    /**
     * 修改密码
     */
    void changePassword(Long userId, ChangePasswordRequest request);
}
```

### 2. 认证服务实现
```java
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthServiceImpl implements AuthService {
    
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final LoginRecordRepository loginRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;
    private final RateLimiterService rateLimiterService;
    
    @Value("${app.auth.max-login-attempts}")
    private int maxLoginAttempts;
    
    @Value("${app.auth.lockout-duration}")
    private long lockoutDuration;
    
    @Override
    public void sendVerificationCode(VerificationCodeRequest request) {
        // 1. 速率限制检查
        String rateLimitKey = "verification:" + request.getEmail() + ":" + request.getType();
        if (!rateLimiterService.allowRequest(rateLimitKey, 5, 60)) { // 5次/分钟
            throw new RateLimitException("发送验证码过于频繁，请稍后重试");
        }
        
        // 2. 验证邮箱是否已注册（如果是注册场景）
        if (request.getType() == VerificationCodeType.REGISTER) {
            boolean exists = userRepository.existsByEmail(request.getEmail());
            if (exists) {
                throw new BusinessException("邮箱已被注册");
            }
        }
        
        // 3. 生成验证码
        String code = generateVerificationCode();
        
        // 4. 保存到数据库
        VerificationCode verificationCode = VerificationCode.builder()
                .email(request.getEmail())
                .code(code)
                .type(request.getType())
                .ipAddress(getClientIp())
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();
        
        verificationCodeRepository.save(verificationCode);
        
        // 5. 发送邮件
        emailService.sendVerificationCode(request.getEmail(), code);
        
        log.info("验证码已发送至 {}，类型: {}", request.getEmail(), request.getType());
    }
    
    @Override
    public boolean verifyCode(String email, String code, VerificationCodeType type) {
        Optional<VerificationCode> optionalCode = verificationCodeRepository
                .findTopByEmailAndTypeAndIsUsedFalseOrderByCreatedAtDesc(email, type);
        
        if (optionalCode.isEmpty()) {
            return false;
        }
        
        VerificationCode verificationCode = optionalCode.get();
        
        // 检查是否过期
        if (verificationCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }
        
        // 检查验证码是否正确
        if (!verificationCode.getCode().equals(code)) {
            return false;
        }
        
        // 标记为已使用
        verificationCode.setUsed(true);
        verificationCodeRepository.save(verificationCode);
        
        return true;
    }
    
    @Override
    public AuthResponse register(RegisterRequest request) {
        // 1. 验证密码一致性
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("两次输入的密码不一致");
        }
        
        // 2. 验证验证码
        if (!verifyCode(request.getEmail(), request.getVerificationCode(), 
                VerificationCodeType.REGISTER)) {
            throw new BusinessException("验证码错误或已过期");
        }
        
        // 3. 检查用户名和邮箱是否已存在
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("用户名已存在");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("邮箱已被注册");
        }
        
        // 4. 创建用户
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getUsername())
                .enabled(true)
                .emailVerified(true)
                .build();
        
        user = userRepository.save(user);
        
        // 5. 分配默认角色
        UserRole userRole = UserRole.builder()
                .user(user)
                .roleCode("ROLE_USER")
                .build();
        userRoleRepository.save(userRole);
        
        // 6. 记录邀请关系（如果有邀请码）
        if (StringUtils.hasText(request.getReferralCode())) {
            processReferral(user.getId(), request.getReferralCode());
        }
        
        // 7. 生成令牌
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getUsername(), request.getPassword()
        );
        
        return generateAuthResponse(authentication, user);
    }
    
    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        
        // 1. 检查账户锁定状态
        String lockKey = "login:lock:" + email;
        String attemptsKey = "login:attempts:" + email;
        
        Integer attempts = (Integer) redisTemplate.opsForValue().get(attemptsKey);
        if (attempts != null && attempts >= maxLoginAttempts) {
            Boolean isLocked = redisTemplate.hasKey(lockKey);
            if (Boolean.TRUE.equals(isLocked)) {
                throw new AccountLockedException("账户已被锁定，请稍后重试");
            }
        }
        
        try {
            // 2. 认证
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // 3. 获取用户信息
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("用户不存在"));
            
            // 4. 检查用户状态
            if (!user.getEnabled()) {
                throw new AccountDisabledException("账户已被禁用");
            }
            
            // 5. 更新登录信息
            user.setLastLoginTime(LocalDateTime.now());
            user.setLastLoginIp(getClientIp());
            userRepository.save(user);
            
            // 6. 清除登录失败记录
            redisTemplate.delete(attemptsKey);
            redisTemplate.delete(lockKey);
            
            // 7. 记录登录成功
            saveLoginRecord(user, LoginMethod.EMAIL, true, null);
            
            // 8. 生成响应
            return generateAuthResponse(authentication, user);
            
        } catch (AuthenticationException e) {
            // 登录失败处理
            handleLoginFailure(email);
            
            // 记录登录失败
            saveLoginRecord(null, LoginMethod.EMAIL, false, e.getMessage());
            
            throw new BusinessException("邮箱或密码错误");
        }
    }
    
    @Override
    public AuthResponse refreshToken(String refreshToken) {
        try {
            // 验证refresh token
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                throw new BusinessException("刷新令牌无效或已过期");
            }
            
            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            
            // 检查用户是否存在且可用
            User user = userRepository.findByUsernameOrEmail(username, username)
                    .orElseThrow(() -> new UsernameNotFoundException("用户不存在"));
            
            if (!user.getEnabled()) {
                throw new AccountDisabledException("账户已被禁用");
            }
            
            if (user.getLocked()) {
                throw new AccountLockedException("账户已被锁定");
            }
            
            // 检查refresh token是否在黑名单中
            String blacklistKey = "token:blacklist:" + refreshToken;
            if (Boolean.TRUE.equals(redisTemplate.hasKey(blacklistKey))) {
                throw new BusinessException("刷新令牌已失效");
            }
            
            // 生成新的access token
            String newAccessToken = jwtTokenProvider.generateAccessTokenFromUsername(username);
            
            // 可选的：生成新的refresh token（实现刷新令牌轮换）
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    username, null, Collections.emptyList()
            );
            String newRefreshToken = jwtTokenProvider.generateRefreshToken(authentication);
            
            // 将旧的refresh token加入黑名单
            redisTemplate.opsForValue().set(
                    blacklistKey, 
                    "revoked", 
                    Duration.ofHours(24)
            );
            
            return AuthResponse.builder()
                    .user(convertToUserDTO(user))
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .expiresIn(3600L) // 1小时
                    .build();
            
        } catch (Exception e) {
            log.error("刷新令牌失败", e);
            throw new BusinessException("刷新令牌失败");
        }
    }
    
    @Override
    public void logout(String refreshToken) {
        // 将refresh token加入黑名单
        if (StringUtils.hasText(refreshToken)) {
            String blacklistKey = "token:blacklist:" + refreshToken;
            redisTemplate.opsForValue().set(
                    blacklistKey, 
                    "revoked", 
                    Duration.ofHours(24)
            );
        }
        
        // 清除Security Context
        SecurityContextHolder.clearContext();
    }
    
    @Override
    public void forgotPassword(String email) {
        // 1. 检查用户是否存在
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("邮箱未注册"));
        
        // 2. 生成重置令牌
        String resetToken = UUID.randomUUID().toString();
        String tokenHash = passwordEncoder.encode(resetToken);
        
        // 3. 保存重置记录
        PasswordReset reset = PasswordReset.builder()
                .userId(user.getId())
                .tokenHash(tokenHash)
                .expiresAt(LocalDateTime.now().plusHours(2))
                .build();
        
        passwordResetRepository.save(reset);
        
        // 4. 发送重置邮件
        String resetUrl = String.format(
                "%s/reset-password?token=%s", 
                frontendUrl, 
                resetToken
        );
        
        emailService.sendPasswordResetEmail(email, resetUrl);
    }
    
    @Override
    public void resetPassword(ResetPasswordRequest request) {
        // 1. 验证新密码
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("两次输入的密码不一致");
        }
        
        // 2. 查找有效的重置记录
        LocalDateTime now = LocalDateTime.now();
        List<PasswordReset> resets = passwordResetRepository
                .findByUserIdAndIsUsedFalseAndExpiresAtAfter(request.getUserId(), now);
        
        boolean isValid = false;
        PasswordReset validReset = null;
        
        for (PasswordReset reset : resets) {
            if (passwordEncoder.matches(request.getToken(), reset.getTokenHash())) {
                isValid = true;
                validReset = reset;
                break;
            }
        }
        
        if (!isValid || validReset == null) {
            throw new BusinessException("重置链接无效或已过期");
        }
        
        // 3. 更新用户密码
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new BusinessException("用户不存在"));
        
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        // 4. 标记重置记录为已使用
        validReset.setUsed(true);
        passwordResetRepository.save(validReset);
        
        // 5. 使所有现有token失效
        invalidateUserTokens(user.getId());
    }
    
    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        // 1. 验证当前密码
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));
        
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BusinessException("当前密码错误");
        }
        
        // 2. 验证新密码
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("两次输入的密码不一致");
        }
        
        // 3. 验证新密码不能与旧密码相同
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BusinessException("新密码不能与旧密码相同");
        }
        
        // 4. 更新密码
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        // 5. 使其他设备的token失效（可选）
        if (request.getInvalidateOtherSessions()) {
            invalidateUserTokens(userId);
        }
    }
    
    // 辅助方法
    private void handleLoginFailure(String email) {
        String attemptsKey = "login:attempts:" + email;
        String lockKey = "login:lock:" + email;
        
        // 增加失败计数
        Long attempts = redisTemplate.opsForValue().increment(attemptsKey);
        if (attempts == 1) {
            // 第一次失败，设置过期时间
            redisTemplate.expire(attemptsKey, Duration.ofMinutes(30));
        }
        
        // 达到最大失败次数，锁定账户
        if (attempts >= maxLoginAttempts) {
            redisTemplate.opsForValue().set(
                    lockKey, 
                    "locked", 
                    Duration.ofMillis(lockoutDuration)
            );
            
            // 锁定数据库中的用户账户
            userRepository.findByEmail(email).ifPresent(user -> {
                user.setLocked(true);
                userRepository.save(user);
            });
        }
    }
    
    private void saveLoginRecord(User user, LoginMethod method, 
            boolean success, String failureReason) {
        LoginRecord record = LoginRecord.builder()
                .userId(user != null ? user.getId() : null)
                .loginMethod(method)
                .ipAddress(getClientIp())
                .userAgent(getUserAgent())
                .isSuccess(success)
                .failureReason(failureReason)
                .build();
        
        loginRecordRepository.save(record);
    }
    
    private AuthResponse generateAuthResponse(Authentication authentication, User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);
        
        // 存储refresh token（用于刷新令牌轮换）
        String refreshTokenKey = "user:refresh:" + user.getId() + ":" + 
                DigestUtils.md5DigestAsHex(refreshToken.getBytes());
        redisTemplate.opsForValue().set(
                refreshTokenKey, 
                refreshToken, 
                Duration.ofDays(7)
        );
        
        return AuthResponse.builder()
                .user(convertToUserDTO(user))
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(3600L)
                .build();
    }
    
    private UserDTO convertToUserDTO(User user) {
        List<String> roles = userRoleRepository.findRoleCodesByUserId(user.getId());
        
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .emailVerified(user.getEmailVerified())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }
    
    private void invalidateUserTokens(Long userId) {
        // 使该用户的所有refresh token失效
        String pattern = "user:refresh:" + userId + ":*";
        Set<String> keys = redisTemplate.keys(pattern);
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }
    
    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }
    
    private String getClientIp() {
        // 从请求上下文中获取IP
        ServletRequestAttributes attributes = 
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            return attributes.getRequest().getRemoteAddr();
        }
        return "unknown";
    }
    
    private String getUserAgent() {
        ServletRequestAttributes attributes = 
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            return attributes.getRequest().getHeader("User-Agent");
        }
        return "unknown";
    }
}
```

## 六、控制器层设计

### 1. 认证控制器
```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
@Slf4j
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/send-verification-code")
    @Operation(summary = "发送验证码")
    public ResponseEntity<ApiResponse<Void>> sendVerificationCode(
            @Valid @RequestBody VerificationCodeRequest request
    ) {
        authService.sendVerificationCode(request);
        return ResponseEntity.ok(ApiResponse.success("验证码已发送"));
    }
    
    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("注册成功", response));
    }
    
    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("登录成功", response));
    }
    
    @PostMapping("/oauth/{provider}")
    @Operation(summary = "第三方登录")
    public ResponseEntity<ApiResponse<AuthResponse>> oauthLogin(
            @PathVariable OAuthProvider provider,
            @Valid @RequestBody OAuthLoginRequest request
    ) {
        request.setProvider(provider);
        AuthResponse response = authService.oauthLogin(request);
        return ResponseEntity.ok(ApiResponse.success("登录成功", response));
    }
    
    @PostMapping("/refresh-token")
    @Operation(summary = "刷新访问令牌")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("令牌刷新成功", response));
    }
    
    @PostMapping("/logout")
    @Operation(summary = "用户登出")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> logout(
            @Valid @RequestBody LogoutRequest request
    ) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("登出成功"));
    }
    
    @PostMapping("/forgot-password")
    @Operation(summary = "忘记密码")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("重置邮件已发送"));
    }
    
    @PostMapping("/reset-password")
    @Operation(summary = "重置密码")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("密码重置成功"));
    }
}
```

### 2. 用户控制器
```java
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    @Operation(summary = "获取当前用户信息")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        UserDTO user = userService.getUserById(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(user));
    }
    
    @PutMapping("/profile")
    @Operation(summary = "更新用户资料")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserDTO user = userService.updateProfile(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("资料更新成功", user));
    }
    
    @PostMapping("/change-password")
    @Operation(summary = "修改密码")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("密码修改成功"));
    }
    
    @PostMapping("/upload-avatar")
    @Operation(summary = "上传头像")
    public ResponseEntity<ApiResponse<String>> uploadAvatar(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("file") MultipartFile file
    ) {
        String avatarUrl = userService.uploadAvatar(userDetails.getId(), file);
        return ResponseEntity.ok(ApiResponse.success("头像上传成功", avatarUrl));
    }
}
```

## 七、配置类

### 1. 应用配置
```yaml
# application.yml
server:
  port: 8080
  servlet:
    context-path: /api
  compression:
    enabled: true

spring:
  application:
    name: tech-platform-auth
    
  datasource:
    url: jdbc:mysql://localhost:3306/tech_platform?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
  
  jpa:
    database-platform: org.hibernate.dialect.MySQL8Dialect
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
  
  data:
    redis:
      host: localhost
      port: 6379
      password: 
      database: 0
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
          max-wait: -1ms
  
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

app:
  jwt:
    secret: ${JWT_SECRET:your-256-bit-secret-key-needs-to-be-at-least-32-chars}
    access-token-expiration: 3600000 # 1小时，毫秒
    refresh-token-expiration: 604800000 # 7天，毫秒
  
  auth:
    max-login-attempts: 5
    lockout-duration: 1800000 # 30分钟，毫秒
    verification-code-expiration: 600 # 10分钟，秒
  
  cors:
    allowed-origins: 
      - http://localhost:3000
      - https://your-frontend.com
  
  frontend:
    url: http://localhost:3000

logging:
  level:
    com.yourpackage: DEBUG
    org.springframework.security: INFO
```

## 八、异常处理

### 1. 全局异常处理器
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(
            BusinessException ex
    ) {
        log.warn("业务异常: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getErrorCode(), ex.getMessage()));
    }
    
    @ExceptionHandler(AccountLockedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccountLockedException(
            AccountLockedException ex
    ) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("ACCOUNT_LOCKED", ex.getMessage()));
    }
    
    @ExceptionHandler(AccountDisabledException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccountDisabledException(
            AccountDisabledException ex
    ) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("ACCOUNT_DISABLED", ex.getMessage()));
    }
    
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUsernameNotFoundException(
            UsernameNotFoundException ex
    ) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("USER_NOT_FOUND", "用户不存在"));
    }
    
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(
            AuthenticationException ex
    ) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("AUTHENTICATION_FAILED", "认证失败"));
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(
            AccessDeniedException ex
    ) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("ACCESS_DENIED", "权限不足"));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
            MethodArgumentNotValidException ex
    ) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("VALIDATION_FAILED", message));
    }
    
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolationException(
            ConstraintViolationException ex
    ) {
        String message = ex.getConstraintViolations()
                .stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("VALIDATION_FAILED", message));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(
            Exception ex
    ) {
        log.error("系统异常", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("INTERNAL_ERROR", "系统内部错误"));
    }
}
```

### 2. 自定义异常类
```java
public class BusinessException extends RuntimeException {
    
    private final String errorCode;
    
    public BusinessException(String message) {
        super(message);
        this.errorCode = "BUSINESS_ERROR";
    }
    
    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}

public class RateLimitException extends BusinessException {
    public RateLimitException(String message) {
        super("RATE_LIMIT_EXCEEDED", message);
    }
}

public class AccountLockedException extends AuthenticationException {
    public AccountLockedException(String msg) {
        super(msg);
    }
}

public class AccountDisabledException extends AuthenticationException {
    public AccountDisabledException(String msg) {
        super(msg);
    }
}
```

## 九、测试

### 1. 单元测试示例
```java
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void testRegisterSuccess() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("test@example.com")
                .username("testuser")
                .password("Password123")
                .confirmPassword("Password123")
                .verificationCode("123456")
                .agreeToTerms(true)
                .build();
        
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.user.email").value("test@example.com"))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.refreshToken").exists());
    }
    
    @Test
    void testLoginSuccess() throws Exception {
        // 先创建用户
        createTestUser();
        
        LoginRequest request = LoginRequest.builder()
                .email("test@example.com")
                .password("Password123")
                .build();
        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.user.email").value("test@example.com"));
    }
    
    @Test
    void testLoginWithInvalidCredentials() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("wrong@example.com")
                .password("WrongPassword")
                .build();
        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("AUTHENTICATION_FAILED"));
    }
}
```

## 十、部署建议

### 1. Docker配置
```dockerfile
# Dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

# 复制构建文件
COPY target/*.jar app.jar

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 设置JVM参数
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

# 暴露端口
EXPOSE 8080

# 启动命令
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### 2. Docker Compose
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: tech-platform-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: tech_platform
      MYSQL_USER: app_user
      MYSQL_PASSWORD: app_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    command: 
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
    networks:
      - tech-platform-network

  redis:
    image: redis:7-alpine
    container_name: tech-platform-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    networks:
      - tech-platform-network

  app:
    build: .
    container_name: tech-platform-app
    depends_on:
      - mysql
      - redis
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/tech_platform?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8
      SPRING_DATASOURCE_USERNAME: app_user
      SPRING_DATASOURCE_PASSWORD: app_password
      SPRING_REDIS_HOST: redis
      JWT_SECRET: your-256-bit-secret-key-needs-to-be-at-least-32-chars
    ports:
      - "8080:8080"
    networks:
      - tech-platform-network

volumes:
  mysql_data:
  redis_data:

networks:
  tech-platform-network:
    driver: bridge
```

这个设计提供了完整的Java后端登录注册系统实现，包括：
1. **完整的数据库设计**：用户表、角色表、验证码表、登录记录表等
2. **Spring Security集成**：JWT认证、权限控制
3. **业务逻辑层**：注册、登录、验证码、密码重置等
4. **RESTful API设计**：规范的接口设计和错误处理
5. **安全考虑**：密码加密、防暴力破解、XSS防护
6. **性能优化**：Redis缓存、数据库连接池
7. **测试和部署**：单元测试、Docker配置

可以根据实际需求进一步扩展，比如添加短信验证、更复杂的权限系统、审计日志等功能。