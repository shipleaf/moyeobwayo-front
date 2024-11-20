import React from "react";
import Image from "next/image";
import CalendarComp from "./components/createParty/CalendarComp";
import Link from "next/link";
import { Clipboard } from "@phosphor-icons/react/dist/ssr";
import SampleAvatarList from "./components/SampleAvatarList";
import SampleTimeTable from "./components/SampleTimeTable";
import Footer from "./components/common/Footer";
import MeetPageRedirectHandler from "./components/MeetPageRedirectHandler";
import { FaRegCalendarCheck } from "react-icons/fa";


// 예시 사용자 데이터
export default function Home() {
  return (
    <>
      <MeetPageRedirectHandler></MeetPageRedirectHandler>
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
              <Link
                href={"/meetlist"}
                className={`content w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer mb-[50%] focus:outline-none
                    bg-[rgba(255,255,255,0.1)] border-none`}
              >
                <Clipboard size={30} className="text-white opacity-100" />
              </Link>
              <Link
                href={"/"}
                className={`calendar w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer ${"bg-white text-black"}`}
              >
                <FaRegCalendarCheck size={30} className="text-[#777]" />
              </Link>
              <SampleAvatarList />
            </div>
          </div>
        </div>
        <div className="page w-[90%] h-[100%] bg-white rounded-[20px] z-50 p-[2%] overflow-auto">
          <div className="flex flex-row h-[100%]">
            <CalendarComp />
            <SampleTimeTable />
          </div>
          <Footer></Footer>
        </div>
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
