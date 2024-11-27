import axiosInstance from "./axiosInstance";
import axios, { AxiosError } from "axios";

interface KakaoUserResponse {
  token: string;
  talkCalendarOn: boolean;
}

interface ApiError {
  message: string;
}

export interface linkKakaoResponse{
  user: {
    userId: number,
    userName: string,
    password: number
  },
  message: string
}
export async function sendAuthCodeToBackend(
  code: string
): Promise<KakaoUserResponse | undefined> {
  try {
    const response = await axiosInstance.post<KakaoUserResponse>(
      "/kakaoUser/create",
      {
        code,
      }
    );

    if (response.status >= 200 && response.status <= 299) {
      return response.data; // Kakao user response
    } else {
      throw new Error("Failed to send auth code");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverError = error as AxiosError<ApiError>;

      if (serverError.response?.data) {
        console.error("API Error:", serverError.response.data.message);
      } else {
        console.error("API Error: No response data or unknown error");
      }
    } else {
      console.error("Unexpected Error:", error);
    }
  }
}

export async function linkKakaoAndPartyUser(
  userID: number, kakaoId: number
): Promise<linkKakaoResponse | undefined> {
  try {
    const response = await axiosInstance.post<linkKakaoResponse>(
      "/kakaoUser/link",
      {
        currentUserID: userID,
        kakaoUserId: kakaoId,
      }
    );

    if (response.status >= 200 && response.status <= 299) {
      return response.data; // Kakao user response
    } else {
      throw new Error("Failed to send auth code");
    }
  } catch (error: unknown) {
    throw error
  } 

}