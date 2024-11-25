'use client'

import { FileText } from '@phosphor-icons/react'
import { House } from '@phosphor-icons/react/dist/ssr'
// import { House, Users } from '@phosphor-icons/react/dist/ssr'
import React, { useState } from 'react'
import MenuBar from './MenuBar'
import { Party, getMeetList } from "@/app/api/getMeetListAPI";
import { useRouter } from 'next/navigation'

interface SideMenuList{
  isMeetList?:boolean
  kakaoUserId?:number
}
type FocusMenu = 'home' | 'meetlist';

export default function SideMenuList({ kakaoUserId}:SideMenuList) {
  const router = useRouter();

  const [focusMenu, setFocusMenu] = useState<FocusMenu>('home');
  const [meetList, setMeetList] = useState<Party[]>([])
  const [isLoading, setIsLoading] = useState(false)
  console.log(meetList)
  const fetchMeetList = async () => {
    try {
      setIsLoading(true)
        if (kakaoUserId) {
          // kakaoUserId가 있을 때만 getMeetList 호출
          const response = await getMeetList({ kakaoUserId });
          setMeetList(response.parties);

          // 첫 번째 파티로 라우터 이동 (partyId 추가)
          if (response.parties && response.parties.length > 0) {
            const firstPartyId =
              response.parties[response.parties.length - 1].partyId;
            if (typeof window !== "undefined") {
              router.push(`/meetlist?partyId=${firstPartyId}`);
            }
          }
        }
    } catch (error) {
      console.error("Error fetching meet list:", error);
    } finally{
      setIsLoading(false)
    }
  };
  const handleMenuClick = async(menu: FocusMenu) => {
    if (menu === "meetlist" && focusMenu === "home"){
      await fetchMeetList();
    }
    setFocusMenu(menu);

  };
  return (
    <div className="flex flex-col gap-1 w-full">
        {isLoading && (
          <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'>
            <div className='flex flex-col items-center'>
              <div className="loader"></div>
              <p className="mt-4 text-lg">로딩 중입니다...</p>
            </div>
          </div>
        )}
        <MenuBar
          menuName="홈"
          Icon={House}
          focus={focusMenu === 'home'}
          onClick={() => handleMenuClick('home')}
        />
      <MenuBar
        menuName="미팅 리스트"
        Icon={FileText}
        focus={focusMenu === 'meetlist'}
        onClick={() => handleMenuClick('meetlist')}
        toggle
      />
    </div>
  )
}
