'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import {
  kakaoIDState,
} from "@/app/recoil/atom"; // 당신의 recoil 상태 파일을 불러옵니다.
import { getMeetList } from '@/app/api/getMeetListAPI';
import { Party } from '@/app/api/getMeetListAPI';
import { useRouter } from 'next/navigation';
export default function MeetList() {
  
  const kakaoID = useRecoilValue(kakaoIDState); // kakaoID는 number 타입으로 인식됨
  const searchParams = useSearchParams();
  const currentPartyId: string | null = searchParams.get('partyId');

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
  const handlePartyClick = (partyId: string) => {
    router.push(`/meetlist?partyId=${partyId}`);
  };
  return (
    <section className='w-full'>
      {/* parties가 존재하고 배열이 비어있지 않을 경우에만 map을 실행 */}
      {parties.length > 0 ? (
        parties.map((meet, idx) => {
          const partyID = meet.partyId;
          const date = new Date(meet.start_date);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const hours = date.getHours();
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const diffTimeStartDate = date.getTime() - date.getTime();
          const diffDaysStartDate = Math.ceil(diffTimeStartDate / (1000 * 60 * 60 * 24));
  
          // 시간 차이에 따라 n일 전, n일 후를 설정
          let TimeLabel = diffDaysStartDate > 0 ? `${diffDaysStartDate}일 후` : `${Math.abs(diffDaysStartDate)}일 전`;
  
          // 확정 상태의 timeLabel 계산
          if (meet.decision_date !== null) {
            const decisionDate = new Date(meet.decision_date);
            const diffTimeDecisionDate = decisionDate.getTime() - decisionDate.getTime();
            const diffDaysDecisionDate = Math.ceil(diffTimeDecisionDate / (1000 * 60 * 60 * 24));
            TimeLabel = diffDaysDecisionDate > 0 ? `${diffDaysDecisionDate}일 후` : `${Math.abs(diffDaysDecisionDate)}일 전`;
          }
  
          return (
            <div
              key={idx}
              className='border p-4 mb-2.5 rounded-[5px] shadow-md cursor-pointer'
              onClick={() => handlePartyClick(partyID)} // 클릭 시 해당 파티 ID로 URL 쿼리 변경
              style={
                partyID === String(currentPartyId)
                  ? {
                      borderColor: 'var(--mo-50, #6161CE)',
                      background: 'rgba(97, 97, 206, 0.10)',
                      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
                    }
                  : {}
              }
            >
              <header className='flex justify-between items-center'>
                <h1 className='text-[16px] font-normal mb-2'>{meet.party_name}</h1>
                <p className='text-[14px] font-medium'>{TimeLabel}</p>
              </header>
              <div className='flex justify-between'>
                <p className='text-[#8E8E8E]'>
                  {`${month}월 ${day}일 ${hours}:${minutes} ~`}
                </p>
                <div className='bg-[#6161CE] rounded-[50px] py-[3px] px-[9px] text-white font-semibold text-[12px]'>
                  확정
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No parties available.</p> // parties가 없을 때 대체 텍스트 표시
      )}
    </section>
  );
}
