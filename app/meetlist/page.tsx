"use client";

import Image from "next/image";
import React, { Suspense, useEffect } from "react";
import { Clipboard } from "@phosphor-icons/react/dist/ssr";
import MeetList from "./components/MeetList";
import MeetDetail from "./components/MeetDetail";
import Header from "./components/Header";
import Link from "next/link";
import { FaRegCalendarCheck } from "react-icons/fa6";
import MobileHeader from "../components/common/MobileHeader";

// Loading fallback components
const MeetListFallback = () => <div>Loading Meet List...</div>;
const MeetDetailFallback = () => <div>Loading Meet Detail...</div>;

export default function Page() {
  useEffect(() => {
    // 페이지 스크롤 비활성화
    document.body.style.overflow = "hidden";

    return () => {
      // 페이지 스크롤 활성화 (컴포넌트 언마운트 시)
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="flex items-center justify-end bg-[#6161CE] h-screen p-[2%] max-[740px]:p-0 relative">
      <div className="flex flex-col w-[10%] h-[100%] pl-[1%] max-[740px]:p-0 items-start max-[740px]:hidden">
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
              className="content w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer mb-[50%]
                    bg-white text-black"
            >
              <Clipboard size={30} weight="bold" className="text-black" />
            </button>
            <Link
              href="/"
              className="calendar w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer
                    bg-[rgba(255,255,255,0.1)] border-none"
            >
              <FaRegCalendarCheck
                size={30}
                className="text-white opacity-100"
              />
            </Link>
          </div>
        </div>
      </div>
      <div
        className="page w-[90%] max-[1000px]:w-full flex flex-col h-full bg-white rounded-[20px] 
      max-[740px]:rounded-none z-50 p-[2%] max-[740px]:px-[13px]"
      >
        {/* Mobile Header */}
        <MobileHeader endpoint="meetlist" />
        <div className="w-full h-[11%] max-[740px]:hidden">
          <Suspense>
            <Header />
          </Suspense>
        </div>
        <section className="flex-grow flex flex-row gap-6 overflow-hidden">
          {/* MeetList */}
          <div className="w-1/3 flex flex-col h-full overflow-auto max-[740px]:hidden">
            <Suspense fallback={<MeetListFallback />}>
              <MeetList />
            </Suspense>
          </div>
          {/* MeetDetail */}
          <div className="w-full h-full relative overflow-auto">
            <Suspense fallback={<MeetDetailFallback />}>
              <MeetDetail />
            </Suspense>
          </div>
        </section>
      </div>
      <div
        className={`absolute transition-all duration-300 z-0 ${"top-[18%] left-[10.5%]"}`}
      >
        <div className="w-16 h-16 bg-white rounded-[20%] transform rotate-45 shadow-lg"></div>
      </div>
    </div>
  );
}
