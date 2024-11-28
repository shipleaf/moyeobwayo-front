import React, { useEffect, useState } from 'react'
interface MenuBarProps{
  Icon: React.ElementType;
  menuName: string
  focus?: boolean;
  toggle?: boolean;
  descision?: boolean;
  partyId: string;
  onClick?: () => void;
}
export default function MeetBar({Icon, 
  menuName, 
  focus, 
  onClick, 
  descision,
  partyId
}:MenuBarProps) {
  const [timeDiff, setTimeDiff] = useState<string>("");

  useEffect(() => {
    if (partyId) {
      const dateString = partyId.slice(0, 8); // partyId에서 첫 8자리 (날짜 부분) 추출
      const partyDate = new Date(
        `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`
      ); // YYYY-MM-DD 형식으로 변환
      const now = new Date();
      
      // 시간 차이 계산
      const diffTime = now.getTime() - partyDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24)); // 일 단위로 차이 계산

      if (diffDays === 0) {
        setTimeDiff("오늘");
      } else if (diffDays > 0) {
        setTimeDiff(`${diffDays}일 전`);
      } else {
        setTimeDiff(`${Math.abs(diffDays)}일 후`);
      }
    }
  }, [partyId]);
  return (
    <div className={`flex py-[18px] px-3 gap-1.5 text-[18px] text-[#6C7072] font-semibold items-center rounded-[5px]
    `}
    onClick={onClick}
    style={
      focus
        ? {
            borderWidth: "1px",
            borderColor: "var(--mo-50, #ECECEC)",
            background: "#ECECEC"
            // Uncomment if you want to use blur effect
            // backdropFilter: 'blur(48px)',
          }
        : {
            borderColor: "transparent",
          }
    }
    >
      <Icon color="#6C7072" weight="bold" size={24}/>
      <span className="w-[62%] overflow-hidden text-ellipsis whitespace-nowrap">
        {menuName}
      </span>
      <div className='ml-auto flex flex-col gap-[6px] items-center text-[10px]'>
        <div
          className='bg-[#6161CE] text-white font-semibold  px-1.5 p-0.5 rounded-lg'
          style={{
            opacity:
              descision ? "1" : "0"
          }}
        >
          확정
        </div>
        <div>{timeDiff}</div>
      </div>
    </div>
  )
}