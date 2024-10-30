"use client";

// app/components/login/KakaoLogin.tsx

import Script from "next/script";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { userIdValue } from "@/app/recoil/atom";
const redirectUri: string = process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI as string;

const scope = [
  "profile_nickname",
  "profile_image",
  "talk_message", // 카카오 메시지 동의 항목 추가
].join(",");

export default function KakaoLogin() {
  const [isKakaoReady, setIsKakaoReady] = useState(false); // SDK가 준비된 상태를 관리
  const globalUserId = useRecoilValue(userIdValue);
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY as string);
      console.log("after Init: ", window.Kakao.isInitialized());
    }
  }, [isKakaoReady]);

  const kakaoLoginHandler = () => {
    if (globalUserId !== null) {
      // globalUserId를 세션 스토리지에 저장
      sessionStorage.setItem('globalUserId', globalUserId.toString()); // 문자열로 변환하여 저장
    }
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.authorize({
        redirectUri,
        scope,
      });
    } else {
      console.error("Kakao SDK가 로드되지 않았거나 초기화되지 않았습니다.");
    }
  };

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        onLoad={() => {
          setIsKakaoReady(true); // SDK 로드 후에만 초기화 진행
        }}
      />
      <div className="w-full h-full flex flex-row items-center bg-[#fff] gap-[70px]">
        <div className="w-[50%] h-[100%]">
          <Image
            src="/images/KakaoLoginImage.png"
            alt=""
            width={482}
            height={639}
            // objectFit="contain"
            className="w-[100%] h-[100%]"
          />
        </div>
        <div className="h-full pt-[188px]">
          <div className="">
            <span className="font-pretendard font-[600] text-[32px] mb-4">
              간편로그인 후 <br /> 내 일정을 한번에 확인해보세요!
            </span>
            
            <div className="mb-[157px]">
              <span className="text-[#6161CE] font-pretendard font-[600] text-[20px]">
                10초
              </span>
              <span className="text-[#6C6C6C] font-pretendard font-[500] text-[20px]">
                면 회원가입이 가능해요
              </span>
            </div>
          </div>
          <div 
            onClick={kakaoLoginHandler} 
            className="py-5 px-[30px] cursor-pointer hover:bg-[#E5C900]
            rounded-[10px] bg-[#FDE500] text-[#3B1D04] text-[26px] font-semibold">
            <div className="flex items-center gap-5">
              <Image
                src="/images/KakaoLogo.png"
                alt=""
                width={36}
                height={33}
              />
                카카오로 로그인하기

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
