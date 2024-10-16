import axiosInstance from "./axiosInstance";

export interface TableId {
  table_id: string;
}
export interface Party{
  party_id: string;
  target_num: number;
  current_num: number;
  party_name: string;
  party_description: string;
  start_date: string;
  location_name: string | null;
  endDate: string;
  decision_date: string;
  user_id: string;
  alarms: any[];
  dates: {
    date_id: number;
    selected_date: string;
    timeslots: any[];
  }
}
export interface getTableResponse {
  party: Party;
  availableTimes: AvailableTimesResponse[];
}

export interface AvailableTimesResponse {
  start: string;
  end: string;
  users: string[];
}


export const getTable = async (data: TableId): Promise<getTableResponse> => {
  try {
    const response = await axiosInstance.get(`/party/${data.table_id}`, {
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

export const getPartyPriority = async (
  data: TableId
): Promise<AvailableTimesResponse> => {
  try {
    const response = await axiosInstance.get(`/party/${data.table_id}`, {
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
