import { SetterOrUpdater } from "recoil";
import { LoginData, tableLogin } from "../api/tableLogin";

// Handler 함수에서 타입을 반영
export const tableLoginHandler = async (
  loginData: LoginData,
  setUserId: SetterOrUpdater<number | null>
) => {
  if (loginData.isKakao === true && loginData.kakaoUserId !== null) {
    return await kakaoUserTableLogin(loginData, setUserId);
  } else {
    return await noramlUserTableLogin(loginData, setUserId);
  }
};

// 카카오 유저 로그인 처리 함수
const kakaoUserTableLogin = async (
  loginData: LoginData,
  setUserId: SetterOrUpdater<number | null>
) => {
  try {
    const data = await tableLogin(loginData);
    setUserId(data.user.userId); // 카카오 유저 ID 설정
  } catch (error) {
    alert("로그인 에러 발생");
    console.log(error);
  }
};

// 일반 유저 로그인 처리 함수
const noramlUserTableLogin = async (
  loginData: LoginData,
  setUserId: SetterOrUpdater<number | null>
) => {
  try {
    const data = await tableLogin(loginData);
    if (data) {
      // 전역 userID를 data에서 가져온 값으로 변경
      setUserId(data.user.userId); // 예시로 userId를 받아와 설정
    }
  } catch (error) {
    alert("로그인 에러 발생");
    console.log(error);
  }
};