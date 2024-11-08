import React from 'react';

interface AvatarListProps {
  srcList: string[]; // 아바타 이미지 URL 리스트
  possibleUsers: string[]; // 사용자 이름 리스트
}

export default function AvatarList({ srcList, possibleUsers }: AvatarListProps) {
  return (
    <div className="w-full flex flex-col items-center overflow-x-auto">
      <div className="w-full flex gap-1">
        {srcList.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Avatar ${index + 1}`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ))}
      </div>
      <div className="w-full flex gap-1 mt-1">
        {possibleUsers.map((user, index) => (
          <span
            key={index}
            className="text-xs text-center w-8 truncate"
            style={{ maxWidth: '2rem' }} // 이름 최대 너비 제한
            title={user} // 전체 이름을 툴팁으로 제공
          >
            {user.length > 5 ? `${user.slice(0, 5)}...` : user}
          </span>
        ))}
      </div>
    </div>
  );
}