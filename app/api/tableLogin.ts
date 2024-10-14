import axiosInstance from "./axiosInstance";

export interface LoginData {
    userName: string,
    password: string,
    partyId: string,
    isKakao: boolean
}

export interface tableLoginResponse {
  user_id: number,
  kakaoProfile: any,
  user_name: string,
  party: {
    party_id: string,
    target_num: number,
    current_num: number,
    party_name: string,
    party_description: string,
    start_date: Date,
    location_name: string
    enddate: Date,
    decision_date: Date,
    user_id: string,
    alarms: boolean
    dates: []
  }
}

export const tableLogin = async (data: LoginData): Promise<tableLoginResponse> => {
  try {
    const response = await axiosInstance.post("/user/login", data, {
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
