"use client";

import React, { useState } from "react";

// 더미 데이터 정의
const dummyPartyData = {
  partyId: "0058381a-381e-4ead-8a79-4e1542ca088d",
  targetNum: 2,
  currentNum: 0,
  partyName: "123",
  partyDescription: "123",
  startDate: "2024-10-27T09:00:00.000+09:00",
  locationName: null,
  endDate: "2024-10-29T15:00:00.000+09:00",
  decisionDate: "2024-10-26T16:56:59.263+09:00",
  userId: "김선엽",
  alarms: [],
  dates: [
    {
      dateId: 46,
      selected_date: "2024-10-27T00:00:00.000+09:00",
      timeslots: [],
    },
    {
      dateId: 47,
      selected_date: "2024-10-28T00:00:00.000+09:00",
      timeslots: [
        {
          slotId: 3,
          selectedStartTime: "2024-10-27T11:00:00.000+09:00",
          selectedEndTime: "2024-10-27T13:00:00.000+09:00",
          userEntity: {
            userId: 17,
            userName: "김선엽",
            password: null,
          },
        },
      ],
    },
    {
      dateId: 48,
      selected_date: "2024-10-29T00:00:00.000+09:00",
      timeslots: [],
    },
    {
      dateId: 49,
      selected_date: "2024-10-30T00:00:00.000+09:00",
      timeslots: [],
    },
    {
      dateId: 50,
      selected_date: "2024-10-31T00:00:00.000+09:00",
      timeslots: [],
    },
  ],
};

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

// 요일과 날짜를 개별적으로 포맷팅
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const weekday = date
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase(); // "MON"
  const day = date.getDate(); // 23
  return { weekday, day };
};

export default function TimeSelector() {
  const { dates, startDate, endDate } = dummyPartyData;

  // 시작, 종료 시간 추출
  const startHour = new Date(startDate).getHours();
  const endHour = new Date(endDate).getHours();
  const timeSlots = generateTimeSlots(startHour, endHour);
  const displaySlots = generateDisplaySlots(startHour, endHour); // 마지막 시간까지 포함

  const [selectedSlots, setSelectedSlots] = useState<boolean[]>(
    Array(timeSlots.length * dates.length).fill(false)
  );

  const [isSelecting, setIsSelecting] = useState(false);
  const [isDeselecting, setIsDeselecting] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null);

  // 마우스 드래그 시작
  const handleMouseDown = (index: number, event: React.MouseEvent) => {
    event.preventDefault(); // 기본 드래그 동작 방지
    setIsSelecting(true);
    setStartIndex(index);
    setIsDeselecting(selectedSlots[index]);
  };

  // 마우스 이동 중
  const handleMouseOver = (index: number) => {
    if (!isSelecting || startIndex === null) return;
    const newSelectedSlots = [...selectedSlots];
    for (
      let i = Math.min(startIndex, index);
      i <= Math.max(startIndex, index);
      i++
    ) {
      newSelectedSlots[i] = !isDeselecting;
    }
    setSelectedSlots(newSelectedSlots);
  };

  // 마우스 드래그 종료
  const handleMouseUp = () => {
    setIsSelecting(false);
    setStartIndex(null);

    // 드래그한 시간대 출력
    const selectedTimeRanges = selectedSlots
      .map((selected, index) => (selected ? index : null))
      .filter((index) => index !== null)
      .map((index) => {
        const hour = Math.floor(index / 4) + startHour;
        const minute = (index % 4) * 15;
        return `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
      });

    console.log("Selected time range:", selectedTimeRanges);
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      style={{ userSelect: "none" }} // 텍스트 선택 방지
      className="w-[90%] mr-[5%]"
    >
      <div
        className="grid items-start justify-center"
        style={{
          gridTemplateColumns: `40px repeat(${dummyPartyData.dates.length}, 50px)`,
          gap: "0",
        }}
      >
        {/* 날짜 표시 */}
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
            {/* 1시간 간격 시간 표시 */}
            <div className="flex flex-col items-start text-right pr-2 row-span-4 border-gray-300 text-[10px] relative top-[-5px]">
              {displayTime}
            </div>
            {timeSlots
              .slice(displayIndex * 4, displayIndex * 4 + 4)
              .map((_, innerIndex) => {
                const cellIndex = displayIndex * 4 + innerIndex;
                return dates.map((_, dateIndex) => {
                  const fullCellIndex =
                    cellIndex + dateIndex * timeSlots.length;
                  return (
                    <div
                      key={fullCellIndex}
                      className={`block w-[50px] h-[10px] cursor-pointer ${
                        selectedSlots[fullCellIndex]
                          ? "bg-[#A1A1FF]"
                          : "bg-white"
                      } ${
                        innerIndex % 2 === 1 ? "border-b border-dotted" : ""
                      } border-l border-r border-gray-300`}
                      onMouseDown={(e) => handleMouseDown(fullCellIndex, e)}
                      onMouseOver={() => handleMouseOver(fullCellIndex)}
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
