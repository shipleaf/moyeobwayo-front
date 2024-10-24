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
      
    </div>
  );
}
