"use client";

import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { loginValue } from "@/app/recoil/atom";
import { saveToLocalStorage } from "@/app/recoil/recoilUtils"; // localStorage 저장 유틸리티 함수

interface TableLoginProps {
  closeModal: () => void; // 모달 닫기 함수
}

export default function TableLogin({ closeModal }: TableLoginProps) {
  const [loginInfo, setLoginInfo] = useRecoilState(loginValue);
  const [userNameInput, setUserNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    console.log("Updated loginInfo:", loginInfo.userId);
  }, [loginInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoginInfo = { userId: userNameInput, userPassword: passwordInput };
    setLoginInfo(newLoginInfo);
    saveToLocalStorage("loginInfo", newLoginInfo);

    closeModal();
  };

  return (
    <div className="border border-1 bg-white">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userId">User ID: </label>
          <input
            type="text"
            id="userId"
            value={userNameInput}
            onChange={(e) => setUserNameInput(e.target.value)}
            required
            className="outline"
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="outline"
          />
        </div>
        <button type="submit" className="bg-[#999]">
          Login
        </button>
      </form>
    </div>
  );
}
