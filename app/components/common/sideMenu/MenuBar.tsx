import React from 'react'
// import { FileText } from '@phosphor-icons/react'
import { CaretRight} from '@phosphor-icons/react/dist/ssr'
// import { CaretRight, House, Users } from '@phosphor-icons/react/dist/ssr'
interface MenuBarProps{
  Icon: React.ElementType;
  menuName: string
  focus?: boolean;
  toggle?: boolean;
  onClick?: () => void;
}
export default function MenuBar({Icon, menuName, focus, toggle, onClick}:MenuBarProps) {
  return (
    <div className={`flex py-[18px] px-3 gap-1.5 text-[18px] text-[#6C7072] font-semibold items-center rounded-[5px]
    `}
    onClick={onClick}
    style={
      focus
        ? {
            borderWidth: "1px",
            borderColor: "var(--mo-50, #6161CE)",
            background: "rgba(97, 97, 206, 0.10)",
            // Uncomment if you want to use blur effect
            // backdropFilter: 'blur(48px)',
          }
        : {
            borderColor: "transparent",
          }
    }
    >
      <Icon color="#6C7072" weight="bold" size={24}/>
      <span>{menuName}</span>
      {toggle && (
        <CaretRight
          size={16}
          color="#6C7072"
          weight="bold"
          className={`transition-transform ${
            focus ? "rotate-90" : ""
          } ml-auto`}
        />
      )}
    </div>
  )
}
