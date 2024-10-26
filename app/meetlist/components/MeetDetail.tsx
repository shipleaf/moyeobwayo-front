'use client'
import React, { useEffect, useState } from 'react'
import { PartyDate, AvailableTime } from "@/app/interfaces/Party"
import { CheckFat } from '@phosphor-icons/react/dist/ssr';
import { useSearchParams } from 'next/navigation'; // useRouter를 가져옵니다
import TimeTable from './TimeTable';
import {getTable, Party, AvailableTimesResponse} from '@/app/api/getTableAPI'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
// Dummies
export const availableTimes: AvailableTime[] = [
  {
    start: "2024-10-16T09:00:00",
    end: "2024-10-16T10:00:00",
    users: ["김선엽", "이수민", "박지훈"]
  },
  {
    start: "2024-10-16T11:00:00",
    end: "2024-10-16T12:00:00",
    users: ["정은지", "최현우", "김선엽"]
  },
  {
    start: "2024-10-16T14:00:00",
    end: "2024-10-16T15:00:00",
    users: ["박지훈", "이수민", "김나영", "김나영", "김나영", "김나영"
    ]
  },
  {
    start: "2024-10-16T16:30:00",
    end: "2024-10-16T17:30:00",
    users: ["김선엽", "최현우"]
  },
  {
    start: "2024-10-16T18:00:00",
    end: "2024-10-16T19:00:00",
    users: ["정은지", "박지훈", "이수민"]
  },
  {
    start: "2024-10-16T18:00:00",
    end: "2024-10-16T19:00:00",
    users: ["정은지", "박지훈", "이수민"]
  }
];

export interface timeRange{
  startTime:string,
  endTime:string
}
const MeetDetail = () => {
  const searchParams = useSearchParams(); // 검색 파라미터 가져오기
  const table_id = searchParams.get('partyId'); // table_id 가져오기
  const [targetMeet, setTargetMeet] = useState<Party | null>(null); // 상태 초기화
  const [avariableTime, setAvariableTime] = useState<AvailableTimesResponse[] | null>(null)
  const [timeblocks, setTimeblocks] = useState<PartyDate[] | null>(null);
  const [currentNum, setCurrentNum] = useState<number | null>(null);
  const [partyRange, setPartyRange] = useState<timeRange | null>(null);
  useEffect(() => {
    const fetchMeetDetail = async () => {
      if (table_id) { // table_id가 존재할 경우에만 호출
        try {
          const response = await getTable({ table_id: table_id }); // API 호출
          setTargetMeet(response.party); // API로부터 받은 데이터로 상태 업데이트
          setAvariableTime(response.availableTimes)
          setTimeblocks(response.party.dates)
          setCurrentNum(response.party.currentNum)
          setPartyRange({
            startTime: response.party.startDate,
            endTime: response.party.endDate
          });
        } catch (error) {
          console.error('Failed to fetch table detail:', error); // 에러 처리
        }
      }
    };

    fetchMeetDetail(); // 비동기 함수 호출
  }, [table_id]); // table_id가 변경될 때마다 호출
  if (!targetMeet) {
    return (
      <div className='absolute top-[25vh] left-[10vw]'> {/* 부모 요소에 relative 추가 */}
        <div className=' flex gap-4 justify-center'> {/* absolute와 transform으로 중앙 정렬 */}
          <Image
            width={120}
            height={120}
            alt='그레이 로고'
            src="/images/logo_gray.png"
          />
          <MagnifyingGlass color='#777' size={96} weight="duotone" style={{ marginLeft: '10px', marginTop: '25px' }}/>
        </div>
        <div className=''> {/* 텍스트 중앙 정렬 */}
          <span className='text-[#777] text-[50px] font-bold'>
            No Result Found
          </span>
        </div>
      </div>
    );
  }

  const date = new Date(targetMeet.startDate); // meet 객체에 dateString 속성이 있다고 가정
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줌
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // 2자리로 맞추기
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = dayNames[date.getDay()]; // getDay()는 0~6 사이의 값을 반환함
  return (
    <div>
      {/* HEADER */}
      <div
        className='w-full py-[18px] px-5 mb-2.5 text-[#5E5E5E] text-[14px] font-normal rounded-[5px] border border-solid'
        style={{
          borderColor: 'var(--mo-50, #6161CE)',
          background: 'rgba(97, 97, 206, 0.10)',
          boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
          // backdropFilter: 'blur(48px)',
        }}
      >
        <p className='text-[#5E5E5E] text-[14px] font-normal'
        >
          {targetMeet.targetNum}명 중 {targetMeet.currentNum}명
        </p>
        <h3 className='mb-[5px] text-[22px] text-[#2D2D2D] font-semibold'>{targetMeet.partyName}</h3>
        <div className='flex justify-between items-center'>
          <p className='text-[#5E5E5E] text-[16px] font-normal'>
            {month}월 {day}일 ({dayOfWeek}) {hours}:{minutes} ~
          </p>
          {/* Button */}
          <button
            className='py-[7px] px-4 text-white rounded-[50px] font-bold bg-[var(--mo-50,#6161CE)] hover:bg-[#4949A0]'
          >
            보러 가기
          </button>
          
        </div>
      </div>
      <div className="flex gap-4">
        {/* TimeTable */}
        <section className='w-2/3 max-h-[61vh] overflow-auto bg-[#F7F7F7] py-3 px-2 rounded-[10px]'>
          <TimeTable 
            timeblocks={timeblocks} 
            currentNum={currentNum}
            partyRange={partyRange}
            ></TimeTable>
        </section>
        {/* Candidate */}
        <section className='w-1/3 max-h-[61vh] overflow-auto'>
          {avariableTime?.map((candi, idx) =>{
            const people = candi.users;
            const date = new Date(candi.start);
            const endDate = new Date(candi.end);
            const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줌
            const day = date.getDate();
            const hours = date.getHours();
            const endHours = endDate.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0'); // 2자리로 맞추기
            const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
            const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
            const dayOfWeek = dayNames[date.getDay()]; // getDay()는 0~6 사이의 값을 반환함
            return(
              <div 
                className='py-[13px] px-[15px] flex flex-col gap-2 bg-[#fff] mb-[18px] shadow-md border rounded-lg'
                // style={{
                //   boxShadow: '-4px 0px 6px 0px rgba(0, 0, 0, 0.15)', // 왼쪽 그림자를 위해 X 축 값을 음수로 설정
                //   backdropFilter: 'blur(42.5px)',
                // }}
              >
                <h3 className='text-black text-[16px] font-semibold'>
                  {idx+1}. {month}월 {day}일 ({dayOfWeek}) {hours}:{minutes} ~ {endHours}:{endMinutes}
                  </h3>
                <div className='flex gap-[3px] items-center'>
                  <div className='w-[14px] h-[14px] bg-[#6161CE] rounded-full flex justify-center items-center'>
                    <CheckFat size={10} weight='fill' color='white' />
                  </div>
                  <p className='text-black text-[15px] font-medium'>가능인원</p>
                </div>
                <div className='flex flex-wrap gap-1.5'>
                  {people.map(user=>{
                    return(
                      <div className='py-1.5 px-[14px] text-[#474747] text-[15px] font-medium rounded-lg'
                        style={{
                          boxShadow: '0px 0px 2px 0px rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        {user}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>
      </div>


    </div>
  )
}

export default MeetDetail;

