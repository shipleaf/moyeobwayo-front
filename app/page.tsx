"use client";

import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { MdContentPaste } from "react-icons/md";
import { HiUserCircle } from "react-icons/hi2";
import Image from "next/image";
import CalendarComp from "./components/createParty/CalendarComp";
import TimeTable from "./components/createParty/TimeTable";
import { RecoilRoot, useRecoilState } from "recoil";
import { kakaoLoginState } from "./recoil/atom";
import Modal from "react-modal";
import KakaoLogin from "./components/login/KakaoLogin";

// 예시 사용자 데이터
const users = [
  { id: 1, username: "Alice", profileImage: "" },
  { id: 2, username: "Bob", profileImage: "" },
  { id: 3, username: "Charlie", profileImage: "" },
];

export default function Home() {
  const [selectedButton, setSelectedButton] = useState<"calendar" | "content">(
    "calendar"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kakaoState, setKakaoState] = useRecoilState(kakaoLoginState); // Recoil 상태 사용

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

  return (
    <RecoilRoot>
      <div className="flex items-center justify-end bg-[#6161CE] h-screen p-[2%] relative">
        <div className="flex flex-col w-[10%] h-[100%] pl-[1%] items-start">
          <div className="flex flex-col items-center">
            <Image
              src="/images/moyeobwayo.png"
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
          <CalendarComp />
          <TimeTable />
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

      {/* Kakao 로그인 모달 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
      >
        <KakaoLogin />
      </Modal>
    </RecoilRoot>
  );
}
