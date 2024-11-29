"use client";

import React, { useState, useEffect } from "react";
import { userIdValue } from "@/app/recoil/atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { voteData, voteTime, getMyVote } from "@/app/api/timeslotAPI";
import { useParams } from "next/navigation";
import { tableRefreshTrigger } from "@/app/recoil/atom";

const generateDisplaySlots = (startHour: number, endHour: number): string[] => {
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return slots;
};

const generateTimeSlots = (startHour: number, endHour: number): string[] => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      slots.push(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
      );
    }
  }
  return slots;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const weekday = date
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const day = date.getDate();
  return { weekday, day };
};

const initializeBinaryTable = (
  dates: Array<{ dateId: number }>,
  slotsLength: number
): { [key: number]: string } => {
  const binaryTable: { [key: number]: string } = {};
  dates.forEach((date) => {
    binaryTable[date.dateId] = "0".repeat(slotsLength);
  });
  return binaryTable;
};

type TimeSelectorProps = {
  isMobile: boolean;
  party: {
    partyId: string;
    targetNum: number;
    currentNum: number;
    partyName: string;
    partyDescription: string;
    startDate: string;
    locationName: string | null;
    endDate: string;
    decisionDate: boolean;
    userId: string;
    alarms: boolean[];
    dates: {
      dateId: number;
      selected_date: string;
      convertedTimeslots: {
        userId: number;
        userName: string;
        byteString: string;
      }[];
    }[];
  };
};

export default function TimeSelector({ party, isMobile }: TimeSelectorProps) {
  const { hash } = useParams();
  const { dates, startDate, endDate } = party;
  const userId = useRecoilValue(userIdValue);
  const setRefreshTrigger = useSetRecoilState(tableRefreshTrigger);

  const startHour = new Date(startDate).getHours();
  const prevEndHour = new Date(endDate).getHours();
  const endHour = prevEndHour === 0 ? 24 : prevEndHour;
  const timeSlots = generateTimeSlots(startHour, endHour);
  const displaySlots = generateDisplaySlots(startHour, endHour);

  const [binaryTable, setBinaryTable] = useState(
    initializeBinaryTable(dates, timeSlots.length)
  );
  const [selectedSlots, setSelectedSlots] = useState<boolean[]>(
    Array(timeSlots.length * dates.length).fill(false)
  );

  const [isSelecting, setIsSelecting] = useState(false);
  const [isDeselecting, setIsDeselecting] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [lastDraggedDateId, setLastDraggedDateId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchMyVoteData = async () => {
      try {
        const data = { userId: userId as number, partyId: hash as string };
        const response = await getMyVote(data);

        const updatedSlots = [...selectedSlots];
        const updatedTable = { ...binaryTable };

        response.dates.forEach(
          (vote: { dateId: number; binaryString: string }) => {
            const { dateId, binaryString } = vote;
            updatedTable[dateId] = binaryString;

            const dateIndex = dates.findIndex((date) => date.dateId === dateId);
            if (dateIndex !== -1) {
              for (let i = 0; i < binaryString.length; i++) {
                const slotIndex = dateIndex * timeSlots.length + i;
                updatedSlots[slotIndex] = binaryString[i] === "1";
              }
            }
          }
        );

        setBinaryTable(updatedTable);
        setSelectedSlots(updatedSlots);
      } catch (error) {
        console.error("Error fetching vote data:", error);
      }
    };

    fetchMyVoteData();
  }, [userId, hash, dates, timeSlots.length]);

  const updateBinaryTable = (
    dateId: number,
    slotIndex: number,
    value: "0" | "1"
  ) => {
    setBinaryTable((prevTable) => {
      const currentBinaryString = prevTable[dateId];
      const updatedBinaryString =
        currentBinaryString.substring(0, slotIndex) +
        value +
        currentBinaryString.substring(slotIndex + 1);

      setLastDraggedDateId(dateId);
      return {
        ...prevTable,
        [dateId]: updatedBinaryString,
      };
    });
  };

  const handleMouseDown = (index: number) => {
    setIsSelecting(true);
    setIsDeselecting(selectedSlots[index]);
    setStartIndex(index);
  };

  const handleMouseOver = (index: number) => {
    if (!isSelecting) return;

    const dateIndex = Math.floor(index / timeSlots.length);
    const dateId = dates[dateIndex].dateId;
    const slotIndex = index % timeSlots.length;

    updateBinaryTable(dateId, slotIndex, !isDeselecting ? "1" : "0");
    setSelectedSlots((prev) => {
      const newSelectedSlots = [...prev];
      newSelectedSlots[index] = !isDeselecting;
      return newSelectedSlots;
    });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setStartIndex(null);

    if (lastDraggedDateId !== null) {
      const updatedData: voteData = {
        binaryString: binaryTable[lastDraggedDateId],
        userId: userId as number,
        dateId: lastDraggedDateId,
      };
      console.log(123);
      voteTime(updatedData)
      .then(() => {
        setRefreshTrigger((prev) => prev + 1);
        setLastDraggedDateId(null); // 클릭 후 lastDraggedDateId 초기화
      })
        .catch((error) => console.error("Error posting vote data:", error));
    }
  };

  const handleCellClick = (index: number) => {
    const dateIndex = Math.floor(index / timeSlots.length);
    const dateId = dates[dateIndex].dateId;
    const slotIndex = index % timeSlots.length;

    updateBinaryTable(dateId, slotIndex, selectedSlots[index] ? "0" : "1");
    setSelectedSlots((prev) => {
      const newSelectedSlots = [...prev];
      newSelectedSlots[index] = !newSelectedSlots[index];
      return newSelectedSlots;
    });

    const updatedData: voteData = {
      binaryString: binaryTable[dateId],
      userId: userId as number,
      dateId,
    };
    console.log(1234);
    voteTime(updatedData)
      .then(() => {
        setRefreshTrigger((prev) => prev + 1);
        setLastDraggedDateId(null); // 클릭 후 lastDraggedDateId 초기화
      })

      .catch((error) => console.error("Error posting vote data:", error));
  };

  if (isMobile) {
    return (
      <div
        onMouseUp={handleMouseUp}
        style={{ userSelect: "none" }}
        className="w-[90%] mr-[5%] flex justify-start items-start bg-[#fff] rounded-[10px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] overflow-auto"
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
              <div
                key={index}
                className="text-center border-b border-gray-300"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundColor: "#fff",
                  marginBottom: "5px",
                }}
              >
                <div className="text-xs font-semibold">{weekday}</div>
                <div className="text-lg font-bold">{day}</div>
              </div>
            );
          })}

          {displaySlots.map((displayTime, displayIndex) => (
            <React.Fragment key={`display-${displayIndex}`}>
              <div
                className="flex flex-col text-center row-span-2 border-gray-300 text-[10px]"
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 8,
                  backgroundColor: "#fff",
                  transform: "translateY(-7px)",
                }}
              >
                {displayTime}
              </div>
              {timeSlots
                .slice(displayIndex * 2, displayIndex * 2 + 2)
                .map((_, innerIndex) => {
                  const cellIndex = displayIndex * 2 + innerIndex;
                  return dates.map((date, dateIndex) => {
                    const fullCellIndex =
                      cellIndex + dateIndex * timeSlots.length;
                    return (
                      <div
                        key={`${date.dateId}-${fullCellIndex}`}
                        data-dateid={date.dateId}
                        className={`block w-[50px] h-[20px] cursor-pointer ${
                          selectedSlots[fullCellIndex]
                            ? "bg-[#A1A1FF]"
                            : "bg-white"
                        } border-l border-r border-b border-b-dashed border-gray-300`}
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

  return (
    <div
      onMouseUp={handleMouseUp}
      style={{ userSelect: "none" }}
      className="w-[90%] mr-[5%] flex justify-start items-start bg-[#fff] rounded-[10px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] overflow-auto"
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
            <div
              key={index}
              className="text-center border-b border-gray-300"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "#fff",
                marginBottom: "5px",
              }}
            >
              <div className="text-xs font-semibold">{weekday}</div>
              <div className="text-lg font-bold">{day}</div>
            </div>
          );
        })}

        {displaySlots.map((displayTime, displayIndex) => (
          <React.Fragment key={`display-${displayIndex}`}>
            <div
              className="flex flex-col text-center row-span-2 border-gray-300 text-[10px]"
              style={{
                position: "sticky",
                left: 0,
                zIndex: 8,
                backgroundColor: "#fff",
                transform: "translateY(-7px)",
              }}
            >
              {displayTime}
            </div>
            {timeSlots
              .slice(displayIndex * 2, displayIndex * 2 + 2)
              .map((_, innerIndex) => {
                const cellIndex = displayIndex * 2 + innerIndex;
                return dates.map((date, dateIndex) => {
                  const fullCellIndex =
                    cellIndex + dateIndex * timeSlots.length;
                  return (
                    <div
                      key={`${date.dateId}-${fullCellIndex}`}
                      data-dateid={date.dateId}
                      className={`block w-[50px] h-[20px] cursor-pointer ${
                        selectedSlots[fullCellIndex]
                          ? "bg-[#A1A1FF]"
                          : "bg-white"
                      } border-l border-r border-b border-b-dashed border-gray-300`}
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
