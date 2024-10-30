"use client";

import { useState, useEffect } from "react";
import TimeBlock from "./TimeBlock";

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

export default function UserTimeTable() {
  const [selectedTimes, setSelectedTimes] = useState<Date[]>([]); // 선택된 시간을 관리하는 상태
  const [isSelecting, setIsSelecting] = useState<boolean>(false); // 마우스 클릭 상태 관리
  const [startSelectTime, setStartSelectTime] = useState<Date | null>(null); // 드래그 시작 시간
  const [endSelectTime, setEndSelectTime] = useState<Date | null>(null); // 드래그 끝나는 시간

  // 마우스 업 이벤트를 문서 전체에서 감지하기 위한 useEffect
  useEffect(() => {
    const handleMouseUp = () => {
      if (isSelecting && startSelectTime && endSelectTime) {
        console.log(`Drag selected from ${startSelectTime} to ${endSelectTime}`);
      }
      setIsSelecting(false); // 마우스를 놓으면 선택 종료
      setStartSelectTime(null); // 시작 시간 초기화
      setEndSelectTime(null); // 끝나는 시간 초기화
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSelecting, startSelectTime, endSelectTime]);

  // 시작, 종료 시간 더미데이터
  const dateData = {
    startDate: "2024-09-19T09:00:00+09:00",
    endDate: "2024-09-21T16:00:00+09:00",
  };

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

  const toggleSelectedTime = (time: Date) => {
    setSelectedTimes((prevSelectedTimes) => {
      const timeInMillis = time.getTime(); // time을 밀리초 단위로 변환
      if (prevSelectedTimes.some((t) => t.getTime() === timeInMillis)) {
        return prevSelectedTimes.filter((t) => t.getTime() !== timeInMillis); // 선택 해제
      } else {
        return [...prevSelectedTimes, time]; // 선택 추가
      }
    });
  };

  return (
    <div style={{ display: "flex" }} className="w-[70%]">
      <div>
        <div style={{ display: "flex", gap: "20px" }}>
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              style={{ border: "1px solid gray", padding: "10px" }}
            >
              <h3>{formatDate(day)}</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                {/* 각 날짜에 대해 startHour ~ endHour까지의 15분 간격 타임 생성 */}
                {generateTimeIntervalsForDay(day, startHour, endHour, 15).map(
                  (time, index) => (
                    <TimeBlock
                      key={index}
                      time={time}
                      style={{
                        backgroundColor: selectedTimes.some(
                          (t) => t.getTime() === time.getTime()
                        )
                          ? "lightblue" // 선택된 시간은 하늘색으로 표시
                          : "white", // 기본 색은 흰색
                        cursor: "pointer", // 커서를 포인터로 설정하여 선택 가능 상태로 표시
                        pointerEvents: "auto", // 마우스 이벤트를 허용
                      }}
                      onMouseEnter={() => {
                        if (isSelecting) {
                          toggleSelectedTime(time); // 마우스가 블록을 지나갈 때 시간 선택/해제
                          setEndSelectTime(time); // 드래그가 진행될 때 끝나는 시간 업데이트
                        }
                      }}
                      onMouseDown={() => {
                        setIsSelecting(true); // 클릭 시작
                        toggleSelectedTime(time); // 클릭한 블록 즉시 선택/해제
                        setStartSelectTime(time); // 드래그 시작 시간 설정
                        setEndSelectTime(time); // 드래그 끝나는 시간도 처음에는 시작 시간과 같음
                      }}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 선택된 시간 표시 */}
      <div>
        <h3>Selected Times:</h3>
        <ul>
          {selectedTimes.map((time, index) => (
            <li key={index}>
              {time.toLocaleDateString()}{" "}
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}