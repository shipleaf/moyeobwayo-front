import { atom } from "recoil";

export const loginState = atom({
  key: "isLoggedInState",
  default: false, // 새로고침 시 초기화된 상태로 설정
  effects: [
    ({ onSet }) => {
      if (typeof window !== "undefined") {
        // 상태가 변경될 때만 세션 스토리지에 저장
        onSet((newValue) => {
          sessionStorage.setItem("isLoggedIn", JSON.stringify(newValue));
        });
      }
    },
  ],
});

export const loginValue = atom({
  key: "loginValueState",
  default: {
    userId: "",
    userPassword: "",
  },
});

export const userIdValue = atom<number | null>({
  key: "userIdState",
  default: null,
});

// 임시적으로 로그인된 default값을 사용함
export const kakaoLoginState = atom({
  key: "isKakaoLoggedInState",
  default: false,
});

export const kakaoIDState = atom({
  key: "kakaoIDState",
  default: 3720994926,
});

export const selectedDateState = atom({
  key: "isSelectedDateState",
  default: [],
});

export const selectedStartTime = atom({
  key: "isSelectedStartTimeState",
  default: 9,
});

export const selectedEndTime = atom({
  key: "isSelectedEndTimeState",
  default: 15,
});
