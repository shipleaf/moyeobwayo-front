"use client";

import Script from "next/script";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  linkKakaoAndPartyUser,
  sendAuthCodeToBackend,
} from "@/app/api/kakaoLoginAPI";
import { useSetRecoilState } from "recoil";
import { kakaoUserState } from "@/app/recoil/atom";
import { saveToLocalStorage } from "@/app/recoil/recoilUtils";
import { decodeJWT } from "@/app/utils/jwtUtils";

function KakaoCallback() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const setKakaoUserState = useSetRecoilState(kakaoUserState);
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const router = useRouter();

  const redirectUri: string = process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI as string;
  const scope = [
    "profile_nickname",
    "profile_image",
    "talk_message",
    "talk_calendar",
    "phone_number",
  ].join(",");

  // useSearchParams를 useEffect 내부에서 호출해 클라이언트 측에서만 코드가 실행되도록 합니다.
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const authCode = searchParams.get("code");
    setCode(authCode);
  }, []);

  useEffect(() => {
    if (isKakaoReady && code) {
      const handleLogin = async () => {
        setLoading(true);

        try {
          const responseData = await sendAuthCodeToBackend(code);
          if (responseData) {
            const { token } = responseData;
            const kakaoUserData = decodeJWT(token);
            setKakaoUserState({
              kakaoUserId: kakaoUserData?.kakao_user_id as number,
              nickname: kakaoUserData?.nickname as string,
              profile_image: kakaoUserData?.profile_image as string,
            });
            saveToLocalStorage("kakaoUserJWT", token);
            const storedUserId = sessionStorage.getItem("globalUserId");
            if (storedUserId) {
              const userId = parseInt(storedUserId, 10);
              await linkKakaoAndPartyUser(
                userId,
                kakaoUserData?.kakao_user_id as number
              );
            }

            // talkCalendarOn이 false일 때 SDK 초기화 및 재인증
            if (responseData.talkCalendarOn === false) {
              setKakaoUserState({
                kakaoUserId: null,
                nickname: "",
                profile_image: "",
              });
              saveToLocalStorage("kakaoUserJWT", "");

              if (window.Kakao) {
                window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY as string);
                window.Kakao.Auth.authorize({
                  redirectUri,
                  scope,
                });
              } else {
                console.error("Kakao SDK 초기화 실패.");
              }
            } else {
              router.push("/");
            }
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
    }
  }, [code, isKakaoReady]);

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        onLoad={() => setIsKakaoReady(true)}
      />

      {isKakaoReady ? (
        <div>
          <h1>Kakao OAuth Callback</h1>
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
      ) : (
        <div>Loading Kakao SDK...</div>
      )}
    </>
  );
}

export default KakaoCallback;
