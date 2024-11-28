"use client";

// app/components/login/KakaoLogin.tsx

import Script from "next/script";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { userIdValue } from "@/app/recoil/atom";
const redirectUri: string = process.env
  .NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI as string;

const scope = [
  "profile_nickname",
  "profile_image",
  "talk_message", // 카카오 메시지 동의 항목 추가
  "talk_calendar",
  "phone_number",
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
      sessionStorage.setItem("globalUserId", globalUserId.toString()); // 문자열로 변환하여 저장
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
      <div className="w-full h-full flex flex-row max-[740px]:flex-col items-center bg-[#fff] 
        gap-[70px] max-[740px]:gap-0"> 
        <div className="w-[50%] max-[740px]:w-full h-[100%] max-[740px]:h-[70%] bg-[#fff]">
          <Image
            src="/images/KakaoLoginImage.png"
            alt=""
            width={482}
            height={639}
            // objectFit="contain"
            className="w-[100%] h-[100%] max-[740px]:h-[100%] max-[740px]:object-cover"
          />
        </div>
        <div className="h-full max-[740px]:h-auto pt-[188px] max-[740px]:pt-0 max-[740px]:mt-2 max-[740px]:w-full">
          <div className="max-[740px]:flex-col max-[740px]:flex max-[740px]:items-center max-[740px]:mb-4">
            <span className="font-pretendard font-[600] text-[32px] 
              max-[740px]:text-[22px] max-[740px]:text-left max-[740px]:w-[80%] mb-4 max-[740px]:my-1">
              간편로그인 후 <br /> 내 일정을 한번에 확인해보세요!
            </span>
            <div className="mb-[157px] max-[740px]:mb-0  max-[740px]:w-[80%]">
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
            className="py-5 max-[740px]:py-3 px-[30px] max-[740px]:px-3 cursor-pointer hover:bg-[#E5C900]
            rounded-[10px] bg-[#FDE500] text-[#3B1D04] text-[26px] font-semibold
             max-[740px]:mx-auto max-[740px]:w-4/5
            "
          >
            <div className="flex max-[740px]:justify-center items-center gap-5">
              <Image
                src="/images/KakaoLogo.png"
                alt=""
                width={36}
                height={33}
                className="max-[740px]:w-[28px] max-[740px]:h-[26px]"
              />
              <span className="max-[740px]:text-xl">카카오로 로그인하기</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
