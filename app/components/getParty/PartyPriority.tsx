import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getPartyPriority } from "@/app/api/getTableAPI";
import { AvailableTimesResponse } from "@/app/api/getTableAPI";

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

export default function PartyPriority() {
  const { hash } = useParams();
  const [priorityData, setPriorityData] =
    useState<AvailableTimesResponse | null>(null);

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
  }, []);

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
