'use client'

import { Copy, X } from '@phosphor-icons/react';
import { CheckCircle } from '@phosphor-icons/react/dist/ssr';
import React, { useState } from 'react';

interface LinkShareModalProps {
  partyId: string;
  isOpen: boolean;
  onClose: VoidFunction;
}

export default function LinkShareModal({ partyId, isOpen, onClose }: LinkShareModalProps) {
  const [isCopied, setIsCopied] = useState(false); // 링크 복사 여부 상태 관리

  // 복사 처리 함수
  const handleCopy = () => {
    const link = `https://www.moyeobwayo.com/meeting/${partyId}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setIsCopied(true); // 복사 성공 시 상태 변경
        setTimeout(() => setIsCopied(false), 2000); // 2초 후 '복사됨' 상태 리셋
      })
      .catch(() => {
        alert("링크 복사에 실패했습니다.");
      });
  };

  if (!isOpen) return null; // 모달이 열리지 않을 경우 렌더링하지 않음

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#F7F7F7] bg-opacity-50">
      <div className="bg-[#F7F7F7] rounded-lg shadow-lg w-full max-w-md p-6">
        <div className='flex gap-1 items-center mb-1'>
          <CheckCircle weight='bold' size={22} color={"#6161CE"} />
          <h2 className="text-lg font-bold text-[#6161CE]">파티 생성 성공</h2>
          <X className='ml-auto cursor-pointer' onClick={onClose} />
        </div>
        <p className="text-sm text-gray-600 mb-6">
          <strong className='font-semibold text-[#6161CE]'>파티 링크를 공유해</strong> 친구의 일정을 알아보세요
        </p>
        <div className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2 mb-4 border-1 border-black">
          <span className="text-gray-600 text-sm truncate w-3/4">
            https://www.moyeobwayo.com/meeting/{partyId}
          </span>
          <Copy 
            size={22} 
            color={isCopied ? '#34D399' : '#4b5563'} // 복사되었을 때 색상 변경
            className="cursor-pointer" 
            onClick={handleCopy} 
          />
        </div>
        {isCopied && (
          <p className="text-green-500 text-sm mt-2">링크가 복사되었습니다! 🎉</p>
        )}
        <div className="flex gap-1">
          <button
            className="w-1/2 bg-[#4E4EAE] hover:bg-[#3A3A8E] text-white font-semibold py-2 rounded-md transition-colors duration-200"
            onClick={()=>{
              handleCopy();
              onClose();
            }}
          >
            공유하기
          </button>
          <button
            className="w-1/2 bg-[#D9D9D9] hover:bg-[#B5B5B5] text-black font-semibold py-2 rounded-md transition-colors duration-200"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}