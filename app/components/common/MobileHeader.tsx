'use client'

import { List } from '@phosphor-icons/react/dist/ssr'
import React, { useState } from 'react'
import { kakaoUserState } from '@/app/recoil/atom'
import { useRecoilState } from 'recoil';
import AvatarSmall from './AvatarSmall';
import SideMenu from './sideMenu/SideMenu';

export interface MobileHeaderProps {
  endpoint: "home" | "meeting" | "meetlist"; // 정해진 문자열 값 중 하나
}
export default function MobileHeader({endpoint}:MobileHeaderProps) {
  const [globalKakaoLoginState, ] = useRecoilState(kakaoUserState);
  const userName = globalKakaoLoginState.nickname !== "" ? globalKakaoLoginState.nickname : ""
  const avatarSrc = globalKakaoLoginState.profile_image !== "" ? globalKakaoLoginState.profile_image : ""
  const kakaoUserId = globalKakaoLoginState.kakaoUserId !== null ? globalKakaoLoginState.kakaoUserId : undefined
  const [isSideOpen, setIsSideOpen] = useState<boolean>(endpoint === "meetlist")

  const closeSideMenu = () =>{
    setIsSideOpen(false)
  }
  const openSideMenu = () =>{
    setIsSideOpen(true)
  }
  return (
    <section className='w-full flex min-[740px]:hidden my-[30px] items-center'>
      <SideMenu 
        endPoint={endpoint} 
        isOpen={isSideOpen} 
        onClose={closeSideMenu} 
        userName={userName} userProfile={avatarSrc} kakaoUserId={kakaoUserId} />
      {/* List BTN */}
      <div className='mr-2'
        onClick={openSideMenu}
      >
        <List size={32} color="#6161CE" weight="bold" />
      </div>

      <p className='text-[#6161CE] font-extrabold text-[20px]'>
        모여봐요
      </p>

      {/* user login start */}
      <div className='flex gap-1 flex-grow justify-end items-center'>
        <AvatarSmall src={avatarSrc} />
        <p className='font-extrabold text-[12px]'>
          <strong className='font-extrabold'>{userName}</strong>
          님</p>

      </div>

    </section>
  )
}
