"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // useRouter 추가
import { sendAuthCodeToBackend } from "@/app/api/kakaoLoginAPI"; // API 호출 함수 가져오기
import { useSetRecoilState } from "recoil";
import { kakaoUserState } from "@/app/recoil/atom";
import { loadFromLocalStorage, saveToLocalStorage } from "@/app/recoil/recoilUtils";
function Page() {
  const searchParams = useSearchParams();
  const router = useRouter(); // useRouter 사용
  const code = searchParams.get("code"); // URL에서 code 추출
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  const setKakaoUserState = useSetRecoilState(kakaoUserState);

  useEffect(() => {
    const handleLogin = async () => {
      if (!code) return; // code가 없으면 함수 종료
      
      setLoading(true);
      try {
        const kakaoUserData = await sendAuthCodeToBackend(code); // await 사용
        console.log('kakaoUserData', kakaoUserData);
        
        if (kakaoUserData) {
        const {expires_in, kakaoUserId, nickname, profile_image} = kakaoUserData

          setKakaoUserState({
            kakaoUserId: kakaoUserId, // 응답 데이터 반영
            nickname: nickname,
            profile_image: profile_image,
          });
          
          // localstorage에 expired_at은 현재시간에서 expiresin초를 더해서 만료시간 계산해서 넣어줘 계산해서 아래함수로 로컬스토리지에 load해봐
          const currentDate = new Date();
          const expiresAt = new Date(currentDate.getTime() + expires_in * 1000)
          const kakaoUserDataByStorage = {
            kakaoUserId: kakaoUserId, // 응답 데이터 반영
            nickname: nickname,
            profile_image: profile_image,
            expiresAt: expiresAt
          }
          saveToLocalStorage("kakaoUserDataByStorage",kakaoUserDataByStorage)

          router.push('/meetlist')
        }else{
          throw error
        }
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    };
  
    handleLogin(); // 비동기 함수 호출
  }, [code]); // code가 변경될 때마다 실행

  return (
    <div>
      <h1>Kakao OAuth Callback</h1>
      {loading && <div>Loading...</div>} {/* 로딩 상태 표시 */}
      {!loading && code && (
        <div>
          <div>Authorization Code:</div>
          <div>{code}</div>
        </div>
      )}
      {!loading && !code && <div>No authorization code found.</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default Page;
