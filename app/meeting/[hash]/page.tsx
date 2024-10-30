"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // App Router에서 useParams 사용
import { getTable } from "@/app/api/getTableAPI"; // API 호출 주석 처리
import { useRecoilValue } from "recoil";
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

import { Party } from "@/app/api/getTableAPI"; // interfaces 파일의 경로

interface TableData {
  party: Party;
  formattedDates: string[];
  startTime: string;
  endTime: string;
}

export interface Timeslot {
  slotId: number;
  selectedStartTime: string;
  selectedEndTime: string;
  userEntity: UserEntity;
}

export interface UserEntity {
  userId: number;
  userName: string;
  password: null;
}

export default function MeetingPage() {
  const { hash } = useParams(); // meetingId를 URL에서 추출
  const [tableData, setTableData] = useState<TableData | null>(null);
  const isLoggedIn = useRecoilValue(loginState);
  const [, setLoading] = useState(false);

  const users = [
    { id: 1, username: "Alice", profileImage: "" },
    { id: 2, username: "Bob", profileImage: "" },
    { id: 3, username: "Charlie", profileImage: "" },
  ];

  const [selectedButton, setSelectedButton] = useState<"calendar" | "content">(
    "calendar"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const kakaoState = useRecoilValue(kakaoLoginState); // Recoil 상태 사용

  const handleButtonClick = () => {
    setSelectedButton("content");

    // kakaoLoginState가 false일 때 모달을 띄움
    if (!kakaoState) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (hash) {
      getTable({ table_id: hash as string })
        .then((data) => {
          // 서버에서 받아온 날짜를 로컬 날짜로 변환하고 ISO 형식에서 날짜 부분만 추출
          const dates = data.party.dates.map((date) => {
            const localDate = new Date(date.selected_date);
            return localDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD 형식으로 변환
          });

          // 시작 시간과 종료 시간은 로컬 시간대로 변환 후 HH:MM 형식만 추출
          const startTime = new Date(data.party.startDate).toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );

          const endTime = new Date(data.party.endDate).toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );

          // 상태 업데이트
          setTableData({
            ...data,
            formattedDates: dates,
            startTime: startTime,
            endTime: endTime,
          });
          setLoading(false); // API 호출이 끝나면 loading 해제
        })
        .catch((error) => {
          console.error("에러 발생: ", error);
          setLoading(false); // 에러 발생 시에도 loading 해제
        });
    }
  }, [hash]); // hash와 loading을 의존성으로 추가

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
              className="mb-[50%]"
            />
            <div className="flex flex-col items-center">
              <button
                onClick={handleButtonClick} // content 버튼 클릭 핸들러
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
                    key={user.id}
                    className="relative w-[80px] h-[80px] rounded-full flex items-center justify-center cursor-pointer bg-white"
                    style={{
                      top: `${index * -45}px`,
                      zIndex: 10 + index,
                    }}
                  >
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.username}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    ) : (
                      <HiUserCircle size={80} className="text-[#ced4da]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="page w-[90%] h-[100%] bg-white rounded-[20px] z-50 p-[2%] flex flex-row">
          <div className="flex flex-col mr-[2%] basis-1/4 items-center">
            <PartyPriority />
            {isLoggedIn && tableData ? (
              <TimeSelector party={tableData.party} />
            ) : (
              <TableLogin />
            )}
          </div>
          {/* TimeTable 컴포넌트에 변환된 날짜와 시간 전달 */}
          {tableData && (
            <TimeTable
              Dates={tableData.formattedDates}
              startTime={tableData.startTime}
              endTime={tableData.endTime}
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
