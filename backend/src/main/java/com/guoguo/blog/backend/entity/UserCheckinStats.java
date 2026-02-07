package com.guoguo.blog.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(
    name = "user_checkin_stats",
    indexes = {@Index(name = "idx_streak", columnList = "current_streak"), @Index(name = "idx_total_days", columnList = "total_checkin_days")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCheckinStats {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false, unique = true)
  private User user;

  @Column(name = "total_checkin_days")
  private Integer totalCheckinDays;

  @Column(name = "total_points_earned")
  private Integer totalPointsEarned;

  @Column(name = "current_streak")
  private Integer currentStreak;

  @Column(name = "longest_streak")
  private Integer longestStreak;

  @Column(name = "current_month_days")
  private Integer currentMonthDays;

  @Column(name = "current_month_points")
  private Integer currentMonthPoints;

  @Column(name = "makeup_cards_available")
  private Integer makeupCardsAvailable;

  @Column(name = "makeup_cards_used_total")
  private Integer makeupCardsUsedTotal;

  @Column(name = "milestone_7_days")
  private Integer milestone7Days;

  @Column(name = "milestone_30_days")
  private Integer milestone30Days;

  @Column(name = "last_checkin_date")
  private LocalDate lastCheckinDate;

  @Column(name = "last_checkin_time")
  private LocalDateTime lastCheckinTime;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}

