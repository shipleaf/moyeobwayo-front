import axiosInstance from "./axiosInstance";

export interface CompleteData {
  userId: number;
  completeTime: Date;
  endTime: Date;
  locationName: string;
  dateId: number;
}

export interface CompleteResponse {
  status: number;
  data: {
    message?: string; // message의 타입에 맞게 수정
    party?: {
      partyId: string;
      targetNum: number;
      currentNum: number;
      partyName: string;
      partyDescription: string;
    };
  };
}

export const completeTime = async (
  partyId: string,
  data: CompleteData
): Promise<CompleteResponse> => {
  try {
    const response = await axiosInstance.post(
      `/party/complete/${partyId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("에러 발생: ", error);
    throw error;
  }
};
