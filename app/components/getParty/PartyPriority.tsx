import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // useRouter 추가
import { getTable } from "@/app/api/getTableAPI";
import {
  GetTableResponse,
  AvailableTimesResponse,
} from "@/app/api/getTableAPI";
import { CompleteData, completeTime } from "@/app/api/partyCompleteAPI";
import { useRecoilValue } from "recoil";
import { userIdValue, tableRefreshTrigger } from "@/app/recoil/atom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdOutlineContentCopy } from "react-icons/md";
import { CheckFat } from "@phosphor-icons/react";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";

// 날짜 포맷 함수
const formatDateTime = (dateTime: string, includeDate: boolean = true) => {
  const date = new Date(dateTime);
  return date.toLocaleString("ko-KR", {
    month: includeDate ? "long" : undefined,
    day: includeDate ? "numeric" : undefined,
    weekday: includeDate ? "short" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface TimeSlot {
  start: string;
  end: string;
  locationName?: string;
  dateId: number;
  users: string[];
  usersId: number[];
}

const convertAvailableTimeToTimeSlot = (
  availableTime: AvailableTimesResponse,
  dateId: number,
  locationName?: string
): TimeSlot => {
  return {
    start: availableTime.start,
    end: availableTime.end,
    locationName: locationName || "Default Location",
    dateId: dateId,
    users: availableTime.users.map((user) => user.userName),
    usersId: availableTime.users.map((user) => user.userId),
  };
};

export default function PartyPriority({
  decisionTime,
}: {
  decisionTime?: string;
}) {
  const { hash } = useParams();
  const [priorityData, setPriorityData] = useState<GetTableResponse | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<TimeSlot | null>(null);
  const [message, setMessage] = useState("");
  const userId = useRecoilValue(userIdValue);
  const refreshTrigger = useRecoilValue(tableRefreshTrigger);

  const decisionDate = decisionTime ? new Date(decisionTime) : null;

  useEffect(() => {
    if (hash && refreshTrigger >= 0) {
      getTable({ table_id: hash as string })
        .then((data) => {
          setPriorityData(data);
        })
        .catch((error) => {
          console.error("에러 발생: ", error);
        });
    }
  }, [hash, refreshTrigger]);

  // 확정하기 버튼 클릭 이벤트 핸들러
  const handleComplete = async (timeSlot: TimeSlot) => {
    if (!hash) return;

    const selectedDate = timeSlot.start.split("T")[0]; // "2024-11-22"

    // dates에서 해당 날짜에 맞는 dateId를 찾기
    const matchingDate = priorityData?.party.dates.find((date) => {
      const dateOnly = date.selected_date.split("T")[0]; // "2024-11-22"
      return dateOnly === selectedDate;
    });

    if (!matchingDate) {
      return;
    }

    const completeData: CompleteData = {
      userId: userId as number,
      completeTime: new Date(timeSlot.start),
      endTime: new Date(timeSlot.end),
      locationName: timeSlot.locationName || "Default Location",
      dateId: matchingDate.dateId,
      users: timeSlot.users,
      usersId: timeSlot.usersId,
    };

    try {
      const response = await completeTime(hash as string, completeData);
      if (response.status === 200) {
        const title = priorityData?.party.partyName || "모임";
        const subtitle = priorityData?.party.partyDescription || "모임 설명";
        const formattedMessage = `모임명: ${title}\n설명: ${subtitle}\n날짜: ${formatDateTime(
          timeSlot.start
        )} ~ ${formatDateTime(
          timeSlot.end,
          false
        )}\n\n모여서 즐거운 시간을 보내세요!\n자세한 내용은 모여봐요에서 확인해 보세요!\n\n링크: https://moyeobwayo.com/meeting/${hash}`;
        setMessage(formattedMessage);
        setShowModal(true);
      } else {
        alert("시간 확정에 실패했습니다.");
      }
    } catch (error) {
      console.error("확정 요청 에러: ", error);
      alert("일정을 확정하려면 로그인이 필요합니다!");
    }
  };

  // 모달 닫기 및 페이지 이동
  const closeModalAndNavigate = () => {
    setShowModal(false);
    window.location.reload();
  };

  return (
    <>
      <div
        className="py-[13px] px-[15px] w-full overflow-y-auto h-[40%] 
      flex flex-col gap-2 items-center mb-[10%] rounded-[10px]"
      >
        {priorityData ? (
          Array.isArray(priorityData.availableTime) &&
          priorityData.availableTime.length > 0 ? (
            priorityData.availableTime.map((availableTime, index) => {
              const timeSlot = convertAvailableTimeToTimeSlot(
                availableTime,
                index + 1,
                priorityData.party.locationName
              );

              const isDecisionTimeMatched =
                decisionDate &&
                new Date(timeSlot.start).getTime() === decisionDate.getTime();

              return (
                <div
                  key={index}
                  className={`priorList px-4 rounded-[5px] drop-shadow-[6px] shadow-prior backdrop-blur-48px w-[100%] mb-[3%] box-border p-[10px] flex flex-col gap-2 ${
                    isDecisionTimeMatched
                      ? "border-2 border-[#6161CE] bg-[rgba(97,97,206,0.1)]"
                      : ""
                  }`}
                >
                  <div className="flex flex-row justify-between gap-1">
                    <p className="font-pretendard text-sm font-[500]">
                      {formatDateTime(timeSlot.start)} ~{" "}
                      {formatDateTime(timeSlot.end, false)}
                    </p>
                    {priorityData?.party?.decisionDate === true ? (
                      ""
                    ) : (
                      <button
                        onClick={() => setConfirmModal(timeSlot)}
                        className="border-1 rounded-[50px] w-[25%] h-[80%] text-[12px] md:text-[13px] lg:text-[14px] whitespace-nowrap font-bold font-pretendard bg-[#6161CE] text-white"
                      >
                        확정
                      </button>
                    )}
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
                        className="username text-[#8E8E8E] border-1 rounded-[10px] px-[8px] py-[4px] m-[2px] max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap relative group"
                      >
                        <p className="flex flex-row items-center justify-between">
                          {user.replace(/\(\d+\)$/, "")}
                          {/\(\d+\)$/.test(user) && (
                            <Image
                              src="/images/kakaotalk_sharing_btn_small_ov.png"
                              alt="Exclamation Icon"
                              width={10}
                              height={10}
                              className="ml-1 inline-block w-4 h-4 rounded-2xl"
                            />
                          )}
                        </p>
                        {/* 툴팁 */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                          {user}
                        </div>
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
          <p>불러오는 중...</p>
        )}
      </div>
      {confirmModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-30 flex items-center justify-center z-[10001]">
          <div className="bg-white p-10 rounded-lg flex flex-col items-center w-[35%] min-w-[350px] max-w-[500px]">
            <div className="rounded-full bg-[#eee] p-3 mb-[8%]">
              <FaCheck className="text-[#6161ce]" size={15} />
            </div>
            <span className="text-lg font-[600] font-pretendard">
              일정을 확정하시겠습니까?
            </span>
            <div className="p-1 font-pretendard">
              {" "}
              {formatDateTime(confirmModal.start)} ~{" "}
              {formatDateTime(confirmModal.end, false)}
            </div>
            <div className="flex gap-2 mt-4 justify-center">
              <button
                onClick={() => setConfirmModal(null)}
                className="bg-white border-1 font-pretendard text-sm font-bold px-4 py-2 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={() => {
                  handleComplete(confirmModal);
                  setConfirmModal(null);
                }}
                className="bg-[#6161CE] text-white font-pretendard text-sm font-bold px-4 py-2 rounded-lg"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 복사 가능 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-30 z-[10001]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4 flex flex-row items-center font-pretendard">
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
            <span className="mb-4 whitespace-pre-wrap font-pretendard">
              {message}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={closeModalAndNavigate}
                className="bg-[#6161CE] text-white py-2 px-4 rounded-lg w-full font-pretendard"
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
