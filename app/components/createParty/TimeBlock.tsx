import React, { useState } from 'react';
import MemberStatusPopup from '../getParty/MemberStatusPopup';
import { VotedUser } from './TimeTable';
interface TimeBlockProps {
  time: string;
  style?: React.CSSProperties;
  className?: string;
  startTime?: Date
  targetDate?: Date
  hourlyLabels?: string
  dateLength?: number  // timeSlot의 길이임
  slotIndex?: number
  dayLength?: number
  dayIndex?:number
  maxVotes? : number
  votes? : number
  votedUsersData?:VotedUser[] 
}

const TimeBlock: React.FC<TimeBlockProps> = ({
  time,
  style,
  className,
  targetDate,
  slotIndex,
  dateLength,
  maxVotes,
  votes,
  votedUsersData,
  dayIndex,
  dayLength
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const popupTopPosition = slotIndex && dateLength && dateLength - slotIndex <= 5 ? '-500%' : '10%';
  const popupSidePosition = dayIndex && dayLength &&  dayLength - dayIndex <= 2 ? '-240px' : '0' 
  return (
    <div
      style={{
        ...style,
        position: 'relative', // 팝업 위치를 조정하기 위해 필요
      }}
      className={`${className} p-[5px] border border-solid border-[#EBEBEB] box-border`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        // slotIndex와 dateLength의 차이가 6이하라면 top + 100%로 되게 해줘
        <div
        style={{
          position: 'absolute',
          top: popupTopPosition,
          left: popupSidePosition,
          pointerEvents: 'none',
        }}
      >
        <MemberStatusPopup 
          time={time}
          targetDate={targetDate}
          maxVotes={maxVotes}
          votes={votes}
          votedUsersData={votedUsersData}
        />
      </div>
      )}
    </div>
  );
};

export default TimeBlock;