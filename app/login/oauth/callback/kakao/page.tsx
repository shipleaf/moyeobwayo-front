// pages/login/oauth/callback/kakao/page.tsx
"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { linkKakaoAndPartyUser, sendAuthCodeToBackend } from "@/app/api/kakaoLoginAPI";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { kakaoUserState, userIdValue } from "@/app/recoil/atom";
import { saveToLocalStorage } from "@/app/recoil/recoilUtils";

// 클라이언트 사이드 전용으로 페이지를 로드하도록 설정
const Page = dynamic(() => Promise.resolve(KakaoCallback), { ssr: false });

function KakaoCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const setKakaoUserState = useSetRecoilState(kakaoUserState);

  useEffect(() => {
    const handleLogin = async () => {
      if (!code) return;
      setLoading(true);

      try {
        const kakaoUserData = await sendAuthCodeToBackend(code);
        if (kakaoUserData) {
          const { expires_in, kakaoUserId, nickname, profile_image } = kakaoUserData;
          setKakaoUserState({
            kakaoUserId: kakaoUserId,
            nickname: nickname,
            profile_image: profile_image,
          });
          
          const storedUserId = sessionStorage.getItem('globalUserId');
          if (storedUserId) {
              const userId = parseInt(storedUserId, 10); // 숫자로 변환
              await linkKakaoAndPartyUser(Number(userId), kakaoUserId)
          }
          const expiresAt = new Date(Date.now() + expires_in * 1000);
          const kakaoUserDataByStorage = {
            kakaoUserId,
            nickname,
            profile_image,
            expiresAt,
          };
          saveToLocalStorage("kakaoUserDataByStorage", kakaoUserDataByStorage);

          router.push("/meetlist");
        } else {
          throw new Error("Login failed");
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    handleLogin();
  }, [code]);

  return (
    <div>
      <h1>Kakao OAuth Callback</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default Page;
