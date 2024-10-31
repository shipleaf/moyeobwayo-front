"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation"; // App Router에서 useParams 사용
import { getTable } from "@/app/api/getTableAPI"; // API 호출 주석 처리
import { useRecoilValue, useRecoilState } from "recoil";
import { selectedAvatarState } from "@/app/recoil/atom";
import { MdContentPaste } from "react-icons/md";
import { HiUserCircle } from "react-icons/hi2";
import TimeTable from "@/app/components/createParty/TimeTable";
import Image from "next/image";
import { FiCalendar } from "react-icons/fi";
import Modal from "react-modal";
import { kakaoLoginState } from "@/app/recoil/atom";
import KakaoLogin from "@/app/components/login/KakaoLogin";
import TimeSelector from "@/app/components/getParty/VoteTable";
import PartyPriority from "@/app/components/getParty/PartyPriority";
import { loginState } from "@/app/recoil/atom";
import TableLogin from "@/app/components/login/TableLogin";
import { loadFromLocalStorage } from "@/app/recoil/recoilUtils";
import { Party } from "@/app/api/getTableAPI"; // interfaces 파일의 경로
import { useRouter } from "next/navigation";
import {
  getUserAvatar,
  GetUserAvatarResponse,
} from "@/app/api/getUserAvatarAPI";

interface TableData {
  party: Party;
  formattedDates: string[];
  startTime: string;
  endTime: string;
  convertedTimeslots: {
    userId: number;
    username: string;
    byteString: string;
  }[];
}

export default function MeetingPage() {
  const { hash } = useParams(); // meetingId를 URL에서 추출
  const [tableData, setTableData] = useState<TableData | null>(null);
  const router = useRouter();
  const isLoggedIn = useRecoilValue(loginState);
  const [, setLoading] = useState(false);
  const [users, setUsers] = useState<GetUserAvatarResponse[]>([]);
  const [selectedAvatar, setSelectedAvatar] =
    useState<GetUserAvatarResponse | null>(null);

  const [selectedButton, setSelectedButton] = useState<"calendar" | "content">(
    "calendar"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const kakaoState = useRecoilValue(kakaoLoginState); // Recoil 상태 사용

  const resetSelection = () => setSelectedAvatar(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        resetSelection();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resetSelection();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  const handleButtonClick = () => {
    setSelectedButton("content");

    // kakaoLoginState가 false일 때 모달을 띄움
    if (!kakaoState) {
      setIsModalOpen(true);
    }
  };

  const handleLogoCLick = () => {
    router.push("/");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (hash) {
      setLoading(true);

      // 두 개의 API 요청을 동시에 호출
      Promise.all([
        getTable({ table_id: hash as string }),
        getUserAvatar({ table_id: hash as string }),
      ])
        .then(([tableDataResponse, userAvatarResponse]) => {
          // 첫 번째 API 응답 처리
          const dates = tableDataResponse.party.dates.map((date) => {
            const localDate = new Date(date.selected_date);
            return localDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD 형식으로 변환
          });
          const timeslots = tableDataResponse.party.dates.map((date) => ({
            dateId: date.dateId,
            timeslots: (date.convertedTimeslots || []).map((slot) => ({
              userId: slot.userId,
              username: slot.username,
              byteString: slot.byteString,
            })),
          }));

          const startTime = new Date(
            tableDataResponse.party.startDate
          ).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const endTime = new Date(
            tableDataResponse.party.endDate
          ).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });

          // 두 번째 API 응답 처리
          setUsers(userAvatarResponse);
          console.log(users);
          // 상태 업데이트
          setTableData({
            ...tableDataResponse,
            formattedDates: dates,
            startTime: startTime,
            endTime: endTime,
            timeslots: timeslots,
          });
        })
        .catch((error) => {
          console.error("에러 발생: ", error);
        })
        .finally(() => {
          setLoading(false); // 모든 API 호출이 끝나면 loading 해제
        });
    }
  }, [hash]);

  return (
    <>
      <div className="flex items-center justify-end bg-[#6161CE] h-screen p-[2%] relative">
        <div className="flex flex-col w-[10%] h-[100%] pl-[1%] items-start">
          <div className="flex flex-col items-center">
            <Image
              src="/images/mainLogo.png"
              alt=""
              width={80}
              height={80}
              className="mb-[50%] cursor-pointer"
              onClick={handleLogoCLick}
            />
            <div className="flex flex-col items-center">
              <button
                onClick={handleButtonClick}
                className={`content w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer mb-[50%] ${
                  selectedButton === "content"
                    ? "bg-white text-black"
                    : "bg-[rgba(255,255,255,0.1)] border-none"
                }`}
              >
                <MdContentPaste
                  size={30}
                  className={`${
                    selectedButton === "content"
                      ? "text-black"
                      : "text-white opacity-100"
                  }`}
                />
              </button>
              <button
                onClick={() => setSelectedButton("calendar")}
                className={`calendar w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer ${
                  selectedButton === "calendar"
                    ? "bg-white text-black"
                    : "bg-[rgba(255,255,255,0.1)] border-none"
                }`}
              >
                <FiCalendar
                  size={30}
                  className={`${
                    selectedButton === "calendar"
                      ? "text-black"
                      : "text-white opacity-100 "
                  }`}
                />
              </button>
              <div className="relative flex flex-col mt-8">
                {users.map((user, index) => (
                  <div
                    key={user.userId}
                    onClick={() => setSelectedAvatar(user)}
                    className={`relative w-[80px] h-[80px] rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 ${
                      selectedAvatar?.userId === user.userId
                        ? "translate-y-[-20px] ring-4 ring-blue-500"
                        : ""
                    }`}
                    style={{
                      top: `${index * -45}px`,
                      zIndex: 10 + index,
                    }}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      {user.profileImage == null ? (
                        <Image
                          src={`/images/sample_avatar${index + 1}.png`}
                          alt={user.userName}
                          width={79}
                          height={79}
                          className="rounded-full"
                        />
                      ) : (
                        <Image
                          src={user.profileImage}
                          alt={user.userName}
                          width={79}
                          height={79}
                          className="rounded-full"
                        />
                      )}
                      <div className="inset-0 rounded-full bg-[#6161CE] backdrop-blur-[2px]"></div>
                    </div>
                    {/* 선택된 아바타의 이름 표시 */}
                    {selectedAvatar?.userId === user.userId && (
                      <div
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md shadow-md text-xs text-gray-700"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {user.userName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="page w-[90%] h-[100%] bg-white rounded-[20px] z-50 p-[2%] flex flex-row">
          <div className="flex flex-col mr-[2%] basis-1/4 items-center">
            <div className="w-full flex flex-col mb-[10px]">
              <span className="font-pretendard font-[600] text-[30px] text-[#6161CE]">
                {tableData?.party.partyName}
              </span>
              <span className="font-pretendard font-[400] text-[15px] text-[#aaa] pl-[2%]">
                {tableData?.party.partyDescription}
              </span>
            </div>
            <PartyPriority />
            {isLoggedIn && tableData ? (
              <TimeSelector party={tableData.party} />
            ) : (
              <TableLogin />
            )}
          </div>
          {/* TimeTable 컴포넌트에 변환된 날짜와 시간 전달 */}
          {tableData !== null && (
            <TimeTable
              Dates={tableData.formattedDates}
              startTime={tableData.startTime}
              endTime={tableData.endTime}
              voteTimeslots={tableData.timeslots}
            />
          )}
        </div>
        <div
          className={`absolute transition-all duration-300 z-0 ${
            selectedButton === "calendar"
              ? "top-[31%] left-[10.5%]"
              : "top-[18%] left-[10.5%]"
          }`}
        >
          <div className="w-16 h-16 bg-white rounded-[20%] transform rotate-45 shadow-lg"></div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
      >
        <KakaoLogin />
      </Modal>
    </>
  );
}
