import React, { useState } from "react";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { loginState, userIdValue, kakaoUserState } from "@/app/recoil/atom"; // Recoil 상태
import { LoginData } from "@/app/api/tableLogin";
import { useParams } from "next/navigation"; // useParams를 import
import { linkKakaoAndPartyUser } from "@/app/api/kakaoLoginAPI";
import { tableLoginHandler } from "@/app/utils/tableLoginCallback";
import Image from "next/image";

export default function TableLogin() {
  const { hash } = useParams() as { hash: string }; // hash를 string으로 단언
  const [userName, setUserName] = useState(""); // 사용자 이름 입력 상태
  const [password, setPassword] = useState(""); // 비밀번호 입력 상태
  const setIsLoggedIn = useSetRecoilState(loginState); // 로그인 상태 관리
  const [userId, setUserId] = useRecoilState(userIdValue);
  const kakaoUser = useRecoilValue(kakaoUserState);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // LoginData 객체 생성
    const loginData: LoginData = {
      userName: userName,
      password: password,
      partyId: hash,
      isKakao: false,
      kakaoUserId: null
    };

    try {
      const response = await tableLoginHandler(loginData, setUserId);
      console.log("API 응답:", response);

      setIsLoggedIn(true);
      if(kakaoUser.kakaoUserId !== null){
        if(userId){
          await linkKakaoAndPartyUser(userId, kakaoUser.kakaoUserId);
        }
      }
      // 추가적으로 필요한 동작이 있으면 여기에 추가
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="login-container bg-[#fff] w-full rounded-[10px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] pt-[15%] p-[10%]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-[2vh] border-[#285cc4]"
      >
        <div>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="성함"
            required
            className="p-[10px] border-1 bg-[#f9fbfc] rounded-[10px] focus:outline-none focus:border-[#285cc4] focus:bg-[#fff]"
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="비밀번호(필수X)"
            onChange={(e) => setPassword(e.target.value)}
            className="p-[10px] border-1 bg-[#f9fbfc] rounded-[10px] focus:outline-none focus:border-[#285cc4] focus:bg-[#fff]"
          />
        </div>
        {/* Button Groups */}
        <div className="w-full flex flex-col items-center mt-[10%] space-y-4">
          <button
            type="submit"
            className="p-3  rounded-lg w-4/5 bg-[#6161cE] text-white"
          >
            로그인하기
          </button>

          <button
            type="button"
            className="p-3  rounded-lg w-4/5 bg-[#FDE500] text-[#3B1D04] hover:bg-[#E5C900] flex items-center justify-center gap-2"
            onClick={() => {
              // Add your Kakao login functionality here
            }}
          >
            <Image
              src="/images/KakaoLogo.png"
              alt="Kakao Logo"
              width={20}
              height={20}
            />
            카카오로 시작
          </button>
        </div>
         
      </form>
    </div>
  );
}
