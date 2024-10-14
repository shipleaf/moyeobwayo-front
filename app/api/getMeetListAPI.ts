import axiosInstance from "./axiosInstance";

export interface MeetData {
  kakaoUserId: number;
}

export interface getMeetListResponse {
  success: boolean;
}

export const getMeetList = async (
  data: MeetData
): Promise<getMeetListResponse> => {
  try {
    const response = await axiosInstance.post("/KakaoUser/meetlist", data, {
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
