'use client'
import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation';
import { Bell, BellSlash } from "@phosphor-icons/react/dist/ssr";
import Toggle from "./Toggle";
import { useSetRecoilState, useRecoilValue } from 'recoil';
import {kakaoUserState } from '@/app/recoil/atom';
export default function Header() {
  const router = useRouter();
  const kakaoUser = useRecoilValue(kakaoUserState);
  const setKakaoUserState = useSetRecoilState(kakaoUserState);
  
  useEffect(() => {
    // kakaoUser.kakaoUserId가 없으면 리다이렉트 처리
    if (kakaoUser && kakaoUser.kakaoUserId !== null) {
      console.log("로그인 상태:", kakaoUser.nickname);
    } else {
      // 로그인되지 않은 경우 alert 및 리다이렉트 실행
      alert("로그인 후 이용해주세요!");
      setTimeout(() => {
        router.push('/login/kakao');  // 카카오 로그인 페이지로 리다이렉트
      }, 100);
    }
  }, [kakaoUser, router]);
  
  
  const handleLogout = () => {
    // 카카오 사용자 정보를 초기화하여 로그아웃 상태로 변경
    setKakaoUserState({
        kakaoUserId: null,
        nickname: "",
        profile_image: "",
    });
    // 홈 화면으로 리다이렉트
    router.push('/');
}
  return (
    <header className="pt-[12px] pb-[13px] flex justify-between items-center">
            <h1 className="font-bold text-[20px]">
              <strong className="text-[#6161CE]">
                {kakaoUser.kakaoUserId && kakaoUser.nickname}
                </strong>의 
              <br/>일정 한눈에 보기
            </h1>
            {/* button-group */}
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
                  flex  items-center gap-4 outline-none
                  ">
                  <Bell size={24}/>
                  <Toggle isToggled={true}/>
                </button>
            </div>
          </header>
  )
}
