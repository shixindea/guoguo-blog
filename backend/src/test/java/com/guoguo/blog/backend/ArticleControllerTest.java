package com.guoguo.blog.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guoguo.blog.backend.entity.Category;
import com.guoguo.blog.backend.entity.Tag;
import com.guoguo.blog.backend.entity.User;
import com.guoguo.blog.backend.entity.UserRole;
import com.guoguo.blog.backend.repository.ArticleCollectionRepository;
import com.guoguo.blog.backend.repository.ArticleLikeRepository;
import com.guoguo.blog.backend.repository.ArticleReadHistoryRepository;
import com.guoguo.blog.backend.repository.ArticleRepository;
import com.guoguo.blog.backend.repository.ArticleTagRepository;
import com.guoguo.blog.backend.repository.CategoryRepository;
import com.guoguo.blog.backend.repository.TagRepository;
import com.guoguo.blog.backend.repository.UserRepository;
import com.guoguo.blog.backend.repository.UserRoleRepository;
import com.guoguo.blog.backend.security.CustomUserDetails;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ArticleControllerTest {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private UserRepository userRepository;
  @Autowired private UserRoleRepository userRoleRepository;
  @Autowired private CategoryRepository categoryRepository;
  @Autowired private TagRepository tagRepository;
  @Autowired private ArticleRepository articleRepository;
  @Autowired private ArticleTagRepository articleTagRepository;
  @Autowired private ArticleLikeRepository articleLikeRepository;
  @Autowired private ArticleCollectionRepository articleCollectionRepository;
  @Autowired private ArticleReadHistoryRepository articleReadHistoryRepository;

  private CustomUserDetails principal;
  private Long categoryId;
  private Long tagId;

  @BeforeEach
  void setup() {
    articleReadHistoryRepository.deleteAll();
    articleCollectionRepository.deleteAll();
    articleLikeRepository.deleteAll();
    articleTagRepository.deleteAll();
    articleRepository.deleteAll();
    userRoleRepository.deleteAll();
    userRepository.deleteAll();
    tagRepository.deleteAll();
    categoryRepository.deleteAll();

    User user =
        userRepository.save(
            User.builder().username("writer").email("writer@example.com").passwordHash("x").enabled(true).locked(false).build());
    userRoleRepository.save(UserRole.builder().user(user).roleCode("ROLE_USER").build());
    principal =
        new CustomUserDetails(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            "x",
            List.of(new SimpleGrantedAuthority("ROLE_USER")),
            true,
            true);

    Category category = categoryRepository.save(Category.builder().name("前端").slug("frontend").build());
    Tag tag = tagRepository.save(Tag.builder().name("React").slug("react").build());
    categoryId = category.getId();
    tagId = tag.getId();
  }

  @Test
  void create_and_list_and_detail() throws Exception {
    Map<String, Object> payload =
        Map.of(
            "title",
            "测试文章",
            "content",
            "Hello **World**",
            "status",
            "PUBLISHED",
            "visibility",
            "PUBLIC",
            "categoryId",
            categoryId,
            "tagIds",
            List.of(tagId));

    String body =
        mockMvc
            .perform(
                post("/api/articles")
                    .with(SecurityMockMvcRequestPostProcessors.user(principal))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(payload)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.id").exists())
            .andReturn()
            .getResponse()
            .getContentAsString();

    Long articleId =
        objectMapper.readTree(body).path("data").path("id").asLong();

    mockMvc
        .perform(get("/api/articles"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.data.list[0].id").value(articleId));

    mockMvc
        .perform(get("/api/articles/" + articleId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.data.title").value("测试文章"))
        .andExpect(jsonPath("$.data.tags[0].name").value("React"));
  }

  @Test
  void drafts_requires_auth_and_returns_drafts() throws Exception {
    Map<String, Object> payload =
        Map.of(
            "title",
            "草稿文章",
            "content",
            "Draft content",
            "status",
            "DRAFT",
            "visibility",
            "PUBLIC");

    mockMvc
        .perform(
            post("/api/articles")
                .with(SecurityMockMvcRequestPostProcessors.user(principal))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isOk());

    mockMvc.perform(get("/api/articles/drafts")).andExpect(status().isUnauthorized());

    mockMvc
        .perform(get("/api/articles/drafts").with(SecurityMockMvcRequestPostProcessors.user(principal)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.data.list[0].title").value("草稿文章"));
  }
}
