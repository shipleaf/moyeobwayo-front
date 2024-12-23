"use client";

import TimeBlock from "./TimeBlock";
import "react-datepicker/dist/react-datepicker.css";
import { Roboto } from "next/font/google";
import { getGradationNum } from "@/app/utils/timeslotUtils";

// Roboto 폰트 불러오기
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

interface PartyDate {
  dateId: number;
  selected_date: string;
  timeslots?: null;
  convertedTimeslots: {
    userId: number;
    userName: string;
    byteString: string;
  }[];
}

// 요일을 반환하는 함수
const getWeekday = (date: Date) => {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return daysOfWeek[date.getDay()];
};

export default function TimeTable({
  startDate,
  endDate,
  dates,
  currentNum,
}: {
  startDate: string | null;
  endDate: string | null;
  dates: PartyDate[];
  currentNum: number | null;
}) {
  const dateObjects = dates?.map((date) => new Date(date.selected_date));
  const AfterCurrnetNum = currentNum !== null ? currentNum : 0;
  const startHour = startDate ? new Date(startDate).getHours().toString() : "";
  const endHour = endDate
    ? new Date(endDate).getHours() === 0
      ? "24"
      : new Date(endDate).getHours().toString()
    : "";

  const timeslots = dates?.map((date) => ({
    dateId: date.dateId,
    convertedTimeslots: (date.convertedTimeslots || []).map((slot) => ({
      userId: slot.userId,
      userName: slot.userName,
      byteString: slot.byteString,
    })),
  }));

  const generateTimeSlots = () => {
    const slots = [];
    const start = parseInt(startHour, 10);
    const end = parseInt(endHour, 10);
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const generateHourlySlots = () => {
    const slots = [];
    const start = parseInt(startHour, 10);
    const end = parseInt(endHour, 10);
    for (let hour = start; hour <= end; hour++) {
      // 종료 시간 포함
      slots.push(`${hour}:00`); // 1시간 단위로 생성
    }
    return slots;
  };

  const hourlySlots = generateHourlySlots();
  const timeSlots = generateTimeSlots(); // 30분 간격의 시간 슬롯 생성

  return (
    <div className="flex flex-col gap-[10px] justify-start items-start">
      {/* Head */}
      <div className="flex gap-[10px] h-[10%]">
        {/* 빈 열 */}
        <div
          className={`flex items-center font-[500] min-w-[70px] flex-shrink-0`}
        ></div>

        {/* 날짜 행 */}
        <div className="flex w-full gap-[10px]">
          {dateObjects?.map((day, index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-[70px]"
            >
              <span
                className={`${roboto.className} font-[500] text-[15px] leading-3`}
              >
                {getWeekday(new Date(day))}
              </span>
              <span
                className={`${roboto.className} font-[500] text-[35px] leading-11`}
              >
                {new Date(day).getDate()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex gap-[10px] w-full">
        {/* 시간 열 */}
        <div className="flex flex-col items-center min-w-[70px]">
          {hourlySlots.map((hourlySlot, index) => (
            <span
              key={index}
              className="font-[500] text-sm h-[60px]"
              
            >
              {hourlySlot}
            </span>
          ))}
        </div>

        {/* TimeBlock */}
        <div className="flex gap-[10px] w-full">
          {timeslots?.map((day, dayIndex, dayArray) => (
            <div key={dayIndex} className={`flex flex-col min-w-[70px]
            
            `}
              style={{
                marginRight:
                  dayIndex === dayArray.length - 1 ?  
                  "16px" : "0px"
              }}
            >
              {timeSlots.map((timeSlot, slotIndex) => {
                const dateTime = new Date(dateObjects[dayIndex]);
                const [hour, minute] = timeSlot.split(":").map(Number);
                dateTime.setHours(hour, minute);

                const votes = day.convertedTimeslots.reduce(
                  (acc, slot) =>
                    acc +
                    (slot.byteString[slotIndex]
                      ? parseInt(slot.byteString[slotIndex], 10)
                      : 0),
                  0
                );

                const colorLevel = getGradationNum(votes, AfterCurrnetNum);
                // const lastIndex = slotIndex === timeSlotArray.length;
                return (
                  <TimeBlock
                    key={slotIndex}
                    time={dateTime}
                    className={
                      colorLevel === "0" ? "bg-white" : `bg-MO${colorLevel}`
                    }
                    style={{
                      height: "30px",
                      margin: 0,
                      border: "0.572px solid #EBEBEB",
                      borderRadius:
                        slotIndex === 0
                          ? "10px 10px 0 0"
                          : slotIndex === timeSlots.length - 1
                          ? "0 0 10px 10px"
                          : "0",
                      borderBottom:
                        slotIndex === timeSlots.length - 1
                          ? "none"
                          : slotIndex % 2 === 0
                          ? "0.572px dashed #EBEBEB"
                          : "0.572px solid #EBEBEB",
                      maxWidth: "100px",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
