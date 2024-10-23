"use client";

import React from "react";
import { FiCalendar } from "react-icons/fi";
import { MdContentPaste } from "react-icons/md";
import Image from "next/image";
import CalendarComp from "./components/createParty/CalendarComp";
import TimeTable from "./components/createParty/TimeTable";
import { useRecoilState } from "recoil";
import { selectedStartTime, selectedEndTime } from "./recoil/atom";
import { selectedDateState } from "./recoil/atom";
import Link from "next/link";

export default function Home() {

  const [selectedDates, setSelectedDates] = useRecoilState(selectedDateState);
  const [startTimeState, setStartTimeState] = useRecoilState(selectedStartTime);
  const [endTimeState, setEndTimeState] = useRecoilState(selectedEndTime);

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
              <Link href={'/meetlist'}
                 // content 버튼 클릭 핸들러
                className={`content w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer mb-[50%] focus:outline-none
                    bg-[rgba(255,255,255,0.1)] border-none`
                }
              >
                <MdContentPaste
                  size={30}
                  className=
                      "text-white opacity-100"
                />
              </Link>
              <Link
                href={'/'}
                className={`calendar w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer ${
                    "bg-white text-black"
                }`}
              >
                <FiCalendar
                  size={30}
                  className="text-black"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* page 영역 */}
        <div className="page w-[90%] h-[100%] bg-white rounded-[20px] z-50 p-[2%] flex flex-row">
          <CalendarComp />
          <TimeTable
            Dates={selectedDates}
            startTime={formatTime(startTimeState)}
            endTime={formatTime(endTimeState)}
          />
            {/* <KakaoLogin /> */}
        </div>

        {/* 삼각형 모양의 데코레이션 */}
        <div
          className={`absolute transition-all duration-300 z-0 ${
              "top-[31%] left-[10.5%]"
              // : "top-[18%] left-[10.5%]"
          }`}
        >
          <div className="w-16 h-16 bg-white rounded-[20%] transform rotate-45 shadow-lg"></div>
        </div>
      </div>
    </>
  );
}
