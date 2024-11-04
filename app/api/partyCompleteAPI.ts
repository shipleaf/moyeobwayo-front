import axiosInstance from "./axiosInstance";
import { TableId } from "./getTableAPI";

export interface CompleteData {
  userId: number;
  completeTime: Date;
  endTime: Date;
  locationName: string;
  dateId: number;
  users: string[];
  usersId: number[];  
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

export interface GetCompleteResponse {
  partyId: string,
  startTime: Date,
  endTime: Date,
  possibleUsers: string[],
  impossibleUsers: string[]
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

export const getDecision = async (data: TableId): Promise<GetCompleteResponse> => {
  try {
    const response = await axiosInstance.get(`/decision/${data.table_id}`, {
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
