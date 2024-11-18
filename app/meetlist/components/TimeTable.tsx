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
}: {
  startDate: string | null;
  endDate: string | null;
  dates: PartyDate[];
}) {
  const dateObjects = dates?.map((date) => new Date(date.selected_date));

  const startHour = startDate ? new Date(startDate).getHours().toString() : "";
  const endHour = endDate
    ? (new Date(endDate).getHours() === 0 ? "24" : new Date(endDate).getHours().toString())
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

  const timeSlots = generateTimeSlots(); // 30분 간격의 시간 슬롯 생성

  return (
    <div className="">
      <div className="Head gap-[10px] h-[10%] w-full grid grid-cols-[8%_1fr]">
        {/* 시간 열 */}
        <div
          className={`${roboto.className} flex justify-center items-center font-[500] text-[17px]`}
        ></div>

        {/* 날짜 열 */}
        <div className="grid grid-cols-7 gap-1">
          {dateObjects?.map((day, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center"
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

      <div className="Table w-full h-full grid grid-cols-[8%_1fr] gap-[10px]">
        <div className="flex flex-col justify-between items-center">
          <span className="font-[500] text-[15px]">{startHour}:00</span>
          <span className="font-[500] text-[15px]">{endHour}:00</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {timeslots?.map((day, dayIndex) => (
            <div key={dayIndex} className="flex flex-col">
              {timeSlots.map((timeSlot, slotIndex) => {
                const dateTime = new Date(dateObjects[dayIndex]);
                const [hour, minute] = timeSlot.split(":").map(Number);
                dateTime.setHours(hour, minute);

                // 투표 수 계산
                const votes = day.convertedTimeslots.reduce(
                  (acc, slot) =>
                    acc +
                    (slot.byteString[slotIndex]
                      ? parseInt(slot.byteString[slotIndex], 10)
                      : 0),
                  0
                );

                // 색상 등급 계산
                const colorLevel = getGradationNum(votes, 3); // 예: maxVotes = 3

                return (
                  <TimeBlock
                    key={slotIndex}
                    time={dateTime} // Date 객체 전달
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
