import axiosInstance from "./axiosInstance";

// MeetData는 이미 정의된 것으로 가정합니다.
export interface MeetData {
  kakaoUserId: number;
}

// Party 인터페이스 정의 (API 응답에 맞게 수정)
export interface Party {
  partyId: string;
  target_num: number;
  current_num: number;
  party_name: string;
  party_description: string;
  start_date: string;
  endDate: string;
  decision_date: string;
  user_id: string;
  location_name: string | null;
  alarms: any[];  // alarms 배열, 타입을 더 명확히 할 수 있으면 추가적으로 수정 가능
  dates: any[];   // dates 배열, 타입을 더 명확히 할 수 있으면 추가적으로 수정 가능
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