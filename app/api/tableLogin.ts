import axiosInstance from "./axiosInstance";

export interface LoginData {
    userName: string,
    password: string | null,
    partyId: string,
    isKakao: boolean,
    kakaoUserId: null | number
}

export interface tableLoginResponse {
  user: {
    userId: number,
    userName: string,
    password: number
  },
  message: string
}

export const tableLogin = async (data: LoginData): Promise<tableLoginResponse> => {
  try {
    const response = await axiosInstance.post("/user/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    }); 
    return response.data;
  } catch (error) {
    console.error("에러 발생: ", error);
    throw error;
  }
};
