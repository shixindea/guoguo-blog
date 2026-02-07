package com.guoguo.blog.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "articles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User author;

  @Column(nullable = false, length = 200)
  private String title;

  @Column(nullable = false, unique = true, length = 200)
  private String slug;

  @Column(name = "cover_image", length = 500)
  private String coverImage;

  @Column(columnDefinition = "TEXT")
  private String summary;

  @Column(columnDefinition = "LONGTEXT", nullable = false)
  private String content;

  @Column(name = "html_content", columnDefinition = "LONGTEXT")
  private String htmlContent;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  @Default
  private ArticleStatus status = ArticleStatus.DRAFT;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  @Default
  private ArticleVisibility visibility = ArticleVisibility.PUBLIC;

  @Column(length = 100)
  private String password;

  @Column(precision = 10, scale = 2)
  @Default
  private BigDecimal price = BigDecimal.ZERO;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id")
  private Category category;

  @Column(name = "view_count")
  @Default
  private Long viewCount = 0L;

  @Column(name = "like_count")
  @Default
  private Long likeCount = 0L;

  @Column(name = "collect_count")
  @Default
  private Long collectCount = 0L;

  @Column(name = "comment_count")
  @Default
  private Long commentCount = 0L;

  @Column(name = "share_count")
  @Default
  private Long shareCount = 0L;

  @Column(name = "published_at")
  private LocalDateTime publishedAt;

  @Column(name = "scheduled_at")
  private LocalDateTime scheduledAt;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @Column(name = "deleted_at")
  private LocalDateTime deletedAt;
}
