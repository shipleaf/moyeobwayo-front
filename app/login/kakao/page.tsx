import React, { Suspense } from "react";
import KakaoLogin from "@/app/components/login/KakaoLogin";
import Image from "next/image";
import Link from "next/link";
import { CalendarBlank, Clipboard } from "@phosphor-icons/react/dist/ssr";

export default function page() {
  return (
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
              // content 버튼 클릭 핸들러
              className="content w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer mb-[50%]
                    bg-white text-black"
            >
              <Clipboard size={30} weight="bold" className="text-black" />
            </button>
            <Link
              href={"/"}
              className="calendar w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer
                    bg-[rgba(255,255,255,0.1)] border-none"
            >
              <CalendarBlank
                size={30}
                weight="bold"
                className="text-white opacity-100"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="page w-[90%] flex flex-col h-full bg-white rounded-[20px] z-50 p-[2%]">
        {/* Content */}
        <Suspense>
          <KakaoLogin></KakaoLogin>
        </Suspense>
      </div>

      <div
        className={`absolute transition-all duration-300 z-0 ${"top-[18%] left-[10.5%]"}`}
      >
        <div className="w-16 h-16 bg-white rounded-[20%] transform rotate-45 shadow-lg"></div>
      </div>
    </div>
  );
}
