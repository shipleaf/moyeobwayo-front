import axiosInstance from "./axiosInstance";
import axios, { AxiosError } from "axios";

interface KakaoUserResponse {
  access_token: string;
  alarm_off: boolean;
  expires_in: number;
  kakaoUserId: number;
  kakao_message_allow: boolean;
  nickname: string;
  profile_image: string;
  refresh_token: string;
  refresh_token_expires_in: number;
}

interface ApiError {
  message: string;
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
      console.log("Server response:", response.data);
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