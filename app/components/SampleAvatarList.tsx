'use client';
import { UserCircle } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import React from 'react';

const users = [
  { id: 1, username: "제시카", profileImage: "" },
  { id: 2, username: "존", profileImage: "" },
  { id: 3, username: "사라", profileImage: "" },
];

export default function SampleAvatarList() {
  return (
    <div className="relative flex flex-col mt-8">
      {users.map((user, index) => (
        <div
          key={user.id}
          className="relative w-[80px] h-[80px] rounded-full flex items-center justify-center cursor-pointer p-0 m-0"
          style={{
            top: `${index * -45}px`,
            zIndex: 10 + index,
          }}
        >
          {/* 이미지 부분 */}
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
            {/* 배경 블러 */}
            <div className="inset-0 rounded-full bg-[#6161CE] backdrop-blur-[2px]"></div>
          </div>
        </div>
      ))}
    </div>
  );
}