"use client";

import { useRecoilValue } from "recoil";
import "react-datepicker/dist/react-datepicker.css";
import { Roboto } from "next/font/google";
import TimeBlock from "./TimeBlock";
// import { PartyDate } from "@/app/api/getTableAPI";
import { selectedAvatarState, tableRefreshTrigger } from "@/app/recoil/atom";
import { useEffect, useState } from "react";
import { getTable } from "@/app/api/getTableAPI";
import { useParams } from "next/navigation";
// import { TableData } from "@/app/meeting/[hash]/page";
import { Party } from "@/app/api/getTableAPI";

// Roboto 폰트 불러오기
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

interface Table {
  party: Party;
  formattedDates: string[];
  startTime: string;
  endTime: string;
  dates: {
    dateId: number;
    convertedTimeslots: {
      userId: number;
      userName: string;
      byteString: string;
    }[];
  }[];
}

export const getGradationNum = (currentVal: number, maxNum: number): string => {
  if (maxNum === 0) {
    return "0";
  }
  const percent = (currentVal / maxNum) * 100;
  const rounded = Math.round(percent / 10) * 10;
  return rounded.toString();
};

// 시간 슬롯을 30분 간격으로 생성하는 함수

export default function TimeTable() {
  const { hash } = useParams();
  const [tableData, setTableData] = useState<Table | null>(null); // 테이블 데이터 상태 관리
  const selectedAvatar = useRecoilValue(selectedAvatarState);
  const maxVotes = 3;
  // eslint-
  const refreshValue = useRecoilValue(tableRefreshTrigger);

  useEffect(() => {
    if (hash && refreshValue >= 0) {
      const fetchTableData = async () => {
        try {
          const tableDataResponse = await getTable({
            table_id: hash as string,
          });
          const dates = tableDataResponse.party.dates.map((date) => {
            const localDate = new Date(date.selected_date);
            return localDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD 형식
          });

          const timeslots = tableDataResponse.party.dates.map((date) => ({
            dateId: date.dateId,
            convertedTimeslots: (date.convertedTimeslots || []).map((slot) => ({
              userId: slot.userId,
              userName: slot.userName,
              byteString: slot.byteString,
            })),
          }));

          const startTime = new Date(
            tableDataResponse.party.startDate
          ).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const endTime = new Date(
            tableDataResponse.party.endDate
          ).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });

          setTableData({
            party: tableDataResponse.party,
            formattedDates: dates,
            startTime: startTime,
            endTime: endTime,
            dates: timeslots,
          });
        } catch (error) {
          console.error("데이터 불러오기 실패: ", error);
        }
      };

      if (hash) fetchTableData();
    }
  }, [hash, refreshValue]);

  if (!tableData) {
    return <div>Loading...</div>;
  }

  const dates = tableData.formattedDates.map(
    (dateString) => new Date(dateString)
  );

  // 요일을 반환하는 함수
  const getWeekday = (date: Date) => {
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    return daysOfWeek[date.getDay()];
  };

  const generateTimeSlots = () => {
    const slots = [];
    const start = parseInt(tableData.startTime.split(":")[0], 10);
    const end = parseInt(tableData.endTime.split(":")[0], 10);
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const generateHourlyLabels = () => {
    const labels = [];
    const start = parseInt(tableData.startTime.split(":")[0], 10);
    const end = parseInt(tableData.endTime.split(":")[0], 10);
    for (let hour = start; hour <= end; hour++) {
      labels.push(`${hour}:00`);
    }
    return labels;
  };
  const hourlyLabels = generateHourlyLabels(); // 시간 라벨

  const timeSlots = generateTimeSlots(); // 30분 간격의 시간 슬롯 생성

  return (
    <div className="flex flex-col gap-[2%] h-full">
      <div className="Head gap-[10px] h-[10%] flex flex-row w-full pr-[2%]">
        <div
          className={`${roboto.className} rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] text-[17px] backdrop-blur-[48px] w-[8%] h-full flex justify-center items-center font-[500]`}
        >
          Time
        </div>
        <div className="flex flex-grow gap-[10px]">
          {dates ? (
            dates.map((date, index) => (
              <div
                key={index}
                className="flex-1 rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] h-full flex justify-center items-center gap-[10px]"
              >
                <span className={`${roboto.className} font-[500] text-[17px]`}>
                  {getWeekday(date)}
                </span>
                <span className={`${roboto.className} font-[500] text-[35px]`}>
                  {date.getDate()}
                </span>
              </div>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
      <div className="Table flex gap-[10px] w-full h-[90%] rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] pt-[3%] pr-[2%] overflow-auto">
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
          {tableData.dates.map((day, dateIndex: number) => (
            <div key={dateIndex} className="flex-grow">
              {timeSlots.map((timeSlot, slotIndex) => {
                let votes = 0;

                if (selectedAvatar) {
                  const selectedUserSlot = day.convertedTimeslots.find(
                    (slot) => slot.userId === selectedAvatar.id
                  );
                  votes = selectedUserSlot
                    ? Number(selectedUserSlot.byteString[slotIndex])
                    : 0;
                } else {
                  votes = day.convertedTimeslots.reduce(
                    (acc: number, timeslot) =>
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
