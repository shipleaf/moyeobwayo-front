import axiosInstance from "./axiosInstance";
import axios, { AxiosError } from "axios";

interface ApiResponse {
  message: string;
}

interface ApiError {
  message: string;
}

export async function sendAuthCodeToBackend(
  code: string
): Promise<ApiResponse | undefined> {
  try {
    const response = await axiosInstance.post<ApiResponse>(
      "/kakaoUser/create",
      {
        code,
      }
    );

    if (response.status >= 200 && response.status <= 299) {
      console.log("Server response:", response.data);
      return response.data;
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
