export interface KakaoUserData {
  kakaoUserId: number | null; // null 허용
  nickname: string;
  profile_image: string;
  expiresAt: Date;
}

export const saveToLocalStorage = (key: string, value: KakaoUserData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const loadFromLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  }
};
