import axiosInstance from "./axiosInstance";

// MeetData는 이미 정의된 것으로 가정합니다.
export interface MeetData {
  kakaoUserId: number;
}

// Party 인터페이스 정의 (API 응답에 맞게 수정)
export interface Party {
  partyId: string;
  targetNum: number;
  currentNum: number;
  partyName: string;
  partyDescription: string;
  startDate: string;
  endDate: string;
  decisionDate: string;
  userId: string;
  locationName: string | null;
  alarms: boolean[];
  dates: boolean[];
}

// getMeetListResponse가 Party 배열을 포함하도록 수정
export interface getMeetListResponse {
  parties: Party[]; // API가 파티 데이터를 반환하는 것으로 가정
}

// getMeetList 함수
export const getMeetList = async (
  data: MeetData
): Promise<getMeetListResponse> => {
  try {
    const response = await axiosInstance.post("/kakaouser/meetlist", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 서버에서 반환하는 데이터 형식에 맞게 수정
    return {
      parties: response.data, // 응답 데이터가 바로 파티 리스트로 반환됨
    };
  } catch (error) {
    console.error("에러 발생: ", error);
    throw error;
  }
};