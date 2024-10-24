import TimeBlock from "./TimeBlock";
import "react-datepicker/dist/react-datepicker.css";
import { Roboto } from "next/font/google";
import { useEffect, useState } from "react";
import { countTimeSlots } from "@/app/utils/timeslotUtils";
import { timeRange } from "@/app/meetlist/components/MeetDetail";
import { PartyDate, Timeslot } from "@/app/interfaces/Party";

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

interface TimeTableProps {
  Dates: string[];
  startTime: string;
  endTime: string;
  partyRange: timeRange | null
  timeblocks: PartyDate[] | null
  currentNum: number
}
function generateDummyData(): PartyDate[] {
  const currentDate = new Date(); // 현재 날짜
  const dummyData: PartyDate[] = [];

  for (let i = 0; i < 7; i++) {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + i); // 현재일 포함해서 7일 동안의 날짜

    const dateString = newDate.toISOString().split('T')[0]; // ISO 8601 형식의 날짜 문자열

    // 각 날짜에 2개의 타임 슬롯을 추가 (한국 시간 기준)
    const timeslots: Timeslot[] = [
      {
        slot_id: i * 2 + 1,
        selected_start_time: `${dateString}T09:00:00+09:00`, // 한국 시간 09:00
        selected_end_time: `${dateString}T11:00:00+09:00`,   // 한국 시간 11:00
      },
      {
        slot_id: i * 2 + 2,
        selected_start_time: `${dateString}T14:00:00+09:00`, // 한국 시간 14:00
        selected_end_time: `${dateString}T16:00:00+09:00`,   // 한국 시간 16:00
      },
    ];

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
  startTime: timeblocks[0].selected_date.replace("T00:00:00+09:00", "T09:00:00+09:00"), // 9시로 변경
  endTime: timeblocks[6].selected_date.replace("T00:00:00+09:00", "T15:00:00+09:00"),  // 15시로 변경
}

// 한국 시간에서 시간 추출
const startHour = partyRange
  ? new Date(partyRange.startTime).getHours()  // 한국 시간에서 9시 추출
  : 9;

const endHour = partyRange
  ? new Date(partyRange.endTime).getHours()  // 한국 시간에서 15시 추출
  : 15;

console.log('timeblocks', timeblocks);
console.log(startHour, endHour);

export default function TimeTable({}) {
  // 시간 라벨을 1시간 단위로 생성
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
  const hourlyLabels = generateHourlyLabels(startHour, endHour);
  return (
    <div className="flex flex-col gap-[20px] basis-3/4">
      {/* Head 영역은 Time과 요일 영역을 flex로 정렬 */}
      <div className="Head gap-[10px] h-[10%] flex flex-row w-full pr-[2%]">
        {/* Time 고정 영역 */}
        <div
          className={`${roboto.className} rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] text-[17px] backdrop-blur-[48px] w-[8%] h-full flex justify-center items-center font-[500]`}
        >
          Time
        </div>
        {/* 날짜와 요일을 flex-grow로 남은 공간 균등 분배 */}
        <div className="flex flex-grow gap-[10px]">
          {timeblocks?.map((day, index) => (
            <div
              key={index}
              className="flex-grow rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] h-full flex justify-center items-center gap-[10px]"
            >
              {/* 요일과 날짜 표시 */}
              <span className={`${roboto.className} font-[500] text-[17px]`}>
                {getWeekday(new Date(day.selected_date))}
              </span>
              <span className={`${roboto.className} font-[500] text-[35px]`}>
                {new Date(day.selected_date).getDate()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Table div 내부에 시간축(Time)과 날짜/TimeBlock을 flex 정렬 */}
      <div className="Table flex gap-[10px] w-full h-[90%] rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] py-[3%] pr-[2%] overflow-auto">
        {/* 시간축 Time 고정 영역 */}
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
    
        {/* 각 날짜의 TimeBlock을 같은 열에 배치 */}
        <div className="flex w-full gap-[10px]">
          {timeblocks?.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="w-full"
            >
              {/* 각 날짜에 대한 TimeBlock 출력 */}
              {generateTimeIntervalsForDay(new Date(day.selected_date), startHour, endHour, 30).map(
                (time, index, array) => {
                  return(
                    <TimeBlock
                      key={index}
                      time={time}
                      style={{
                        backgroundColor: "white",
                        height: "6vh",
                        marginBottom: 
                          index % 2 === 1
                          ? "4px"
                          : "0",
                        border: "0.572px solid #EBEBEB",
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
                    />

                  )
                  }
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
