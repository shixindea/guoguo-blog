package com.guoguo.blog.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 50)
  private String name;

  @Column(nullable = false, unique = true, length = 50)
  private String slug;

  @Column(length = 500)
  private String description;

  @Column(length = 100)
  private String icon;

  @Column(length = 20)
  private String color;

  @Column(name = "article_count")
  @Default
  private Integer articleCount = 0;

  @Column(name = "is_recommended")
  @Default
  private Boolean recommended = false;

  @Column(name = "is_hot")
  @Default
  private Boolean hot = false;

  @Column(name = "is_system")
  @Default
  private Boolean system = false;

  @Column(name = "is_enabled")
  @Default
  private Boolean enabled = true;

  @Column(length = 20)
  private String style;

  @Column(name = "view_count")
  @Default
  private Integer viewCount = 0;

  @ManyToOne
  @JoinColumn(name = "created_by")
  private User createdBy;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}
