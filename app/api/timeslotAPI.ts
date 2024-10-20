import axiosInstance from "./axiosInstance";

export interface voteData {
  selected_start_time: Date;
  selected_end_time: Date;
  user_id: number;
  date_id: number;
}

export interface voteTimeReponse {
  success: boolean;
}

export const voteTime = async (data: voteData): Promise<voteTimeReponse> => {
  try {
    const response = await axiosInstance.post("/timeslots", data, {
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
