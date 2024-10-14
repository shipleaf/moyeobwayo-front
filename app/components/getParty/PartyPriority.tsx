import React, { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { getPartyPriority } from "@/app/api/getTableAPI";
import { AvailableTimesResponse } from "@/app/api/getTableAPI";

export default function PartyPriority() {
  // const { hash } = useParams();
  const [priorityData, setPriorityData] = useState<AvailableTimesResponse | null>(null);

  useEffect(() => {
    // 더미 데이터 설정
    const dummyData: AvailableTimesResponse = {
      availableTimes: [
        {
          start: "2024-10-15T09:00",
          end: "2024-10-15T11:00",
          users: ["김선엽", "한시현"]
        },
        {
          start: "2024-10-15T13:00",
          end: "2024-10-15T15:00",
          users: ["유재석", "박명수"]
        }
      ]
    };
    
    // 서버 호출 대신 더미 데이터를 사용
    setPriorityData(dummyData);

    // 실제 서버 호출 부분은 주석 처리
    // if (hash) {
    //   getPartyPriority({ table_id: hash as string })
    //     .then((data) => {
    //       setPriorityData(data);
    //     })
    //     .catch((error) => {
    //       console.error("에러 발생: ", error);
    //     });
    // }
  }, []);

  return (
    <div>
      {priorityData ? (
        priorityData.availableTimes.length > 0 ? (
          priorityData.availableTimes.map((timeSlot, index) => (
            <div key={index} className="priorList">
              <p>
                {timeSlot.start} ~ {timeSlot.end}
              </p>
              <p>Users: {timeSlot.users.join(", ")}</p>
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
