"use clinet";
import { kakaoUserState } from "@/app/recoil/atom";
import React from "react";
import { useRecoilValue } from "recoil";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { Jua } from "next/font/google";

const jua = Jua({
    weight: "400", // 폰트 굵기 설정
    subsets: ["latin"], // 필요한 언어 설정
    display: "swap", // FOUT 방지
  });

export default function MeetingMobileHeader() {
  const globalKakaoState = useRecoilValue(kakaoUserState);
  return (
    <div className="flex flex-row items-center justify-between py-[20px] px-[10px]">
      <div className="flex flex-row items-center gap-2">
        <GiHamburgerMenu size={25} color="#6161ce" className="flex items-center"/>
        <span className={`text-[#262669] text-[20px] ${jua.className}`}>모여봐요</span>
      </div>
      <div className={`flex flex-row items-center font-jua font-[600] gap-2 ${jua.className}`}>
        <Image
          src={globalKakaoState.profile_image}
          alt=""
          width={30}
          height={30}
          className="rounded-full"
        />
        {globalKakaoState.nickname}님
      </div>
    </div>
  );
}
