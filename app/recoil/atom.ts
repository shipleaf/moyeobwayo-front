import { atom } from "recoil";

const SESSION_STORAGE_KEY_LOGIN = "isLoggedIn";

export const loginState = atom({
  key: "isLoggedInState",
  default: false, // 기본값은 로그아웃 상태
  effects: [
    ({ setSelf, onSet }) => {
      if (typeof window !== "undefined") {
        // 1. 페이지 로드 시 세션 스토리지에서 로그인 상태 복원
        const savedLoginState = sessionStorage.getItem(
          SESSION_STORAGE_KEY_LOGIN
        );
        if (savedLoginState !== null) {
          setSelf(JSON.parse(savedLoginState));
        }

        // 2. 상태가 변경될 때 세션 스토리지에 저장
        onSet((newValue) => {
          sessionStorage.setItem(
            SESSION_STORAGE_KEY_LOGIN,
            JSON.stringify(newValue)
          );
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
