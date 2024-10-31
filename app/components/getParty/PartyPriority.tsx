import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // useRouter 추가
import { getTable } from "@/app/api/getTableAPI";
import {
  GetTableResponse,
  AvailableTimesResponse,
} from "@/app/api/getTableAPI";
import { completeTime } from "@/app/api/partyCompleteAPI";
import { useRecoilValue } from "recoil";
import { userIdValue } from "@/app/recoil/atom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdOutlineContentCopy } from "react-icons/md";
import { CheckFat } from "@phosphor-icons/react";

// 날짜 포맷 함수
const formatDateTime = (dateTime: string, includeDate: boolean = true) => {
  const date = new Date(dateTime);
  return date.toLocaleString("ko-KR", {
    month: includeDate ? "long" : undefined,
    day: includeDate ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface TimeSlot {
  start: string; // 시작 시간, string 형식
  end: string; // 종료 시간, string 형식
  locationName?: string; // 장소 이름 (optional)
  dateId: number; // 날짜 ID
  users: string[]; // 참여자 이름 리스트
}

// AvailableTimesResponse를 TimeSlot으로 변환하는 함수
const convertAvailableTimeToTimeSlot = (
  availableTime: AvailableTimesResponse,
  dateId: number,
  locationName?: string
): TimeSlot => {
  return {
    start: availableTime.start,
    end: availableTime.end,
    locationName: locationName || "Default Location",
    dateId,
    users: availableTime.users,
  };
};

export default function PartyPriority() {
  const { hash } = useParams();
  const router = useRouter(); // router 객체 생성
  const [priorityData, setPriorityData] = useState<GetTableResponse | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const userId = useRecoilValue(userIdValue);

  useEffect(() => {
    if (hash) {
      getTable({ table_id: hash as string })
        .then((data) => {
          setPriorityData(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("에러 발생: ", error);
        });
    }
  }, [hash]);

  // 확정하기 버튼 클릭 이벤트 핸들러
  const handleComplete = async (timeSlot: TimeSlot) => {
    if (!hash) return;

    const completeData = {
      userId: userId as number,
      completeTime: new Date(timeSlot.start),
      endTime: new Date(timeSlot.end),
      locationName: timeSlot.locationName || "Default Location",
      dateId: timeSlot.dateId,
    };

    try {
      const response = await completeTime(hash as string, completeData);
      console.log(response);
      if (response.status === 200) {
        const title = priorityData?.party.partyName || "모임";
        const subtitle = priorityData?.party.partyDescription || "모임 설명";
        const formattedMessage = `모임명: ${title}\n설명: ${subtitle}\n날짜: ${formatDateTime(
          timeSlot.start
        )} ~ ${formatDateTime(timeSlot.end, false)}\n장소: ${
          completeData.locationName
        }\n\n모여서 즐거운 시간을 보내세요!\n자세한 내용은 모여봐요에서 확인해 보세요!\n\n링크: https://moyeobwayo.com/meeting/${hash}`;
        setMessage(formattedMessage);
        setShowModal(true);
      } else {
        alert("시간 확정에 실패했습니다.");
      }
    } catch (error) {
      console.error("확정 요청 에러: ", error);
      alert("확정하는 중 오류가 발생했습니다.");
    }
  };

  // 모달 닫기 및 페이지 이동
  const closeModalAndNavigate = () => {
    setShowModal(false);
    router.refresh();
  };

  return (
    <>
      <div
        className="py-[13px] px-[15px] w-full overflow-y-auto max-h-[40%] 
      flex flex-col gap-2 items-center mb-[10%] rounded-[10px]  "
      >
        {priorityData ? (
          Array.isArray(priorityData.availableTime) &&
          priorityData.availableTime.length > 0 ? (
            priorityData.availableTime.map((availableTime, index) => {
              const timeSlot = convertAvailableTimeToTimeSlot(
                availableTime,
                index + 1, // dateId를 인덱스 값으로 설정
                priorityData.party.locationName
              );
              return (
                <div
                  key={index}
                  className=" priorList px-2 rounded-[5px] drop-shadow-[6px] shadow-prior backdrop-blur-48px w-[100%] mb-[3%] box-border p-[10px]
                  flex flex-col gap-2"
                >
                  <div className="flex flex-row justify-between">
                    <p className="font-pretendard text-[15px] font-[500]">
                      {formatDateTime(timeSlot.start)} ~{" "}
                      {formatDateTime(timeSlot.end, false)}
                    </p>
                    <button
                      onClick={() => handleComplete(timeSlot)}
                      className="border-1 rounded-[50px] w-[18%] text-[13px] font-pretendard bg-[#6161CE] text-white"
                    >
                      확정
                    </button>
                  </div>
                  <div className="flex gap-[3px] items-center">
                    <div className="w-[14px] h-[14px] bg-[#6161CE] rounded-full flex justify-center items-center">
                      <CheckFat size={10} weight="fill" color="white" />
                    </div>
                    <p className="text-black text-[15px] font-medium">
                      가능인원
                    </p>
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
              );
            })
          ) : (
            <p>아직 투표한 사람이 없어요.</p>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* 복사 가능 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[10001]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4 flex flex-row items-center">
              모임이 확정되었습니다! 🎉
              <CopyToClipboard text={message}>
                <button
                  onClick={() => {
                    alert("메시지가 복사되었습니다!");
                  }}
                  className="text-[#aaa] ml-[1%]"
                >
                  <MdOutlineContentCopy size={20} />
                </button>
              </CopyToClipboard>
            </h2>
            <p className="mb-4 whitespace-pre-wrap">{message}</p>
            <div className="flex space-x-2">
              <button
                onClick={closeModalAndNavigate}
                className="bg-[#6161CE] text-white py-2 px-4 rounded-lg w-full"
              >
                확정하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
