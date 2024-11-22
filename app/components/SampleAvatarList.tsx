"use client";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { kakaoUserState, selectedAvatarState } from "../recoil/atom";
import { decodeJWT } from "../utils/jwtUtils";
import { loadFromLocalStorage } from "../recoil/recoilUtils";

const users = [
  { id: 1, username: "제시카", profileImage: "" },
  { id: 2, username: "존", profileImage: "" },
  { id: 3, username: "사라", profileImage: "" },
];

export default function SampleAvatarList() {
  const [selectedAvatar, setSelectedAvatar] = useRecoilState(selectedAvatarState);
  const [hoveredAvatar, setHoveredAvatar] = useState<number | null>(null); // 추가 상태
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [globalKakaoLoginState, setGlobalKakaoLoginState] = useRecoilState(kakaoUserState);
  const [isUserChecked, setIsUserChecked] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (globalKakaoLoginState.kakaoUserId !== null) return;

      const kakaoUserDataJWT = await loadFromLocalStorage("kakaoUserJWT");
      const kakaoUserData = decodeJWT(kakaoUserDataJWT);

      if (kakaoUserData?.kakao_user_id) {
        setGlobalKakaoLoginState({
          kakaoUserId: kakaoUserData.kakao_user_id,
          nickname: kakaoUserData.nickname,
          profile_image: kakaoUserData.profile_image || " ",
        });
        return;
      }
      setIsUserChecked(false);
    };

    checkUserStatus();
  }, [globalKakaoLoginState]);

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
    <div ref={containerRef} className="relative flex flex-col mt-1 items-center">
      {isUserChecked ? (
        <div className="flex flex-col items-center w-full text-center font-pretendard text-[#fcfcfc] font-[500] mt-4">
          <div className="flex flex-row items-center mb-2">
            <span className="text-sm">Hi, {globalKakaoLoginState.nickname}</span>
            <Image
              src="/images/kakaotalk_sharing_btn_small_ov.png"
              alt="Exclamation Icon"
              width={20}
              height={20}
              className="ml-1 inline-block w-4 h-4 rounded-2xl"
            />
          </div>
          <Image
            src={globalKakaoLoginState.profile_image}
            alt={globalKakaoLoginState.nickname}
            width={69}
            height={69}
            className="rounded-full"
          />
        </div>
      ) : (
        ""
      )}
      <span className="text-[#fcfcfc] font-pretendard font-[500] mt-4 mb-1">참여자</span>
      {users.map((user, index) => (
        <div
          key={user.id}
          onMouseEnter={() => setHoveredAvatar(user.id)} // 호버 시작
          onMouseLeave={() => setHoveredAvatar(null)} // 호버 종료
          onClick={() => setSelectedAvatar(user)} // 클릭 시 선택
          className={`relative w-[70px] h-[70px] rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 ${
            selectedAvatar?.id === user.id || hoveredAvatar === user.id
              ? "translate-y-[-20px]" // 호버 또는 클릭 시 위로 이동
              : ""
          } ${selectedAvatar?.id === user.id ? "ring-4 ring-blue-500" : ""}`}
          style={{
            top: `${index * -45}px`,
            zIndex: 10 + index,
          }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            {user.profileImage !== null ? (
              <Image
                src={`/images/sample_avatar${(index % 3) + 1}.png`} // 1, 2, 3 반복
                alt={user.username}
                width={69}
                height={69}
                className="rounded-full"
              />
            ) : (
              <UserCircle size={80} className="text-[#ced4da]" />
            )}
            <div className="inset-0 rounded-full bg-[#6161CE] backdrop-blur-[2px]"></div>
          </div>
          {(selectedAvatar?.id === user.id || hoveredAvatar === user.id) && (
            <div
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md shadow-md text-xs text-gray-700"
              style={{ whiteSpace: "nowrap" }}
            >
              {user.username}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}