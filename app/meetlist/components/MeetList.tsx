'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getMeetList } from '@/app/api/getMeetListAPI';
import { Party } from '@/app/api/getMeetListAPI';
import { loadFromLocalStorage } from '@/app/recoil/recoilUtils';
import { decodeJWT } from '@/app/utils/jwtUtils';

export default function MeetList() {
  const searchParams = useSearchParams();
  const currentPartyId: string | null = searchParams.get('partyId');
  const [parties, setParties] = useState<Party[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMeetList = async () => {
      try {
        // 로컬스토리지에서 jwt를 가져오고 디코딩하는 과정
        const jwt = await loadFromLocalStorage("kakaoUserJWT");
        if (jwt) {
          const kakaoData = decodeJWT(jwt);
          const kakaoUserId = kakaoData?.kakao_user_id as number;

          if (kakaoUserId) {
            // kakaoUserId가 있을 때만 getMeetList 호출
            const response = await getMeetList({ kakaoUserId });
            setParties(response.parties);

            // 첫 번째 파티로 라우터 이동 (partyId 추가)
            if (response.parties && response.parties.length > 0) {
              const firstPartyId = response.parties[0].partyId;
              if (typeof window !== 'undefined') {
                router.push(`/meetlist?partyId=${firstPartyId}`);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching meet list:", error);
      }
    };

    fetchMeetList();
  }, []); // 빈 배열을 의존성으로 사용하여 컴포넌트가 처음 마운트될 때 한 번만 실행

  const handlePartyClick = (partyId: string) => {
    router.push(`/meetlist?partyId=${partyId}`);
  };

  return (
    <section className='w-full'>
      {/* parties가 존재하고 배열이 비어있지 않을 경우에만 map을 실행 */}
      {parties.length > 0 ? (
        parties.map((meet, idx) => {
          const partyID = meet.partyId;
          const date = new Date(meet.startDate);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const hours = date.getHours();
          const minutes = date.getMinutes().toString().padStart(2, '0');

          let TimeLabel = `${month}월 ${day}일 ${hours}:${minutes}`;

          // // 확정 상태의 TimeLabel 계산
          // if (meet.decisionDate !== null && meet.decisionDate === true) {
          //   const decisionDate = new Date(meet.decisionDate);
          //   TimeLabel += ` (확정: ${decisionDate.toLocaleDateString()})`;
          // }

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
                <h1 className='text-[16px] font-normal mb-2'>{meet.partyName}</h1>
                <p className='text-[14px] font-medium'>모임 날짜: {TimeLabel}</p>
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
        <p>현재 참여 가능한 파티가 없습니다.</p> // parties가 없을 때 대체 텍스트 표시
      )}
    </section>
  );
}
