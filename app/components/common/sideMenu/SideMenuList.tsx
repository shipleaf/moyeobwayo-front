'use client'

import { FileText } from '@phosphor-icons/react'
import { House, Users } from '@phosphor-icons/react/dist/ssr'
import React, { useEffect, useState } from 'react'
import MenuBar from './MenuBar'
import { Party, getMeetList } from "@/app/api/getMeetListAPI";
import { usePathname, useRouter, useSearchParams} from 'next/navigation'
import { MobileHeaderProps } from '../MobileHeader'
import MeetBar from './MeetBar'

interface SideMenuList{
  endPoint:MobileHeaderProps["endpoint"];
  isMeetList?:boolean;
  kakaoUserId?:number;
}

export default function SideMenuList({ 
  kakaoUserId,
  endPoint
}:SideMenuList) {
  const router = useRouter();

  const [meetList, setMeetList] = useState<Party[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const pathName = usePathname();
  const searchParams = useSearchParams(); // useSearchParams 추가
  const partyId = searchParams.get('partyId'); // 특정 파라미터 가져오기
  const fetchMeetList = async () => {
    try {
      setIsLoading(true)
        if (kakaoUserId && pathName === '/meetlist') {
          // kakaoUserId가 있을 때만 getMeetList 호출
          const response = await getMeetList({ kakaoUserId });
          setMeetList(response.parties);

          // 첫 번째 파티로 라우터 이동 (partyId 추가)
          if (response.parties && response.parties.length > 0) {
            console.log('순서가? ', response.parties)
            if (!partyId){
              const firstPartyId =
                response.parties[0].partyId;
              if (typeof window !== "undefined") {
                router.push(`/meetlist?partyId=${firstPartyId}`);
              }
            }
          }
        }
    } catch (error) {
      console.error("Error fetching meet list:", error);
    } finally{
      setIsLoading(false)
    }
  };
  useEffect(() => {
    // IIFE 사용
    (async () => {
      await fetchMeetList();
    })();
  }, [pathName, kakaoUserId]); // pathName 변경 시 실행
  
  const handleMenuClick = (menu:MobileHeaderProps["endpoint"]) =>{
    if (menu === "home"){
      router.push("/")
    }
    if (menu === "meetlist"){
      router.push("/meetlist")
    }
    
  }
  const handleMeetClick = (meetId:string) =>{
    router.push(`/meetlist?partyId=${meetId}`)
  }
  console.log('처음거가 왜 밑에 깔리지?', meetList)
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
        focus={endPoint === "home"}
        onClick={() => handleMenuClick('home')}
      />
      <MenuBar
        menuName="미팅 리스트"
        Icon={FileText}
        focus={endPoint === "meetlist"}
        onClick={() => handleMenuClick('meetlist')}
        toggle
      />
      {[...meetList].reverse().map((meet) => {
        return (
          <MeetBar
            key={meet.partyId}
            menuName={meet.partyName}
            Icon={Users}
            focus={partyId == meet.partyId}
            onClick={() => {
              handleMeetClick(meet.partyId);
            }}
            descision={meet.decisionDate}
            partyId={meet.partyId}
          />
        );
      })}
    </div>
  )
}
