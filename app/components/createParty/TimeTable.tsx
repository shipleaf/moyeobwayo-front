"use client";
import TimeBlock from "./TimeBlock";
import "react-datepicker/dist/react-datepicker.css";
import { Roboto } from "next/font/google";
// import { useState } from "react";
// import { countTimeSlots, getGradationNum } from "@/app/utils/timeslotUtils";
import { timeRange } from "@/app/meetlist/components/MeetDetail";
import { PartyDate } from "@/app/interfaces/Party";
import { Timeslot } from "@/app/api/getTableAPI";
// import { UserEntity } from "@/app/api/getTableAPI";

interface TimeTableProps {
  Dates: string[];
  startTime: string;
  endTime: string;
}

// Roboto 폰트 불러오기
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

// 30분 간격으로 Date 객체 배열을 생성하는 함수 (시작 시간과 끝나는 시간 사이)
// const generateTimeIntervalsForDay = (
//   baseDate: Date,
//   startHour: number,
//   endHour: number,
//   intervalMinutes: number
// ) => {
//   const start = new Date(baseDate); // 날짜에 맞춰서 시작 시간 지정
//   start.setHours(startHour, 0, 0, 0); // 시작 시간 설정
//   const end = new Date(baseDate);
//   end.setHours(endHour, 0, 0, 0); // 종료 시간 설정

//   const currentTime = new Date(start.getTime());
//   const times = [];

//   while (currentTime < end) {
//     times.push(new Date(currentTime)); // 현재 시간을 배열에 추가
//     currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes); // 30분씩 증가
//   }

//   return times;
// };

export const getGradationNum = (currentVal: number, maxNum: number): string => {
  if (maxNum === 0) {
    return "0";
  }
  const percent = (currentVal / maxNum) * 100;
  const rounded = Math.round(percent / 10) * 10;
  return rounded.toString();
};

// 1시간 단위로 시간을 반환하는 함수
const generateHourlyLabels = (startHour: number, endHour: number) => {
  const labels = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    labels.push(`${hour}:00`); // 1시간 간격으로 시간 추가
  }
  return labels;
};

// 요일을 반환하는 함수
const getWeekday = (date: Date) => {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return daysOfWeek[date.getDay()];
};
// const currentNum = 3;
function generateDummyData(): PartyDate[] {
  const currentDate = new Date(); // 현재 날짜
  const dummyData: PartyDate[] = [];

  // const users: UserEntity[] = [
  //   { userId: 1, userName: "제시카", password: null },
  //   { userId: 2, userName: "존", password: null },
  //   { userId: 3, userName: "사라", password: null },
  // ];

  for (let i = 0; i < 7; i++) {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + i); // 현재일 포함해서 7일 동안의 날짜

    const dateString = newDate.toISOString().split("T")[0]; // ISO 8601 형식의 날짜 문자열

    // 타임슬롯과 유저 패턴 설정
    let timeslots: Timeslot[] = [];

    // 날짜마다 패턴 다르게 설정
    if (i === 0) {
      // 월요일
      timeslots = [];
    }

    dummyData.push({
      date_id: i + 1,
      selected_date: `${dateString}T00:00:00+09:00`, // 날짜와 시간 (한국 시간 00:00)
      timeslots,
    });
  }

  return dummyData;
}

const timeblocks: PartyDate[] = generateDummyData();

// 파티 범위를 한국 시간에 맞춰서 설정
const partyRange: timeRange = {
  startTime: timeblocks[0].selected_date.replace(
    "T00:00:00+09:00",
    "T09:00:00+09:00"
  ), // 9시로 변경
  endTime: timeblocks[6].selected_date.replace(
    "T00:00:00+09:00",
    "T15:00:00+09:00"
  ), // 15시로 변경
};

// 한국 시간에서 시간 추출
const startHour = partyRange
  ? new Date(partyRange.startTime).getHours() // 한국 시간에서 9시 추출
  : 9;

const endHour = partyRange
  ? new Date(partyRange.endTime).getHours() // 한국 시간에서 15시 추출
  : 15;


export default function TimeTable({
  Dates,
  startTime,
  endTime,
}: TimeTableProps) {
  // const [countSlot, setCountSlot] = useState<number[][] | undefined>([]);

  const dates = Dates

  // useEffect(() => {
  //   if (partyRange) {
  //     // 날짜별로 timeslots에 대해 countTimeSlots 계산
  //     const newCountSlots = timeblocks?.map((day) =>
  //       countTimeSlots(day.timeslots, partyRange.startTime, partyRange.endTime)
  //     );
  //     setCountSlot(newCountSlots); // 2차원 배열로 상태 업데이트
  //   }
  // }, [timeblocks, partyRange]);

  const hourlyLabels = generateHourlyLabels(startHour, endHour);

  return (
    <div className="flex flex-col gap-[20px] basis-3/4">
      <div className="Head gap-[10px] h-[10%] flex flex-row w-full pr-[2%]">
        <div
          className={`${roboto.className} rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] text-[17px] backdrop-blur-[48px] w-[8%] h-full flex justify-center items-center font-[500]`}
        >
          Time
        </div>
        <div className="flex flex-grow gap-[10px]">
          {dates.map((date, index) => (
            <div
              key={index}
              className="flex-grow rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] h-full flex justify-center items-center gap-[10px]"
            >
              <span className={`${roboto.className} font-[500] text-[17px]`}>
                {getWeekday(date)}
              </span>
              <span className={`${roboto.className} font-[500] text-[35px]`}>
                {date.getDate()}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="Table flex gap-[10px] w-full h-[90%] rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] py-[3%] pr-[2%] overflow-auto">
        <div className="w-[8%]">
          {hourlyLabels.map((label, index) => (
            <div
              key={index}
              className={`${roboto.className} font-[500] text-[15px] text-center m-0 p-0 h-[12vh]`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex flex-grow gap-[10px]">
          {dummyData.map((day, dateIndex) => (
            <div key={dateIndex} className="flex-grow">
              {timeSlots.map((timeSlot, slotIndex) => {
                let votes = 0;

                if (selectedAvatar) {
                  // 선택된 아바타가 있을 경우 해당 userId의 데이터만 가져오기
                  const selectedUserSlot = day.timeslots.find(
                    (slot) => slot.userId === selectedAvatar.id
                  );
                  votes = selectedUserSlot
                    ? Number(selectedUserSlot.byteString[slotIndex])
                    : 0;
                } else {
                  // 선택된 아바타가 없을 경우 모든 유저의 합산 결과 표시
                  votes = day.timeslots.reduce(
                    (acc, timeslot) =>
                      acc + Number(timeslot.byteString[slotIndex]),
                    0
                  );
                }

                const colorLevel = getGradationNum(votes, maxVotes);

                return (
                  <TimeBlock
                    key={`${dateIndex}-${slotIndex}`}
                    time={`${getWeekday(dates[dateIndex])} ${dates[
                      dateIndex
                    ].getDate()} ${timeSlot}`}
                    className={
                      colorLevel === "0" ? "bg-white" : `bg-MO${colorLevel}`
                    }
                    style={{
                      height: "6vh",
                      marginBottom: slotIndex % 2 === 0 ? "0" : "4px",
                      borderRadius:
                        slotIndex % 2 === 0 ? "10px 10px 0 0" : "0 0 10px 10px",
                      borderBottom:
                        slotIndex === timeSlots.length - 1
                          ? "none"
                          : slotIndex % 2 === 0
                          ? "0.572px dashed #EBEBEB"
                          : "0.572px solid #EBEBEB",
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