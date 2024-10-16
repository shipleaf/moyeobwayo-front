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

export const kakaoLoginState = atom({
  key: "isKakaoLoggedInState",
  default: false,
});

export const kakaoIDState = atom({
  key: "kakaoIDState",
  default: 3720994926,
});
