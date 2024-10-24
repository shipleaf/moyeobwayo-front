"use client";

import TimeBlock from "./TimeBlock";
import "react-datepicker/dist/react-datepicker.css";
import { Roboto } from "next/font/google";
import { PartyDate } from "@/app/interfaces/Party";
import { timeslot } from "@/app/api/getTableAPI";
import { timeRange } from "./MeetDetail";
import { useEffect, useState } from "react";
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

  while (currentTime < end) {
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

export default function TimeTable({timeblocks, currentNum, partyRange}:
  {timeblocks:PartyDate[] | null, currentNum: number | null, partyRange:timeRange|null}) {
  // 더미 데이터를 가져와서 사용
  const now = new Date(TableData.startDate);
  const [countSlot, setCountSlot] = useState<number[][] | undefined>([])
  useEffect(() => {
    if (partyRange) {
      // 날짜별로 timeslots에 대해 countTimeSlots 계산
      const newCountSlots = timeblocks?.map((day) => 
        countTimeSlots(day.timeslots, partyRange.startTime, partyRange.endTime)
      );
      setCountSlot(newCountSlots); // 2차원 배열로 상태 업데이트
    }
  }, [timeblocks, partyRange]);
  const defaultEndDate = new Date(TableData.endDate); // 7일 뒤의 15:00
  defaultEndDate.setHours(15, 0, 0, 0);
  
  const startHour =  partyRange? new Date(partyRange.startTime).getHours() // 9시 (09:00)
      : 9
  const endHour =  partyRange? new Date(partyRange.endTime).getHours() // 15시 (15:00)
    : 15
  
  const days: Date[] = [];

  timeblocks?.map((timeblock)=>{
    days.push(new Date(timeblock.selected_date))
  })
  const getGradationNum: (currentVal: number, maxNum: number) => string = (currentVal, maxNum) => {
    if(maxNum === 0){
      return "0"
    }
    
    const percent = (currentVal / maxNum) * 100;
  
    // 일의 자리에서 반올림
    const rounded = Math.round(percent / 10) * 10;
    console.log(rounded)
    return rounded.toString(); // 숫자를 문자열로 변환
  };
  
  const countTimeSlots = (timeslots: timeslot[], startTime: string, endTime: string):number[] => {
    // 시간만 취하기 위해 Date 대신 시간을 직접 추출
    const start = new Date(startTime);
    const end = new Date(endTime);
  
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    const endHour = end.getHours();
    const endMinute = end.getMinutes();
    console.log(startTime)
    console.log('to debut', start, end)
    // 30분 간격으로 총 몇 개의 슬롯이 있는지 계산
    const totalSlots = Math.ceil(((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 30);
    // 슬롯 수만큼 0으로 초기화된 배열 생성
    const result = new Array(totalSlots).fill(0);
  
    for (const slot of timeslots) {
      const slotStart = new Date(slot.selected_start_time);
      const slotEnd = new Date(slot.selected_end_time);
  
      const slotStartHour = slotStart.getHours();
      const slotStartMinute = slotStart.getMinutes();
      const slotEndHour = slotEnd.getHours();
      const slotEndMinute = slotEnd.getMinutes();
  
      // 시간 차이를 기반으로 슬롯의 인덱스를 계산
      const startIndex = Math.max(0, Math.floor(((slotStartHour * 60 + slotStartMinute) - (startHour * 60 + startMinute)) / 30));
      const endIndex = Math.min(totalSlots - 1, Math.floor(((slotEndHour * 60 + slotEndMinute) - (startHour * 60 + startMinute)) / 30));
  
      // 각 슬롯에 포함되는 인덱스 범위의 값을 증가
      for (let i = startIndex; i <= endIndex; i++) {
        result[i]++;
      }
    }
  
    return result;
  };

  return (
    <div className="">
      {/* Head 영역은 Time과 요일 영역을 flex로 정렬 */}
      <div className="Head gap-[10px] h-[10%] flex w-full">
        {/* Time 고정 영역 */}
        <div
          className={`${roboto.className} w-[8%] h-full flex-shrink-0 flex justify-center items-center font-[500] text-[17px]`}
        >
          
        </div>
        {/* 날짜와 요일을 flex-grow로 남은 공간 균등 분배 */}
        <div className="flex flex-grow">
          {timeblocks?.map((day, index) => (
            <div
              key={index}
              className="flex-grow h-full w-[14.2%] flex-shrink-0 flex flex-col justify-center items-center gap-[0px]"
            >
              {/* 요일과 날짜 표시 */}
              <span className={`${roboto.className} font-[500] text-[15px] leading-3`}>
                {getWeekday(new Date(day.selected_date))}
              </span>
              <span className={`${roboto.className} font-[500] text-[35px] leading-11`}>
                {new Date(day.selected_date).getDate()}
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
            {startHour}:00
          </span>
          {/* 종료 시간을 표시 */}
          <span
            className={`${roboto.className} font-[500] text-[15px] text-center`}
          >
            {endHour}:00
          </span>
        </div>
        {/* 각 날짜의 TimeBlock을 같은 열에 배치 */}
        <div className="flex flex-grow">
        {timeblocks?.map((day, dayIndex) => {
          

          return (
            <div
            key={dayIndex}
            className="flex-grow flex flex-col h-full w-[14.2%] flex-shrink-0"
          >
            {/* 각 날짜에 대한 TimeBlock 출력 */}
            {generateTimeIntervalsForDay(new Date(day.selected_date), startHour, endHour, 30).map(
              (time, index, array) => {
                
                const colorLevel = getGradationNum(
                  countSlot && Array.isArray(countSlot[dayIndex]) && countSlot[dayIndex][index] !== undefined 
                    ? countSlot[dayIndex][index] 
                    : 0, // countSlot이 undefined이거나 값이 없으면 0을 기본값으로 설정
                  currentNum as number
                );
                return(
                  <TimeBlock
                    key={index}
                    time={time}
                    className={`bg-${colorLevel === "0" ? "white" : `MO${colorLevel}`}`}
                    style={{
                      
                      // backgroundColor: "white", // 기본 색은 흰색
                      flexGrow: 1, // 남은 공간을 유연하게 채우도록 설정
                      margin: 0,
                      border: "0.572px solid #EBEBEB",
                      height: "30px",
                      borderRadius: 
                        index === 0 ? "10px 10px 0 0" : // 첫 번째 요소
                        index === array.length - 1 ? "0 0 10px 10px" : "0", // 마지막 요소
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
              }
            )}
          </div>
        );
})}
        </div>
      </div>
    </div>
  );
}
