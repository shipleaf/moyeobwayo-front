'use client'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import {
  kakaoIDState,
} from "@/app/recoil/atom"; // 당신의 recoil 상태 파일을 불러옵니다.
import { getMeetList } from '@/app/api/getMeetListAPI';
import { Party } from '@/app/api/getMeetListAPI';
import { useRouter } from 'next/navigation';
export default function MeetList() {
  const kakaoID = useRecoilValue(kakaoIDState); // kakaoID는 number 타입으로 인식됨
  const [parties, setParties] = useState<Party[]>([])
  const router = useRouter();
  useEffect(() => {
    const fetchMeetList = async () => {
      try {
        const response = await getMeetList({ kakaoUserId: kakaoID });
        setParties(response.parties)
        
        if (response.parties && response.parties.length > 0) {
          const firstPartyId = response.parties[0].partyId;
          // 클라이언트에서만 router를 사용할 수 있으므로 이 부분을 클라이언트 전용으로 처리
          if (typeof window !== 'undefined') {
            router.push(`/meetlist?partyId=${firstPartyId}`); // 경로와 쿼리 파라미터 추가
          }
        }
      } catch (error) {
        
      }
    };

    fetchMeetList();
  }, [kakaoID]); // kakaoID가 변경될 때마다 호출
  return (
    <section className='w-full'>
  {parties?.map((meet, idx) => {
    const date = new Date(meet.start_date); // meet 객체에 dateString 속성이 있다고 가정
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줌
    const diffTimeStartDate = date.getTime() - date.getTime(); // 시간 차이를 밀리초 단위로 계산
    const diffDaysStartDate = Math.ceil(diffTimeStartDate / (1000 * 60 * 60 * 24)); // 차이를 일 단위로 변환
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // 2자리로 맞추기
    // 시간 차이에 따라 n일 전, n일 후를 설정
    let TimeLabel = diffDaysStartDate > 0 ? `${diffDaysStartDate}일 후` : `${Math.abs(diffDaysStartDate)}일 전`;
    // 확정상태라면 확정 timeLabel계산
    if (meet.decision_date !== null){
      const descisionDate = new Date(meet.decision_date)
      const diffTimeDescisionDate = descisionDate.getTime() - descisionDate.getTime(); // 시간 차이를 밀리초 단위로 계산
      const diffDaysDescisionDate = Math.ceil(diffTimeDescisionDate / (1000 * 60 * 60 * 24)); // 차이를 일 단위로 변환
      TimeLabel = diffDaysDescisionDate > 0 ? `${diffDaysDescisionDate}일 후` : `${Math.abs(diffDaysDescisionDate)}일 전`;

    }
    return (
      <div key={idx} className='border p-4 mb-2.5 rounded-[5px] shadow-md'>
        <header className='flex justify-between items-center'>
          <h1 className='text-[16px] font-normal mb-2'>{meet.party_name}</h1>
          <p className='text-[14px] font-medium'>{TimeLabel}</p>
        </header>
        <div className='flex justify-between'>
          <p className='text-[#8E8E8E]'>
          {`${month}월 ${day}일 ${hours}:${minutes} ~`}
          </p>
          {true && 
            <div className='bg-[#6161CE] rounded-[50px] py-[3px] px-[9px] 
              text-white font-semibold text-[12px]'>
              확정
            </div>
          }
        </div>
      </div>
    );
  })}
</section>
  )
}
