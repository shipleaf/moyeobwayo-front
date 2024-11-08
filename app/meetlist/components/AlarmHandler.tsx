import { Bell, BellSimpleSlash } from '@phosphor-icons/react/dist/ssr'
import React from 'react'
import Toggle from './Toggle'

interface AlarmHandlerProps{
  alarm: boolean
  setAlarm: React.Dispatch<React.SetStateAction<boolean>>
}
export default function AlarmHandler({alarm, setAlarm}:AlarmHandlerProps) {
  return (
    <button className="text-[#5F5F5F] text-[16px] font-semibold py-[9px] px-4
      border-[1px] border-[#D7D7D7] rounded-[50px]
      flex  items-center gap-4 outline-none">
        
      {alarm? (<Bell size={24} />):(<BellSimpleSlash size={24}/>)}
      <Toggle isToggled={alarm} setAlarm={setAlarm} />
    </button>
  )
}
