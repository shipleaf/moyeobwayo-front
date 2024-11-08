import axiosInstance from "./axiosInstance";

export interface getServerAlarmStateRequest {
  kakaoId: number;
  partyId: string;
}
export interface getServerAlarmStateResponse{
  alarmId: number;
  alarm_on: boolean;
}

// getMeetList 함수
export const getAlarmState = async (
  data: getServerAlarmStateRequest
): Promise<getServerAlarmStateResponse> => {
  try {
    // 쿼리 매개변수로 kakaoId와 partyId를 전달
    const response = await axiosInstance.get<getServerAlarmStateResponse>("/alarm/", {
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