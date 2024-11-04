import axiosInstance from "./axiosInstance";
import { getMeetListResponse } from "./getMeetListAPI";

export interface MeetData {
  kakaoId: number;
  partyId: string;
}


// getMeetList 함수
export const getAlarmState = async (
  data: MeetData
): Promise<getMeetListResponse> => {
  try {
    // 쿼리 매개변수로 kakaoId와 partyId를 전달
    const response = await axiosInstance.get<getMeetListResponse>("/alarm/", {
      params: {
        kakaoId: data.kakaoId,
        partyId: data.partyId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error("Error fetching alarm state:", error);
    throw error; // 오류를 다시 던져서 호출자에게 전달
  }
};