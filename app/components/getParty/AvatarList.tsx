import Image from "next/image";
import React from "react";

interface VotedUser {
  src: string; // 아바타 이미지 URL
  name: string; // 사용자 이름
}

interface AvatarListProps {
  votedUsers: VotedUser[]; // VotedUser 객체 리스트
}

export default function AvatarList({ votedUsers }: AvatarListProps) {
  return (
    <div className="w-full flex flex-col items-center overflow-x-auto">
      <div className="w-full flex gap-1">
        {votedUsers.map((user, index) => (
          <div key={index} className="flex flex-col items-center w-10">
            <Image
              width={40}
              height={40}
              src={user.src}
              alt={`Avatar ${index + 1}`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span
              className="text-xs text-center w-10 overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ maxWidth: "2.5rem" }} // 이름 최대 너비 제한
              title={user.name} // 전체 이름을 툴팁으로 제공
            >
              {user.name.split("(")[0].length > 5
                ? `${user.name.split("(")[0].slice(0, 5)}...`
                : user.name.split("(")[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
