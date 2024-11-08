import React from 'react';

interface VotedUser {
  src: string;  // 아바타 이미지 URL
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
          <img
            key={index}
            src={user.src}
            alt={`Avatar ${index + 1}`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ))}
      </div>
      <div className="w-full flex gap-1 mt-1">
        {votedUsers.map((user, index) => (
          <span
            key={index}
            className="text-xs text-center w-8 truncate"
            style={{ maxWidth: '2rem' }} // 이름 최대 너비 제한
            title={user.name} // 전체 이름을 툴팁으로 제공
          >
            {user.name.length > 5 ? `${user.name.slice(0, 5)}...` : user.name}
          </span>
        ))}
      </div>
    </div>
  );
}