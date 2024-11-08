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
}

const TimeBlock: React.FC<TimeBlockProps> = ({time, style, className }) => {
  const [isHovered, setIsHovered] = useState(false);

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
        <div style={{ position: 'absolute', top: '10%', left: '0', pointerEvents: 'none' }}>
          <MemberStatusPopup />
        </div>
      )}
    </div>
  );
};

export default TimeBlock;