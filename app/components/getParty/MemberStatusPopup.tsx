import { CalendarBlank, Clock } from '@phosphor-icons/react/dist/ssr';
import React from 'react'
import AvatarList from './AvatarList';
import { VotedUser } from '../createParty/TimeTable';

interface MemberStatusPopupProps {
  time?: string;
  binaryTimeString?: string;
  possibleNum?: number;
  maxNum?: number;
  avatarSources?: string[];
  targetDate?: Date;
  maxVotes?:number
  votes?:number
  votedUsersData?:VotedUser[];
}

const parseTimeWithEnd = (time: string): { startTime: string; endTime: string } => {
  // time 형식: "SUN 10 11:30"
  const timeParts = time.split(' ');
  const startTimeStr = timeParts[2]; // "11:30" 추출
  
  const [hour, minute] = startTimeStr.split(':').map(Number); // 시간과 분을 숫자로 변환
  const startDate = new Date();
  startDate.setHours(hour, minute);

  // 종료 시간 계산 (시작 시간에 30분 추가)
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30분 후 시간

  // 시작 및 종료 시간 형식을 HH:MM AM/PM 형식으로 변환
  const formattedStartTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const formattedEndTime = endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return { startTime: formattedStartTime, endTime: formattedEndTime };
};
const formatKoreanDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
export default function MemberStatusPopup({
  time, 
  targetDate, 
  maxVotes,
  votedUsersData,
  votes
}:MemberStatusPopupProps) {
  // target Date가 한국 표준시 기준인데... 여기서 2024년 10월 15일 이런format으로 바꿔주는 함수좀 알려줘
  const { startTime, endTime } = time ? parseTimeWithEnd(time) : { startTime: '', endTime: '' };
  const formattedDate = targetDate ? formatKoreanDate(targetDate) : '';
  const maxUsers =  maxVotes?  `${maxVotes}` : '?'
  const currentUsers =  votes !== undefined ?  `${votes}` : '?'
  const finalVotedUsersData = votedUsersData? votedUsersData : [];
  return (
    <div className='py-[15px] px-6 bg-white bg-opacity-80 absolute z-10 w-[240px] rounded-[6px]'>
      <h1 className='text-[24px] font-bold mb-5'>
        <strong className='text-[#6161CE]'>인원</strong> 확인하기
      </h1>
      
      <p className="font-semibold text-[14px] mb-1">
        시간 {formattedDate && ` ${formattedDate}`}
      </p>
      <div className='py-1 px-2 border-[0.4px] border-[#79747E] 
        bg-[#f9f9f9] rounded-[5px] flex justify-between'>
        {formattedDate}
        <CalendarBlank size={22} color={'#79747E'}/>
      </div>
      
      <div className='flex justify-between mt-4'>
        <div className='w-1/2'>
          <p className='text-[14px] font-semibold'>시작</p>
          <div className='w-[95%] py-1 px-1 border-[0.4px] border-[#79747E] 
            bg-[#f9f9f9] rounded-[5px] flex items-center justify-between text-[12px]'>
            {startTime}
            <Clock size={20} color={'#79747E'}/>
          </div>
        </div>
        <div className='w-1/2'>
          <p className='text-[14px] font-semibold'>종료</p>
          <div className='w-[95%] py-1 px-1 border-[0.4px] border-[#79747E] 
            bg-[#f9f9f9] rounded-[5px] flex items-center justify-between text-[12px]'>
            {endTime}
            <Clock size={20} color={'#79747E'}/>
          </div>
        </div>
      </div>
      <p className='font-semibold text-[14px] mb-1'>{currentUsers}/{maxUsers} 명</p>
      <AvatarList votedUsers={finalVotedUsersData}/>
    </div>
  )
}