import React, { useState } from 'react';
import MemberStatusPopup from '../getParty/MemberStatusPopup';

interface TimeBlockProps {
  time: string;
  style?: React.CSSProperties;
  className?: string;
  startTime?: Date
  targetDate?: Date
  hourlyLabels?: string
  slotIndex?: number
  dateLength?: number
  maxVotes? : number
}

const TimeBlock: React.FC<TimeBlockProps> = ({
  time,
  style,
  className,
  startTime = new Date(), // 기본값으로 현재 시간을 설정
  targetDate,
  hourlyLabels = '',
  slotIndex,
  dateLength,
  maxVotes
}) => {
  const [isHovered, setIsHovered] = useState(false);
  console.log('rbrbrbr', dateLength, slotIndex)
  const popupTopPosition = slotIndex && dateLength && dateLength - slotIndex <= 5 ? '-500%' : '10%';
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
          left: '0',
          pointerEvents: 'none',
        }}
      >
        <MemberStatusPopup 
          time={time}
          targetDate={targetDate}
          maxVotes={maxVotes}
        />
      </div>
      )}
    </div>
  );
};

export default TimeBlock;