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
}

export default function TimeTable({
  Dates,
  startTime,
  endTime,
}: TimeTableProps) {
  console.log(Dates, startTime, endTime)
  const validStartTime = startTime || "09:00"; // 기본값을 "09:00"으로 설정
  const validEndTime = endTime || "15:00"; // 기본값을 "15:00"으로 설정
  const startHour = parseInt(validStartTime.split(":")[0]); // 시작 시간을 숫자로 변환
  const endHour = parseInt(validEndTime.split(":")[0]); // 종료 시간을 숫자로 변환

  // 시간 라벨을 1시간 단위로 생성
  const hourlyLabels = generateHourlyLabels(startHour, endHour);

  const generateDefaultDates = () => {
    const today = new Date();
    const defaultDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      defaultDates.push(nextDate);
    }
    return defaultDates;
  };

  // Dates가 유효한 배열인지 확인하고, 그렇지 않으면 기본값(오늘부터 7일간) 설정
  const validDates =
    Array.isArray(Dates) && Dates.length > 0 ? Dates : generateDefaultDates();

    console.log(validDates)

  // Dates 배열로부터 Date 객체 배열 생성
  const days: Date[] = validDates.map((date) => new Date(date));

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
          {days.map((day, index) => (
            <div
              key={index}
              className="flex-grow rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] h-full flex justify-center items-center gap-[10px]"
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
      <div className="Table flex gap-[10px] w-full h-[90%] rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] py-[3%] pr-[2%]">
        {/* 시간축 Time 고정 영역 */}
        <div className="flex flex-col justify-between w-[8%]">
          {hourlyLabels.map((label, index) => (
            <span
              key={index}
              className={`${roboto.className} font-[500] text-[15px] text-center m-0 p-0`}
            >
              {label}
            </span>
          ))}
        </div>

        {/* 각 날짜의 TimeBlock을 같은 열에 배치 */}
        <div className="flex flex-grow gap-[10px]">
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="flex-grow flex flex-col gap-[5px] h-full"
            >
              {/* 각 날짜에 대한 TimeBlock 출력 */}
              {generateTimeIntervalsForDay(day, startHour, endHour, 30).map(
                (time, index) => (
                  <TimeBlock
                    key={index}
                    time={time}
                    style={{
                      backgroundColor: "white",
                      flexGrow: 1,
                      margin: 0,
                    }}
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
