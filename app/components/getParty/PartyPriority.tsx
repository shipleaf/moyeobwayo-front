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
    <>
      <span className="w-full ml-[5%] mb-[5%] font-pretendard text-[23px] font-[500] text-[#aaa]">
        일정보기
      </span>
      <div className="w-full overflow-y-auto max-h-[40%] flex flex-col items-center mb-[10%] rounded-[10px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px]">
        {priorityData ? (
          priorityData.availableTime.length > 0 ? (
            priorityData.availableTime.map((timeSlot, index) => (
              <div
                key={index}
                className="priorList rounded-[5px] drop-shadow-[6px] shadow-prior backdrop-blur-48px w-[90%] mb-[3%] h-[40%] box-border p-[10px]"
              >
                <div className="flex flex-row justify-between">
                  <p className="font-pretendard text-[15px] font-[500]">
                    {formatDateTime(timeSlot.start)} ~{" "}
                    {formatDateTime(timeSlot.end, false)}{" "}
                  </p>
                  <button className="border-1 rounded-[50px] w-[18%] text-[13px] font-pretendard bg-[#6161CE] text-white">확정</button>
                </div>
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
    </>
  );
}
