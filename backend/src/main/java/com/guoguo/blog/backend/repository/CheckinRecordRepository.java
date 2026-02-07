package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.CheckinRecord;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CheckinRecordRepository extends JpaRepository<CheckinRecord, Long> {
  Optional<CheckinRecord> findByUser_IdAndCheckinDate(Long userId, LocalDate checkinDate);

  @Query(
      "select r from CheckinRecord r where r.user.id = :userId and r.checkinDate >= :start and r.checkinDate <= :end order by r.checkinDate asc")
  List<CheckinRecord> findMonthRecords(
      @Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);
}

