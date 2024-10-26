"use client";

import React, { useState } from "react";
import { userIdValue } from "@/app/recoil/atom";
import { useRecoilValue } from "recoil";
import { useParams } from "next/navigation";
import { voteData } from "@/app/api/timeslotAPI";

// 1시간 간격으로 시간 표시, 마지막 시간 포함
const generateDisplaySlots = (startHour: number, endHour: number): string[] => {
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return slots;
};

// 15분 간격으로 시간 슬롯 생성
const generateTimeSlots = (startHour: number, endHour: number): string[] => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
      );
    }
  }
  return slots;
};

// 한국 시간으로 서버에 전달할 시간 포맷 생성
const formatToServerTime = (date: Date) => {
  const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000); // 한국 시간대 적용 (GMT+09:00)
  const year = koreanTime.getFullYear();
  const month = (koreanTime.getMonth() + 1).toString().padStart(2, "0");
  const day = koreanTime.getDate().toString().padStart(2, "0");
  const hours = koreanTime.getHours().toString().padStart(2, "0");
  const minutes = koreanTime.getMinutes().toString().padStart(2, "0");
  const seconds = koreanTime.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

// 요일과 날짜를 개별적으로 포맷팅
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const weekday = date
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const day = date.getDate();
  return { weekday, day };
};

type TimeSelectorProps = {
  party: {
    partyId: string;
    targetNum: number;
    currentNum: number;
    partyName: string;
    partyDescription: string;
    startDate: string;
    locationName: string | null;
    endDate: string;
    decisionDate: string;
    userId: string;
    alarms: Array<any>;
    dates: Array<{
      dateId: number;
      selected_date: string;
      timeslots: Array<any>;
    }>;
  };
};

export default function TimeSelector({ party }: TimeSelectorProps) {
  const { dates, startDate, endDate } = party;
  const userId = useRecoilValue(userIdValue);
  const { hash: partyId } = useParams();

  const startHour = new Date(startDate).getHours();
  const endHour = new Date(endDate).getHours();
  const timeSlots = generateTimeSlots(startHour, endHour);
  const displaySlots = generateDisplaySlots(startHour, endHour);

  const [selectedSlots, setSelectedSlots] = useState<boolean[]>(
    Array(timeSlots.length * dates.length).fill(false)
  );

  const [isSelecting, setIsSelecting] = useState(false);
  const [isDeselecting, setIsDeselecting] = useState(false); // 드래그 취소 플래그 추가
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [endIndex, setEndIndex] = useState<number | null>(null);

  // 드래그 시작 및 종료를 기반으로 voteData 형식의 데이터 생성
  const generateDragVoteData = (): voteData | null => {
    if (startIndex === null || endIndex === null) return null;

    const [finalStartIndex, finalEndIndex] = [
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex),
    ];

    const dateIndex = Math.floor(finalStartIndex / timeSlots.length);
    const timeSlotStart = finalStartIndex % timeSlots.length;
    const timeSlotEnd = finalEndIndex % timeSlots.length;
    const dateId = dates[dateIndex].dateId;

    const startHourAdjusted = Math.floor(timeSlotStart / 4) + startHour;
    const startMinute = (timeSlotStart % 4) * 15;
    const endHourAdjusted = Math.floor(timeSlotEnd / 4) + startHour;
    const endMinute = (timeSlotEnd % 4) * 15;

    const selectedStartTime = new Date(
      new Date(dates[dateIndex].selected_date).setHours(
        startHourAdjusted,
        startMinute,
        0
      )
    );
    const selectedEndTime = new Date(
      new Date(dates[dateIndex].selected_date).setHours(
        endHourAdjusted,
        endMinute + 15,
        0
      )
    );

    return {
      selected_start_time: formatToServerTime(selectedStartTime),
      selected_end_time: formatToServerTime(selectedEndTime),
      user_id: parseInt(userId),
      date_id: dateId,
    };
  };

  // 마우스 드래그 시작
  const handleMouseDown = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    setIsSelecting(true);
    setIsDeselecting(selectedSlots[index]); // 선택 상태에 따라 플래그 설정
    setStartIndex(index);
    setEndIndex(index);
  };

  // 마우스 이동 중
  const handleMouseOver = (index: number) => {
    if (!isSelecting) return;
    setEndIndex(index);

    const newSelectedSlots = [...selectedSlots];
    const rangeStart = Math.min(startIndex!, index);
    const rangeEnd = Math.max(startIndex!, index);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      newSelectedSlots[i] = !isDeselecting; // 선택/해제에 따라 변경
    }
    setSelectedSlots(newSelectedSlots);
  };

  // 마우스 드래그 종료
  const handleMouseUp = () => {
    setIsSelecting(false);

    const voteData = generateDragVoteData();
    if (voteData) {
      console.log("Selected time range (drag):", voteData);
    }
    setStartIndex(null);
    setEndIndex(null);
  };

  const handleCellClick = (index: number) => {
    const newSelectedSlots = [...selectedSlots];
    newSelectedSlots[index] = !newSelectedSlots[index];
    setSelectedSlots(newSelectedSlots);

    const dateIndex = Math.floor(index / timeSlots.length);
    const timeSlotIndex = index % timeSlots.length;
    const dateId = dates[dateIndex].dateId;

    const hour = Math.floor(timeSlotIndex / 4) + startHour;
    const minute = (timeSlotIndex % 4) * 15;
    const selectedStartTime = new Date(
      new Date(dates[dateIndex].selected_date).setHours(hour, minute, 0)
    );
    const selectedEndTime = new Date(
      selectedStartTime.getTime() + 15 * 60 * 1000 // 15분 후
    );

    const voteData: voteData = {
      selected_start_time: formatToServerTime(selectedStartTime),
      selected_end_time: formatToServerTime(selectedEndTime),
      user_id: parseInt(userId),
      date_id: dateId,
    };

    console.log("Selected time range (click):", voteData);
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      style={{ userSelect: "none" }}
      className="w-[90%] mr-[5%] bg-[#fff] rounded-[10px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] pt-[5%]"
    >
      <div
        className="grid items-start justify-center"
        style={{
          gridTemplateColumns: `40px repeat(${dates.length}, 50px)`,
          gap: "0",
        }}
      >
        <div></div>
        {dates.map((date, index) => {
          const { weekday, day } = formatDate(date.selected_date);
          return (
            <div key={index} className="text-center border-b border-gray-300">
              <div className="text-xs font-semibold">{weekday}</div>
              <div className="text-lg font-bold">{day}</div>
            </div>
          );
        })}

        {/* 시간과 슬롯 표시 */}
        {displaySlots.map((displayTime, displayIndex) => (
          <React.Fragment key={`display-${displayIndex}`}>
            <div className="flex flex-col items-start text-right pr-2 row-span-4 border-gray-300 text-[10px] relative top-[-5px]">
              {displayTime}
            </div>
            {timeSlots
              .slice(displayIndex * 4, displayIndex * 4 + 4)
              .map((_, innerIndex) => {
                const cellIndex = displayIndex * 4 + innerIndex;
                return dates.map((date, dateIndex) => {
                  const fullCellIndex =
                    cellIndex + dateIndex * timeSlots.length;
                  return (
                    <div
                      key={fullCellIndex}
                      data-dateid={date.dateId}
                      className={`block w-[50px] h-[10px] cursor-pointer ${
                        selectedSlots[fullCellIndex]
                          ? "bg-[#A1A1FF]"
                          : "bg-white"
                      } ${
                        innerIndex % 2 === 1 ? "border-b border-dotted" : ""
                      } border-l border-r border-gray-300`}
                      onMouseDown={(e) => handleMouseDown(fullCellIndex, e)}
                      onMouseOver={() => handleMouseOver(fullCellIndex)}
                      onClick={() => handleCellClick(fullCellIndex)}
                    />
                  );
                });
              })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
