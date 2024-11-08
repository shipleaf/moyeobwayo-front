import { CalendarBlank, Clock } from '@phosphor-icons/react/dist/ssr';
import React from 'react'
import AvatarList from './AvatarList';

interface MemberStatusPopupProps {
  time: Date;
  binaryTimeString: string;
  possibleNum: number;
  maxNum: number;
  avatarSources: string[];
}
const possibleUsers:string[] = [
  '규성',
  '시현',
  '형석'
]
const dummyAvatarList:string[] = [
  '/images/sample_avatar1.png',
  '/images/sample_avatar2.png',
  '/images/sample_avatar3.png',
]
export default function MemberStatusPopup() {
  return (
    <div className='py-[15px] px-6 bg-white bg-opacity-80 absolute z-10 w-[240px] rounded-[6px]'>
      <h1 className='text-[24px] font-bold mb-5'>
        <strong className='text-[#6161CE]'>인원</strong> 확인하기
      </h1>
      
      <p className='font-semibold text-[14px] mb-1'>시간</p>
      <div className='py-1 px-2 border-[0.4px] border-[#79747E] 
        bg-[#f9f9f9] rounded-[5px] flex justify-between'>
        2024년 10월 15일
        <CalendarBlank size={22} color={'#79747E'}/>
      </div>
      
      <div className='flex justify-between mt-4'>
        <div className='w-1/2'>
          <p className='text-[14px] font-semibold'>시작</p>
          <div className='w-[95%] py-1 px-1 border-[0.4px] border-[#79747E] 
            bg-[#f9f9f9] rounded-[5px] flex items-center justify-between text-[12px]'>
            10:00 AM
            <Clock size={20} color={'#79747E'}/>
          </div>
        </div>
        <div className='w-1/2'>
          <p className='text-[14px] font-semibold'>종료</p>
          <div className='w-[95%] py-1 px-1 border-[0.4px] border-[#79747E] 
            bg-[#f9f9f9] rounded-[5px] flex items-center justify-between text-[12px]'>
            10:00 AM
            <Clock size={20} color={'#79747E'}/>
          </div>
        </div>
      </div>

      <p className='font-semibold text-[14px] mb-1'>2/5 명</p>
      <AvatarList possibleUsers={possibleUsers} srcList={dummyAvatarList}/>
    </div>
  )
}