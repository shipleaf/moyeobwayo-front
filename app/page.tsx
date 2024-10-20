"use client";

import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { MdContentPaste } from "react-icons/md";
import Image from "next/image";
import CalendarComp from "./components/createParty/CalendarComp";
import TimeTable from "./components/createParty/TimeTable";
import { useRecoilState } from "recoil";
import { kakaoLoginState, selectedStartTime, selectedEndTime } from "./recoil/atom";
import Modal from "react-modal";
import KakaoLogin from "./components/login/KakaoLogin";
import { selectedDateState } from "./recoil/atom";

export default function Home() {
  const [selectedButton, setSelectedButton] = useState<"calendar" | "content">(
    "calendar"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kakaoState, setKakaoState] = useRecoilState(kakaoLoginState); // Recoil 상태 사용

  const [selectedDates, setSelectedDates] = useRecoilState(selectedDateState);
  const [startTimeState, setStartTimeState] = useRecoilState(selectedStartTime);
  const [endTimeState, setEndTimeState] = useRecoilState(selectedEndTime);

  const handleButtonClick = () => {
    setSelectedButton("content");

    // kakaoLoginState가 false일 때 모달을 띄움
    if (!kakaoState) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedButton("calendar");
  };

  const formatTime = (time: number) => {
    return `${time.toString().padStart(2, "0")}:00`; // 두 자리로 맞추고 ":00" 추가
  };

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
                className={`content w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer mb-[50%] focus:outline-none ${
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
            </div>
          </div>
        </div>
        <div className="page w-[90%] h-[100%] bg-white rounded-[20px] z-50 p-[2%] flex flex-row">
          <CalendarComp />
          <TimeTable
            Dates={selectedDates}
            startTime={formatTime(startTimeState)}
            endTime={formatTime(endTimeState)}
          />
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
    </>
  );
}
