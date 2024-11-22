"use client";

import React, { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loginState, loginValue } from "@/app/recoil/atom";
import Image from "next/image";

interface TableLoginProps {
  closeModal: () => void; // 모달 닫기 함수
  onLoginSuccess: () => void; // 로그인 성공 후 호출되는 함수
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateTableLogin({
  closeModal,
  onLoginSuccess,
  setIsLoading
}: TableLoginProps) {
  const [loginInfo, setLoginInfo] = useRecoilState(loginValue);
  const setIsLoggedIn = useSetRecoilState(loginState);
  const [userNameInput, setUserNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [isLoginSubmitted, setIsLoginSubmitted] = useState(false); // 로그인 제출 상태

  useEffect(() => {
    if (isLoginSubmitted) {
      onLoginSuccess(); // 상태 업데이트 후 로그인 성공 시 콜백 호출
      setIsLoginSubmitted(false); // 상태 초기화
    }
  }, [loginInfo, isLoginSubmitted, onLoginSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    setIsLoading(true)
    e.preventDefault();
    const newLoginInfo = { userId: userNameInput, userPassword: passwordInput };
    setLoginInfo(newLoginInfo);
    setIsLoggedIn(true);
    setIsLoginSubmitted(true); // 로그인 제출 상태로 설정
    setIsLoading(false)

    closeModal();
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9ㄱ-ㅎ가-힣\s]/g, ""); // 특수문자 제거

    if (value !== sanitizedValue) {
      alert("특수문자는 입력할 수 없습니다."); // 특수문자 입력 시 alert 표시
    }
    setUserNameInput(sanitizedValue); // 특수문자가 제거된 값으로 업데이트
  };

  return (
    <>
      <div className="bg-white rounded-[10px] flex flex-row w-[360px] h-[60vh] overflow-hidden items-center justify-center">  
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-[2vh] border-[#285cc4]"
        >
          <div className="ImageContainer w-[30%] h-[20%] flex items-center justify-center rounded-full">
            <Image
              src="/images/moyeobwayo_blue.png"
              alt=""
              width={50}
              height={50}
              className=""
            />
          </div>
          <h2 className="text-[15px] text-[#bebdc4]">
            미팅을 생성하실 분의 성함이 필요해요!
          </h2>
          <div className="flex flex-col items-center justify-center w-full">
            <input
              type="text"
              id="userId"
              value={userNameInput}
              placeholder="성함"
              onChange={handleUserNameChange}
              required
              className="p-[10px] border-1 bg-[#f9fbfc] rounded-[10px] focus:outline-none focus:border-[#285cc4] focus:bg-[#fff]"
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <input
              type="password"
              id="password"
              value={passwordInput}
              placeholder="비밀번호(필수X)"
              onChange={(e) => setPasswordInput(e.target.value)}
              className="p-[10px] border-1 bg-[#f9fbfc] rounded-[10px] focus:outline-none focus:border-[#285cc4] focus:bg-[#fff]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#6161cE] mt-[10%] w-full h-[5vh] text-white rounded-[10px]"
          >
            로그인하기
          </button>
        </form>
      </div>
    </>
  );
}
