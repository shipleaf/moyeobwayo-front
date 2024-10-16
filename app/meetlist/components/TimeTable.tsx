"use client";

import { useState } from "react";
import TimeBlock from "./TimeBlock";
import "react-datepicker/dist/react-datepicker.css";
import { Roboto } from "next/font/google";

// Roboto 폰트 불러오기
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

// 30분 간격으로 Date 객체 배열을 생성하는 함수 (시작 시간과 끝나는 시간 사이)
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
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes); // 30분씩 증가
  }

  return times;
};

// 더미 데이터로 사용할 TableData 변수
const TableData = {
  startDate: "2023-10-01", // 시작 날짜
  endDate: "2023-10-06", // 종료 날짜
  startTime: "09:00", // 시작 시간
  endTime: "23:00", // 종료 시간
};

// 요일을 반환하는 함수
const getWeekday = (date: Date) => {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return daysOfWeek[date.getDay()];
};

export default function TimeTable() {
  // 더미 데이터를 가져와서 사용
  const now = new Date(TableData.startDate);
  const defaultStartDate = new Date(now.setHours(9, 0, 0, 0)); // 기본 시작 시간은 09:00
  const defaultEndDate = new Date(TableData.endDate); // 7일 뒤의 15:00
  defaultEndDate.setHours(15, 0, 0, 0);

  const [dateData,] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  const startDate = new Date(dateData.startDate);
  const endDate = new Date(dateData.endDate);

  // 시작 시간과 종료 시간을 startDate와 endDate에서 추출
  const startHour = parseInt(TableData.startTime.split(":")[0]); // 9시 (09:00)
  const endHour = parseInt(TableData.endTime.split(":")[0]); // 15시 (15:00)

  // 시작 날짜부터 종료 날짜까지 날짜 생성
  const startDay = new Date(startDate.toISOString().split("T")[0]); // 날짜만 추출 (시간은 제외)
  const endDay = new Date(endDate.toISOString().split("T")[0]); // 날짜만 추출 (시간은 제외)

  const days: Date[] = [];

  while (startDay <= endDay) {
    days.push(new Date(startDay));
    startDay.setDate(startDay.getDate() + 1); // 하루씩 증가
  }

  return (
    <div className="">
      {/* Head 영역은 Time과 요일 영역을 flex로 정렬 */}
      <div className="Head gap-[10px] h-[10%] flex w-full">
        {/* Time 고정 영역 */}
        <div
          className={`${roboto.className} w-[8%] h-full flex-shrink-0 flex justify-center items-center font-[500]`}
        >
          
        </div>
        {/* 날짜와 요일을 flex-grow로 남은 공간 균등 분배 */}
        <div className="flex flex-grow">
          {days.map((day, index) => (
            <div
              key={index}
              className="flex-grow h-full w-[14.2%] flex-shrink-0 flex justify-center items-center gap-[10px]"
            >
              {/* 요일과 날짜 표시 */}
              <span className={`${roboto.className} font-[500] text-[17px]`}>
                {getWeekday(day)}
              </span>
              <span className={`${roboto.className} font-[500] text-[35px]`}>
                {day.getDate()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Table div 내부에 시간축(Time)과 날짜/TimeBlock을 flex 정렬 */}
      <div className="Table flex gap-[10px] w-full h-full">
        {/* 시간축 Time 고정 영역 */}
        <div className="flex flex-col justify-between w-[8%] flex-shrink-0">
          <span
            className={`${roboto.className} font-[500] text-[15px] text-center`}
          >
            {TableData.startTime}
          </span>
          {/* 종료 시간을 표시 */}
          <span
            className={`${roboto.className} font-[500] text-[15px] text-center`}
          >
            {TableData.endTime}
          </span>
        </div>
        {/* 각 날짜의 TimeBlock을 같은 열에 배치 */}
        <div className="flex flex-grow">
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="flex-grow flex flex-col h-full w-[14.2%] flex-shrink-0"
            >
              {/* 각 날짜에 대한 TimeBlock 출력 */}
              {generateTimeIntervalsForDay(day, startHour, endHour, 30).map(
                (time, index, array) => (
                  <TimeBlock
                    key={index}
                    time={time}
                    style={{
                      backgroundColor: "white", // 기본 색은 흰색
                      flexGrow: 1, // 남은 공간을 유연하게 채우도록 설정
                      margin: 0,
                      border: "0.572px solid #EBEBEB",
                      height: "30px",
                      borderRadius: 
                        index === 0 ? "10px 10px 0 0" :         // 첫 번째 요소
                        index === array.length - 1 ? "0 0 10px 10px" : "0",  // 마지막 요소
                        borderBottom:
                        index === array.length - 1 
                          ? "none" // 마지막 요소는 경계선 없음
                          : index % 2 === 0 
                          ? "0.572px dashed #EBEBEB" // 짝수 index에서는 대시선
                          : "0.572px solid #EBEBEB" // 홀수 index에서는 실선
                    }}
                    onMouseEnter={() => {}}
                    onMouseDown={() => {}}
                    onMouseUp={() => {}}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
