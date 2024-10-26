"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
// import { getPartyPriority } from "@/app/api/getTableAPI"; // 서버 통신 주석처리
// import { AvailableTimesResponse } from "@/app/api/getTableAPI";

// 날짜 포맷 함수
const formatDateTime = (dateTime: string, includeDate: boolean = true) => {
  const date = new Date(dateTime);
  return date.toLocaleString("ko-KR", {
    month: includeDate ? "long" : undefined, // 날짜 중복 방지
    day: includeDate ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 더미 데이터
const dummyData = {
  availableTimes: [
    {
      start: "2024-10-04T12:00:00",
      end: "2024-10-04T14:00:00",
      users: ["user1", "user2", "user3", "user4"],
    },
    {
      start: "2024-10-01T14:00:00",
      end: "2024-10-01T15:00:00",
      users: ["user1", "user3", "user4"],
    },
    {
      start: "2024-10-04T14:00:00",
      end: "2024-10-04T15:00:00",
      users: ["user1", "user3", "user4"],
    },
    {
      start: "2024-10-01T13:00:00",
      end: "2024-10-01T14:00:00",
      users: ["user3", "user4"],
    },
    {
      start: "2024-10-03T14:00:00",
      end: "2024-10-03T15:00:00",
      users: ["user1", "user4"],
    },
    {
      start: "2024-10-04T11:00:00",
      end: "2024-10-04T12:00:00",
      users: ["user3", "user4"],
    },
    {
      start: "2024-10-01T12:00:00",
      end: "2024-10-01T13:00:00",
      users: ["user4"],
    },
    {
      start: "2024-10-01T15:00:00",
      end: "2024-10-01T19:00:00",
      users: ["user3"],
    },
    {
      start: "2024-10-02T10:00:00",
      end: "2024-10-02T12:00:00",
      users: ["user3"],
    },
    {
      start: "2024-10-02T17:00:00",
      end: "2024-10-02T20:00:00",
      users: ["user4"],
    },
    {
      start: "2024-10-03T12:00:00",
      end: "2024-10-03T14:00:00",
      users: ["user1"],
    },
    {
      start: "2024-10-03T15:00:00",
      end: "2024-10-03T17:00:00",
      users: ["user4"],
    },
    {
      start: "2024-10-04T10:00:00",
      end: "2024-10-04T11:00:00",
      users: ["user4"],
    },
    {
      start: "2024-10-04T15:00:00",
      end: "2024-10-04T17:00:00",
      users: ["user3"],
    },
    {
      start: "2024-10-04T17:00:00",
      end: "2024-10-04T20:00:00",
      users: ["user2"],
    },
  ],
};

export default function PartyPriority() {
  const { hash } = useParams();
  const [priorityData, setPriorityData] = useState(dummyData); // 더미데이터로 초기화

  // 서버 통신 부분 주석 처리
  /*
  useEffect(() => {
    if (hash) {
      getPartyPriority({ table_id: hash as string })
        .then((data) => {
          setPriorityData(data);
        })
        .catch((error) => {
          console.error("에러 발생: ", error);
        });
    }
  }, [hash]);
  */

  return (
    <div className="w-full overflow-y-auto max-h-[40%] flex flex-col items-center mb-[10%]">
      {priorityData ? (
        priorityData.availableTimes.length > 0 ? (
          priorityData.availableTimes.map((timeSlot, index) => (
            <div
              key={index}
              className="priorList rounded-[5px] drop-shadow-[6px] shadow-prior backdrop-blur-48px w-[90%] mb-[3%] h-[40%] box-border p-[10px]"
            >
              <p className="font-pretendard">
                {formatDateTime(timeSlot.start)} ~{" "}
                {formatDateTime(timeSlot.end, false)}{" "}
                {/* 두 번째 시간은 날짜 제외 */}
              </p>
              <div className="flex overflow-hidden flex-wrap">
                {timeSlot.users.map((user, idx) => (
                  <div
                    key={idx}
                    className="username text-[#8E8E8E] border-1 rounded-[10px] px-[8px] py-[4px] m-[2px] max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    <p>{user}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>아직 투표한 사람이 없어요.</p>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
