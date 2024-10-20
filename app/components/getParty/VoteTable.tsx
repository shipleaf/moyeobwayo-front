"use client";

import React, { useState, useEffect } from "react";
import { voteTime, voteData } from "@/app/api/timeslotAPI";
import { userIdValue } from "@/app/recoil/atom";
import { useRecoilValue } from "recoil";

interface TimeSlot {
  date: string;
  time: string;
  selected: boolean;
  dateId: number;
}

interface VoteTableProps {
  party: {
    dates: {
      date_id: number;
      selected_date: string;
      timeslots: any[];
    }[];
    start_date: string;
    endDate: string;
  };
  availableTimes: any[];
}

export default function VoteTable({ party, availableTimes }: VoteTableProps) {
  const selectedDates = party.dates.map((dateObj) => {
    const utcDate = new Date(dateObj.selected_date);
    const weekday = utcDate.toLocaleDateString("en-US", {
      weekday: "short", // Sun, Mon, ...
      timeZone: "Asia/Seoul",
    });
    const day = utcDate.toLocaleDateString("en-US", {
      day: "numeric", // 17, 18, ...
      timeZone: "Asia/Seoul",
    });
    return { weekday, day }; // 요일과 날짜를 객체로 반환
  });

  const startTime = 9;
  const endTime = 15;

  const [timeSlots, setTimeSlots] = useState<TimeSlot[][]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    dateIndex: number;
    timeIndex: number;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(true);
  const [loading, setLoading] = useState(true);
  const userId = useRecoilValue(userIdValue);

  useEffect(() => {
    if (userId) {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    generateTimeSlots();
  }, [party]);

  const generateTimeSlots = () => {
    const newTimeSlots: TimeSlot[][] = party.dates.map((dateObj) => {
      const slots: TimeSlot[] = [];
      for (let time = startTime; time <= endTime; time++) {
        slots.push({
          date: new Date(dateObj.selected_date).toISOString().split("T")[0],
          time: `${time}:00`,
          selected: false,
          dateId: dateObj.date_id,
        });
      }
      return slots;
    });

    // availableTimes 데이터를 바탕으로 시간 슬롯 업데이트
    availableTimes.forEach((availableTime) => {
      const { start, end } = availableTime;
      const startDate = new Date(start).toISOString().split("T")[0];
      const endDate = new Date(end).toISOString().split("T")[0];
      const startHour = new Date(start).getHours();
      const endHour = new Date(end).getHours();

      newTimeSlots.forEach((daySlots, dateIndex) => {
        if (daySlots[0].date === startDate || daySlots[0].date === endDate) {
          daySlots.forEach((slot, timeIndex) => {
            const slotHour = parseInt(slot.time.split(":")[0]);
            if (slotHour >= startHour && slotHour <= endHour) {
              newTimeSlots[dateIndex][timeIndex].selected = true;
            }
          });
        }
      });
    });

    setTimeSlots(newTimeSlots);
  };

  const handleMouseDown = (dateIndex: number, timeIndex: number) => {
    const isSlotSelected = timeSlots[dateIndex][timeIndex].selected;
    setIsDragging(true);
    setDragStart({ dateIndex, timeIndex });
    setIsSelecting(!isSlotSelected);
    toggleTimeSlot(dateIndex, timeIndex);
  };

  const handleMouseOver = (dateIndex: number, timeIndex: number) => {
    if (isDragging) {
      toggleTimeSlot(dateIndex, timeIndex);
    }
  };

  const handleMouseUp = async (dateIndex: number, timeIndex: number) => {
    setIsDragging(false);

    if (dragStart) {
      const startSlot = timeSlots[dragStart.dateIndex][dragStart.timeIndex];
      const endSlot = timeSlots[dateIndex][timeIndex];

      // voteTime API 호출을 위한 데이터 생성
      const voteRequest: voteData = {
        selected_start_time: new Date(`${startSlot.date}T${startSlot.time}`),
        selected_end_time: new Date(`${endSlot.date}T${endSlot.time}`),
        user_id: userId,
        date_id: startSlot.dateId,
      };

      try {
        const response = await voteTime(voteRequest); // API 호출
        console.log("API 응답:", response); // 응답 결과 콘솔 출력
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
      }
    }
    setDragStart(null);
  };

  const toggleTimeSlot = (dateIndex: number, timeIndex: number) => {
    setTimeSlots((prev) => {
      const newSlots = [...prev];
      newSlots[dateIndex][timeIndex].selected = isSelecting ? true : false;
      return newSlots;
    });
  };

  return (
    <div className="vote-table bg-[#f7f7f7] h-[50%] rounded-[10px] shadow-prior backdrop-blur-48px flex items-start justify-start p-[5%]">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            {selectedDates.map(({ weekday, day }, index) => (
              <th key={index}>
                <div style={{ textAlign: "center" }}>
                  <div className="font-pretendard font-[400] m-0">
                    {weekday}
                  </div>
                  <div className="font-pretendard m-0">{day}</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots[0]?.map((_, timeIndex) => (
            <tr key={timeIndex}>
              <td>{startTime + timeIndex}:00</td>
              {selectedDates.map((_, dateIndex) => (
                <td
                  key={dateIndex}
                  className={`time-slot ${
                    timeSlots[dateIndex][timeIndex].selected ? "selected" : ""
                  }`}
                  onMouseDown={() => handleMouseDown(dateIndex, timeIndex)}
                  onMouseOver={() => handleMouseOver(dateIndex, timeIndex)}
                  onMouseUp={() => handleMouseUp(dateIndex, timeIndex)}
                  style={{
                    backgroundColor: timeSlots[dateIndex][timeIndex].selected
                      ? "#FFD700"
                      : "white",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .selected {
          background-color: #ffd700;
        }
        td {
          width: 50px;
          height: 30px;
        }
      `}</style>
    </div>
  );
}
