'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { useRecoilState } from 'recoil';
import { kakaoUserState } from '@/app/recoil/atom';
import { loadFromLocalStorage, saveToLocalStorage } from '@/app/recoil/recoilUtils';
import { getAlarmState } from '@/app/api/getAlarmState';
import { useRouter } from 'next/navigation';
import { decodeJWT } from '@/app/utils/jwtUtils';
import AlarmHandler from './AlarmHandler';

export default function Header() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const partyId = searchParams.get('partyId')
  const [alarmID, setAlarmID] = useState<number | null>(null)
  const [alarm, setAlarm] = useState<boolean>(true);
  const [globalKakaoUserState, setGloabalKakaoUserState] = useRecoilState(kakaoUserState);
  
  useEffect(() => {
    const checkUserStatus = async () => {
      // 1. 전역 상태에서 로그인 상태 확인
      if (globalKakaoUserState.kakaoUserId !== null) {
        return; // 로그인 상태가 확인되면 종료
      }

      // 2. 로컬 스토리지에서 확인
      const kakaoUserDataJWT = await loadFromLocalStorage("kakaoUserJWT");
      const kakaoUserData = decodeJWT(kakaoUserDataJWT)

      if(kakaoUserData?.kakao_user_id){
        // 만료시간 기능 추후 개발해야함
        setGloabalKakaoUserState({
            kakaoUserId: kakaoUserData.kakao_user_id,
            nickname: kakaoUserData.nickname,
            profile_image: kakaoUserData.profile_image || " ",
          });
        return
      }
      
      // 로컬 스토리지에도 데이터가 없거나 만료된 경우
      alert("로그인 후 이용해주세요!");
      setTimeout(() => {
        router.push('/login/kakao');
      }, 10);
    };

    checkUserStatus();
  }, [globalKakaoUserState, globalKakaoUserState, router]);

  useEffect(() => {
    const fetchAlarmState = async () => {
      if (globalKakaoUserState.kakaoUserId !== null && partyId) {
        try {
          const res = await getAlarmState({
            kakaoId: globalKakaoUserState.kakaoUserId as number,
            partyId: partyId as string,
          });
          if (res) {
            setAlarm(res.alarm_on)
            setAlarmID(res.alarmId)
          }
        } catch (error) {
          console.error("Error fetching alarm state:", error);
        }
      }
    };

    fetchAlarmState();
  }, [partyId, globalKakaoUserState.kakaoUserId]);

  const handleLogout = () => {
    setGloabalKakaoUserState({
      kakaoUserId: null,
      nickname: "",
      profile_image: "",
    });
    saveToLocalStorage("kakaoUserJWT", "");

    router.push('/');
  };

  return (
    <header className="pt-[12px] pb-[13px] flex justify-between items-center h-full">
      <h1 className="font-bold text-[20px]">
        <strong className="text-[#6161CE]">
          {globalKakaoUserState.kakaoUserId && globalKakaoUserState.nickname}
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

        <AlarmHandler alarm={alarm} setAlarm={setAlarm} alarmID={alarmID}></AlarmHandler>
      </div>
    </header>
  );
}