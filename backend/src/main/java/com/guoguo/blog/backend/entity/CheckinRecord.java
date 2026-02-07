package com.guoguo.blog.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
    name = "checkin_records",
    uniqueConstraints = {@UniqueConstraint(name = "uk_user_date", columnNames = {"user_id", "checkin_date"})},
    indexes = {
      @Index(name = "idx_checkin_date", columnList = "checkin_date"),
      @Index(name = "idx_user_continuous", columnList = "user_id,continuous_days"),
      @Index(name = "idx_reward_type", columnList = "reward_type")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckinRecord {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "checkin_date", nullable = false)
  private LocalDate checkinDate;

  @Column(name = "checkin_time", nullable = false)
  private LocalDateTime checkinTime;

  @Column(name = "base_points")
  private Integer basePoints;

  @Column(name = "continuous_days")
  private Integer continuousDays;

  @Column(name = "extra_points")
  private Integer extraPoints;

  @Column(name = "total_points")
  private Integer totalPoints;

  @Column(name = "reward_type", length = 20)
  private String rewardType;

  @Column(name = "is_special_day")
  private Boolean specialDay;

  @Column(name = "special_day_type", length = 20)
  private String specialDayType;

  @Column(name = "is_makeup")
  private Boolean makeup;

  @Column(name = "makeup_card_used")
  private Integer makeupCardUsed;

  @Column(name = "checkin_method", length = 20)
  private String checkinMethod;

  @Column(name = "device_info", length = 500)
  private String deviceInfo;

  @Column(name = "ip_address", length = 45)
  private String ipAddress;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}

