'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { Bell } from "@phosphor-icons/react/dist/ssr";
import Toggle from "./Toggle";
import { useRecoilState, useRecoilValue } from 'recoil';
import { kakaoUserState } from '@/app/recoil/atom';
import { loadFromLocalStorage, saveToLocalStorage } from '@/app/recoil/recoilUtils';
import { getAlarmState } from '@/app/api/getAlarmState';
import { useRouter } from 'next/navigation';

export default function Header() {
  const searchParams = useSearchParams()
  const partyId = searchParams.get('partyId')
  const kakaoUser = useRecoilValue(kakaoUserState);
  const [alarm, ] = useState<boolean>(true);
  const [globalKakaoUserState, setKakaoUserState] = useRecoilState(kakaoUserState);
  const router = useRouter()
  console.log('partyId', partyId); // partyId 로그 확인

  useEffect(() => {
    const checkUserStatus = async () => {
      // 먼저 전역 상태에서 로그인 상태 확인
      if (kakaoUser.kakaoUserId !== null) {
        return; // 로그인 상태가 확인되면 종료
      }

      // 로그인 상태가 없으면 로컬 스토리지에서 확인
      const kakaoUserDataByStorage = await loadFromLocalStorage("kakaoUserDataByStorage");
      const currentDate = new Date();
      console.log(kakaoUserDataByStorage);
      if (kakaoUserDataByStorage) {
        const { expiresAt } = kakaoUserDataByStorage;

        // 현재 시간이 expiresAt보다 이전인 경우
        if (currentDate < new Date(expiresAt)) {
          // 로그인 상태 변경
          setKakaoUserState({
            kakaoUserId: kakaoUserDataByStorage.kakaoUserId,
            nickname: kakaoUserDataByStorage.nickname,
            profile_image: kakaoUserDataByStorage.profile_image,
          });
          return; // 로그인 상태가 확인되면 종료
        }
      }

      // 로컬 스토리지에도 데이터가 없거나 만료된 경우
      alert("로그인 후 이용해주세요!");
      setTimeout(() => {
        router.push('/login/kakao');  // 카카오 로그인 페이지로 리다이렉트
      }, 10);
    };

    checkUserStatus();
  }, [setKakaoUserState, kakaoUser, router]);

  useEffect(() => {
    const fetchAlarmState = async () => {
      if (globalKakaoUserState.kakaoUserId !== null && partyId) {
        try {
          const res = await getAlarmState({
            kakaoId: globalKakaoUserState.kakaoUserId as number,
            partyId: partyId as string,
          });
          if (res) {
            console.log(res);
          }
        } catch (error) {
          console.error("Error fetching alarm state:", error);
        }
      }
    };

    fetchAlarmState(); // 비동기 함수 호출
  }, [partyId, globalKakaoUserState.kakaoUserId]); // partyId와 globalKakaoUserState.kakaoUserId를 의존성 배열에 추가

  const handleLogout = () => {
    // 카카오 사용자 정보를 초기화하여 로그아웃 상태로 변경
    setKakaoUserState({
      kakaoUserId: null,
      nickname: "",
      profile_image: "",
    });
    
    saveToLocalStorage("kakaoUserJWT", "");
    // 홈 화면으로 리다이렉트
    router.push('/');
  };

  return (
    <header className="pt-[12px] pb-[13px] flex justify-between items-center">
      <h1 className="font-bold text-[20px]">
        <strong className="text-[#6161CE]">
          {kakaoUser.kakaoUserId && kakaoUser.nickname}
        </strong>의 
        <br />일정 한눈에 보기
      </h1>
      <div className="flex gap-4 items-center">
        <button 
          onClick={handleLogout}
          className="text-[#5F5F5F] text-[16px] font-semibold py-3 px-[26px] 
              border-[1px] border-[#D7D7D7] rounded-[50px] outline-none 
              transition-all duration-300 ease-in-out 
              hover:bg-[#F0F0F0] hover:text-[#3E3E3E] hover:border-[#B0B0B0]">
          로그아웃
        </button>
        <button className="text-[#5F5F5F] text-[16px] font-semibold py-[9px] px-4
          border-[1px] border-[#D7D7D7] rounded-[50px]
          flex  items-center gap-4 outline-none">
          <Bell size={24} />
          <Toggle isToggled={alarm} />
        </button>
      </div>
    </header>
  );
}