import { atom } from "recoil";

export const loginState = atom({
  key: "isLoggedInState",
  default: true,
});

export const loginValue = atom({
  key: "loginValueState",
  default: {
    userId: "",
    userPassword: "",
  },
});

export const userIdValue = atom({
  key: "userIdState",
  default: null,
});

// 임시적으로 로그인된 default값을 사용함
export const kakaoLoginState = atom({
  key: "isKakaoLoggedInState",
  default: true,
});

export const kakaoIDState = atom({
  key: "kakaoIDState",
  default: 3720994926,
});
