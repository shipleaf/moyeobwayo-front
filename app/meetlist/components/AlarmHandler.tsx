import React from 'react';
import Toggle from './Toggle'; // Toggle 컴포넌트 import 경로는 프로젝트 구조에 맞게 조정하세요.
import { Bell, BellSimpleSlash } from '@phosphor-icons/react/dist/ssr';

interface AlarmHandlerProps {
  alarm: boolean;
  alarmID: number | null;
  setAlarm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AlarmHandler({ alarm, alarmID, setAlarm }: AlarmHandlerProps) {
  const handleAlarmToggle = async () => {
    if (alarmID === null) return;

    // const res = await setServerAlarmState(alarmID, !alarm); // 서버 상태 변경 호출

    setAlarm(prevAlarm => !prevAlarm); // 상태 반전
  };

  return (
    <button className="text-[#5F5F5F] text-[16px] font-semibold py-[9px] px-4
      border-[1px] border-[#D7D7D7] rounded-[50px]
      flex items-center gap-4 outline-none"
    >
      {alarm ? <Bell size={24} /> : <BellSimpleSlash size={24} />}
      <Toggle isToggled={alarm} handleAlarmToggle={handleAlarmToggle} />
    </button>
  );
}