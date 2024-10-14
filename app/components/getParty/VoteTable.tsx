import React, { useState, useEffect } from "react";
import { voteTime, voteData } from "@/app/api/timeslotAPI";
import { loadFromLocalStorage } from "@/app/recoil/recoilUtils";
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
  const selectedDates = party.dates.map(
    (dateObj) => new Date(dateObj.selected_date).toISOString().split("T")[0]
  );

  const startTime = 9;
  const endTime = 15;

  const [timeSlots, setTimeSlots] = useState<TimeSlot[][]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    dateIndex: number;
    timeIndex: number;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(true);

  const [userId, setUserId] = useState("");
  const userKey = useRecoilValue(userIdValue);

  useEffect(() => {
    // userId가 빈 문자열인 경우 localStorage에서 로그인 정보 불러오기
    if (userId === "") {
      const savedLoginInfo = loadFromLocalStorage("loginInfo");
      if (savedLoginInfo && savedLoginInfo.userId) {
        setUserId(savedLoginInfo.userId);
      }
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
        userEntity: {
          user_id: userKey,
        },
        date: {
          date_id: startSlot.dateId, // 선택된 date_id
        },
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
    <div className="vote-table">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            {selectedDates.map((date, index) => (
              <th key={index}>{date}</th>
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
