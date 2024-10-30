"use client";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { selectedAvatarState } from "../recoil/atom";

const users = [
  { id: 1, username: "제시카", profileImage: "" },
  { id: 2, username: "존", profileImage: "" },
  { id: 3, username: "사라", profileImage: "" },
];

export default function SampleAvatarList() {
  const [selectedAvatar, setSelectedAvatar] = useRecoilState(selectedAvatarState);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 선택 초기화 함수
  const resetSelection = () => setSelectedAvatar(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        resetSelection();
      }
    };
  
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resetSelection();
      }
    };
  
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscKey);
  
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-col mt-8">
      {users.map((user, index) => (
        <div
          key={user.id}
          onClick={() => setSelectedAvatar(user)} // 아바타 클릭 시 상태 업데이트
          className={`relative w-[80px] h-[80px] rounded-full flex items-center justify-center cursor-pointer p-0 m-0 ${
            selectedAvatar?.id === user.id ? "ring-4 ring-blue-500" : ""
          }`} // 선택된 아바타에 스타일 추가
          style={{
            top: `${index * -45}px`,
            zIndex: 10 + index,
          }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            {user.profileImage !== null ? (
              <Image
                src={`/images/sample_avatar${index + 1}.png`}
                alt={user.username}
                width={79}
                height={79}
                className="rounded-full"
              />
            ) : (
              <UserCircle size={80} className="text-[#ced4da]" />
            )}
            <div className="inset-0 rounded-full bg-[#6161CE] backdrop-blur-[2px]"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
