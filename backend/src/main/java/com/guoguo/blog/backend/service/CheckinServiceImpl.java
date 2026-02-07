package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.CheckinCalendarDTO;
import com.guoguo.blog.backend.dto.CheckinRequest;
import com.guoguo.blog.backend.dto.CheckinResultDTO;
import com.guoguo.blog.backend.dto.CheckinStatusDTO;
import com.guoguo.blog.backend.entity.CheckinRecord;
import com.guoguo.blog.backend.entity.User;
import com.guoguo.blog.backend.entity.UserCheckinStats;
import com.guoguo.blog.backend.exception.BusinessException;
import com.guoguo.blog.backend.repository.CheckinRecordRepository;
import com.guoguo.blog.backend.repository.UserCheckinStatsRepository;
import com.guoguo.blog.backend.repository.UserRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class CheckinServiceImpl implements CheckinService {
  private static final ZoneId ZONE_ID = ZoneId.of("Asia/Shanghai");
  private static final int BASE_POINTS = 10;

  private final CheckinRecordRepository checkinRecordRepository;
  private final UserCheckinStatsRepository userCheckinStatsRepository;
  private final UserRepository userRepository;

  @Override
  public CheckinResultDTO checkin(Long userId, CheckinRequest request, String ipAddress) {
    User user =
        userRepository.findById(userId).orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

    LocalDate today = LocalDate.now(ZONE_ID);
    if (checkinRecordRepository.findByUser_IdAndCheckinDate(userId, today).isPresent()) {
      throw new BusinessException("CHECKIN_ALREADY_DONE", "今日已签到");
    }

    UserCheckinStats stats =
        userCheckinStatsRepository
            .findByUser_Id(userId)
            .orElseGet(
                () ->
                    userCheckinStatsRepository.save(
                        UserCheckinStats.builder()
                            .user(user)
                            .totalCheckinDays(0)
                            .totalPointsEarned(0)
                            .currentStreak(0)
                            .longestStreak(0)
                            .currentMonthDays(0)
                            .currentMonthPoints(0)
                            .makeupCardsAvailable(0)
                            .makeupCardsUsedTotal(0)
                            .milestone7Days(0)
                            .milestone30Days(0)
                            .build()));

    int continuousDays = resolveContinuousDays(stats, today);
    Reward reward = calculateReward(continuousDays, today);

    LocalDateTime now = LocalDateTime.now(ZONE_ID);
    CheckinRecord record =
        CheckinRecord.builder()
            .user(user)
            .checkinDate(today)
            .checkinTime(now)
            .basePoints(reward.basePoints)
            .continuousDays(continuousDays)
            .extraPoints(reward.extraPoints)
            .totalPoints(reward.totalPoints)
            .rewardType(reward.rewardType)
            .specialDay(reward.specialDay)
            .specialDayType(reward.specialDayType)
            .makeup(false)
            .makeupCardUsed(0)
            .checkinMethod(StringUtils.hasText(request.getMethod()) ? request.getMethod() : "WEB")
            .deviceInfo(StringUtils.hasText(request.getDeviceInfo()) ? request.getDeviceInfo() : null)
            .ipAddress(ipAddress)
            .build();
    checkinRecordRepository.save(record);

    applyStats(stats, today, now, continuousDays, reward);
    userCheckinStatsRepository.save(stats);

    CheckinStatusDTO status = buildStatus(stats, true);
    return CheckinResultDTO.builder()
        .checkinDate(today)
        .basePoints(reward.basePoints)
        .extraPoints(reward.extraPoints)
        .totalPoints(reward.totalPoints)
        .rewardType(reward.rewardType)
        .continuousDays(continuousDays)
        .makeupCardsAvailable(nvl(stats.getMakeupCardsAvailable()))
        .status(status)
        .build();
  }

  @Override
  @Transactional(readOnly = true)
  public CheckinStatusDTO status(Long userId) {
    LocalDate today = LocalDate.now(ZONE_ID);
    boolean todayChecked = checkinRecordRepository.findByUser_IdAndCheckinDate(userId, today).isPresent();
    UserCheckinStats stats = userCheckinStatsRepository.findByUser_Id(userId).orElse(null);
    if (stats == null) {
      return CheckinStatusDTO.builder()
          .todayChecked(todayChecked)
          .currentStreak(0)
          .longestStreak(0)
          .totalCheckinDays(0)
          .totalPointsEarned(0)
          .currentMonthDays(0)
          .currentMonthPoints(0)
          .makeupCardsAvailable(0)
          .lastCheckinDate(null)
          .build();
    }
    return buildStatus(stats, todayChecked);
  }

  @Override
  @Transactional(readOnly = true)
  public CheckinCalendarDTO calendar(Long userId, String yearMonth) {
    YearMonth ym = parseYearMonth(yearMonth);
    LocalDate start = ym.atDay(1);
    LocalDate end = ym.atEndOfMonth();
    List<CheckinRecord> records = checkinRecordRepository.findMonthRecords(userId, start, end);
    List<Integer> days = records.stream().map(r -> r.getCheckinDate().getDayOfMonth()).collect(Collectors.toList());

    int monthPoints = records.stream().map(CheckinRecord::getTotalPoints).filter(Objects::nonNull).mapToInt(Integer::intValue).sum();

    UserCheckinStats stats = userCheckinStatsRepository.findByUser_Id(userId).orElse(null);
    return CheckinCalendarDTO.builder()
        .year(ym.getYear())
        .month(ym.getMonthValue())
        .checkinDays(days)
        .monthDays(days.size())
        .monthPoints(monthPoints)
        .currentStreak(stats == null ? 0 : nvl(stats.getCurrentStreak()))
        .build();
  }

  private int resolveContinuousDays(UserCheckinStats stats, LocalDate today) {
    LocalDate last = stats.getLastCheckinDate();
    if (last == null) return 1;
    if (last.isEqual(today)) {
      throw new BusinessException("CHECKIN_ALREADY_DONE", "今日已签到");
    }
    if (last.plusDays(1).isEqual(today)) {
      return nvl(stats.getCurrentStreak()) + 1;
    }
    return 1;
  }

  private void applyStats(UserCheckinStats stats, LocalDate today, LocalDateTime now, int continuousDays, Reward reward) {
    LocalDate previousLastCheckinDate = stats.getLastCheckinDate();
    stats.setLastCheckinDate(today);
    stats.setLastCheckinTime(now);
    stats.setCurrentStreak(continuousDays);
    stats.setLongestStreak(Math.max(nvl(stats.getLongestStreak()), continuousDays));
    stats.setTotalCheckinDays(nvl(stats.getTotalCheckinDays()) + 1);
    stats.setTotalPointsEarned(nvl(stats.getTotalPointsEarned()) + reward.totalPoints);

    YearMonth currentYm = YearMonth.from(today);
    YearMonth lastYm = previousLastCheckinDate == null ? null : YearMonth.from(previousLastCheckinDate);
    if (lastYm == null || !lastYm.equals(currentYm)) {
      stats.setCurrentMonthDays(0);
      stats.setCurrentMonthPoints(0);
    }
    stats.setCurrentMonthDays(nvl(stats.getCurrentMonthDays()) + 1);
    stats.setCurrentMonthPoints(nvl(stats.getCurrentMonthPoints()) + reward.totalPoints);

    if (continuousDays == 7) {
      stats.setMilestone7Days(nvl(stats.getMilestone7Days()) + 1);
    }
    if (continuousDays == 30) {
      stats.setMilestone30Days(nvl(stats.getMilestone30Days()) + 1);
    }
  }

  private Reward calculateReward(int continuousDays, LocalDate today) {
    int base = BASE_POINTS;
    int extra = 0;
    String rewardType = "NORMAL";

    if (continuousDays == 3) {
      extra += 5;
      rewardType = "CONTINUOUS";
    } else if (continuousDays == 7) {
      extra += 20;
      rewardType = "MILESTONE";
    } else if (continuousDays == 30) {
      extra += 100;
      rewardType = "MILESTONE";
    }

    return new Reward(base, extra, base + extra, rewardType, false, null);
  }

  private CheckinStatusDTO buildStatus(UserCheckinStats stats, boolean todayChecked) {
    return CheckinStatusDTO.builder()
        .todayChecked(todayChecked)
        .currentStreak(nvl(stats.getCurrentStreak()))
        .longestStreak(nvl(stats.getLongestStreak()))
        .totalCheckinDays(nvl(stats.getTotalCheckinDays()))
        .totalPointsEarned(nvl(stats.getTotalPointsEarned()))
        .currentMonthDays(nvl(stats.getCurrentMonthDays()))
        .currentMonthPoints(nvl(stats.getCurrentMonthPoints()))
        .makeupCardsAvailable(nvl(stats.getMakeupCardsAvailable()))
        .lastCheckinDate(stats.getLastCheckinDate())
        .build();
  }

  private static int nvl(Integer v) {
    return v == null ? 0 : v;
  }

  private static YearMonth parseYearMonth(String yearMonth) {
    if (!StringUtils.hasText(yearMonth)) {
      return YearMonth.now(ZONE_ID);
    }
    try {
      return YearMonth.parse(yearMonth);
    } catch (Exception ex) {
      throw new BusinessException("CHECKIN_INVALID_YEAR_MONTH", "yearMonth格式应为YYYY-MM");
    }
  }

  private record Reward(int basePoints, int extraPoints, int totalPoints, String rewardType, boolean specialDay, String specialDayType) {}
}
