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
      <button onClick={kakaoLoginHandler}>
        <Image
          src="/images/kakao_login_medium_narrow.png"
          alt=""
          width={250}
          height={100}
          className="mb-[50%]"
        />
      </button>
    </>
  );
}
