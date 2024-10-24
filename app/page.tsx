import React from "react";
import Image from "next/image";
import CalendarComp from "./components/createParty/CalendarComp";
import Link from "next/link";
import { CalendarBlank, Clipboard, UserCircle } from "@phosphor-icons/react/dist/ssr";
import SampleAvatarList from "./components/SampleAvatarList";
import SampleTimeTable from "./components/SampleTimeTable";

// 예시 사용자 데이터
const users = [
  { id: 1, username: "Alice", profileImage: "" },
  { id: 2, username: "Bob", profileImage: "" },
  { id: 3, username: "Charlie", profileImage: "" },
];
export default function Home() {

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
                <Clipboard
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
                <CalendarBlank
                  size={30}
                  className="text-black"
                />
              </Link>
              <SampleAvatarList/>
            </div>
          </div>
        </div>

        {/* page 영역 */}
        <div className="page w-[90%] h-[100%] bg-white rounded-[20px] z-50 p-[2%] flex flex-row">
          <CalendarComp />
          <SampleTimeTable/>
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
