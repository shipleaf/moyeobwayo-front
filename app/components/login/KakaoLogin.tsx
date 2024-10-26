"use client";

// app/components/login/KakaoLogin.tsx
import { useRecoilState } from "recoil";
import { kakaoLoginState } from "@/app/recoil/atom";
import Script from "next/script";
import { useEffect, useState } from "react";
import Image from "next/image";

const redirectUri = "http://127.0.0.1:3000/login/oauth/callback/kakao";
const scope = [
  "profile_nickname",
  "profile_image",
  "talk_message", // 카카오 메시지 동의 항목 추가
].join(",");

export default function KakaoLogin() {
  const [isKakaoReady, setIsKakaoReady] = useState(false); // SDK가 준비된 상태를 관리
  const [kakaoState, setKakaoState] = useRecoilState(kakaoLoginState);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY as string);
      console.log("after Init: ", window.Kakao.isInitialized());
    }
  }, [isKakaoReady]);

  const kakaoLoginHandler = () => {
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
          console.log("Kakao SDK loaded");
          setIsKakaoReady(true); // SDK 로드 후에만 초기화 진행
        }}
      />
      <div className="w-full h-full flex flex-row items-center justify-center bg-[#fff]">
        <div className="w-[50%] h-[100%]">
          <Image
            src="/images/KakaoLoginImage.png"
            alt=""
            width={482}
            height={639}
            className="w-[80%] h-[100%]"
          />
        </div>
        <div className="w-[50%] h-[100%] flex flex-col gap-[20%]">
          <div className="flex flex-col pt-[20%]">
            <span className="font-pretendard font-[600] text-[1.5vw]">
              간편로그인 후
            </span>
            <span className="font-pretendard font-[600] text-[1.5vw]">
              내 일정을 한번에 확인해보세요!
            </span>
            <div>
              <span className="text-[#6161CE] font-pretendard font-[600] text-[1vw]">
                30초
              </span>
              <span className="text-[#6C6C6C] font-pretendard font-[500] text-[1vw]">
                면 회원가입이 가능해요
              </span>
            </div>
          </div>
          <button
            onClick={kakaoLoginHandler}
            className="flex items-center justify-center w-[50%]"
          >
            <Image
              src="/images/kakao_login_large_wide.png"
              alt=""
              width={400}
              height={200}
              className="w-[full]"
            />
          </button>
        </div>
      </div>
    </>
  );
}
