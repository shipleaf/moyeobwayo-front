import axiosInstance from "./axiosInstance";


// 전달 데이터 interface
export interface voteData {
  binaryString: string;
  userId: number;
  dateId: number;
}

export interface userInfo {
  partyId: string,
  userId: number,
}

// 응답 interface
export interface voteTimeReponse {
  success: boolean;
}

export interface getMyVoteReponse {
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

export const getMyVote = async (data: userInfo): Promise<getMyVoteReponse> => {
  try {
    const response = await axiosInstance.post("/timeslots/user-timeslots", data, {
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
