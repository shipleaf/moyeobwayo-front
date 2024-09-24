"use client";

import { useState } from "react";
import TimeBlock from "./TimeBlock";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// 날짜를 문자열로 변환하는 헬퍼 함수 (yyyy-MM-dd 형식)
const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

// 15분 간격으로 Date 객체 배열을 생성하는 함수 (시작 시간과 끝나는 시간 사이)
const generateTimeIntervalsForDay = (
  baseDate: Date,
  startHour: number,
  endHour: number,
  intervalMinutes: number
) => {
  const start = new Date(baseDate); // 날짜에 맞춰서 시작 시간 지정
  start.setHours(startHour, 0, 0, 0); // 시작 시간 설정
  const end = new Date(baseDate);
  end.setHours(endHour, 0, 0, 0); // 종료 시간 설정

  const currentTime = new Date(start.getTime());
  const times = [];

  while (currentTime <= end) {
    times.push(new Date(currentTime)); // 현재 시간을 배열에 추가
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes); // 15분씩 증가
  }

  return times;
};

export default function TimeTable() {
  const [hoveredTime, setHoveredTime] = useState<Date | null>(null); // Hover 상태 관리
  const [hoveredUsername, setHoveredUsername] = useState<string | null>(null); // Hover된 유저 이름 상태 관리

  // 현재 날짜부터 5일 동안의 기본값 설정
  const now = new Date();
  const defaultStartDate = new Date(now.setHours(9, 0, 0, 0)); // 현재 날짜의 09:00
  const defaultEndDate = new Date(now.setDate(now.getDate() + 4)); // 5일 뒤의 16:00
  defaultEndDate.setHours(16, 0, 0, 0);

  const [dateData, setDateData] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  const startDate = new Date(dateData.startDate);
  const endDate = new Date(dateData.endDate);

  // 시작 시간과 종료 시간을 startDate와 endDate에서 추출
  const startHour = startDate.getHours(); // 9시 (09:00)
  const endHour = endDate.getHours(); // 16시 (16:00)

  // 시작 날짜부터 종료 날짜까지 날짜 생성
  const startDay = new Date(startDate.toISOString().split("T")[0]); // 날짜만 추출 (시간은 제외)
  const endDay = new Date(endDate.toISOString().split("T")[0]); // 날짜만 추출 (시간은 제외)

  const days = [];

  while (startDay <= endDay) {
    days.push(new Date(startDay));
    startDay.setDate(startDay.getDate() + 1); // 하루씩 증가
  }

  const handleDateChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    if (start && end) {
      setDateData({ startDate: start, endDate: end });
    }
  };

  return (
    <div style={{ display: "flex", gap: "40px", flexDirection: "column" }}>
      {/* 달력 버튼 추가 */}
      <div>
        <label>날짜 선택:</label>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />
      </div>

      {/* 타임 테이블 섹션 */}
      <div>
        <div style={{ display: "flex", gap: "20px" }}>
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              style={{ border: "1px solid gray", padding: "10px" }}
            >
              <h3>{formatDate(day)}</h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                {/* 각 날짜에 대해 startHour ~ endHour까지의 15분 간격 타임 생성 */}
                {generateTimeIntervalsForDay(day, startHour, endHour, 15).map(
                  (time, index) => (
                    <TimeBlock
                      key={index}
                      time={time}
                      style={{
                        backgroundColor: "white", // 기본 색은 흰색
                      }}
                      onMouseEnter={() => {
                        setHoveredTime(time);
                      }}
                      onMouseLeave={() => {
                        setHoveredTime(null); // Hover 해제 시 상태 초기화
                      }}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover된 시간 표시 */}
      <div style={{ marginTop: "20px", fontSize: "16px", fontWeight: "bold" }}>
        {hoveredTime
          ? `선택된 시간: ${hoveredTime.toLocaleDateString()} ${hoveredTime.toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}`
          : ""}
      </div>
    </div>
  );
}
