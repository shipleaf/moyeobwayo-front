import axiosInstance from "./axiosInstance";

export interface SubmitData {
    participants: number,
    partyTitle: string,
    partyDescription: string,
    startTime: Date,
    endTime: Date,
    dates: Date[],
    decisionDate: Date,
    user_id: string
}

export interface CreateTableResponse {
  party_id: string;
  target_num: number;
  current_num: number;
  party_name: string;
  party_description: number;
  start_date: string;
  endDate: string;
  decision_date: string;
  user_id: number;
  alarms: any | null;
  dates: any | null;
}

export const createTable = async (
  data: SubmitData
): Promise<CreateTableResponse> => {
  try {
    console.log("here");
    const response = await axiosInstance.post("/party/create", data, {
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
