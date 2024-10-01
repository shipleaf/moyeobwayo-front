import axiosInstance from "./axiosInstance";
import axios, { AxiosError } from "axios";

// 응답 타입
interface ApiResponse {
  message: string;
  authCode?: string;
}

// 에러 타입
interface ApiError {
  message: string;
}

export async function sendAuthCodeToBackend(
  authCode: string
): Promise<ApiResponse | undefined> {
  try {
    const response = await axiosInstance.post<ApiResponse>(
      "api/kakaoUser/create",
      {
        authCode,
      }
    );

    if (response.status === 200) {
      console.log("Server response:", response.data);
      return response.data;
    } else {
      throw new Error("Failed to send auth code");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // AxiosError의 response.data가 ApiError 타입인지 확인하는 코드 추가
      const serverError = error as AxiosError<ApiError>;

      // 서버에서 에러 응답이 있는 경우 처리
      if (serverError.response?.data) {
        console.error("API Error:", serverError.response.data.message);
      } else {
        // 응답이 없거나 예상하지 못한 경우
        console.error("API Error: No response data or unknown error");
      }
    } else {
      console.error("Unexpected Error:", error);
    }
  }
}
