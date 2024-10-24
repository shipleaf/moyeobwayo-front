import axiosInstance from "./axiosInstance";
import { PartyDate } from "../interfaces/Party";
export interface TableId {
  table_id: string;
}

export interface userEntity{
  userId: number,
  userName: string,
  password: null
}
export interface timeslot{
  slotId: number,
  selectedStartTime: string,
  selectedEndTime: string,
  userEntity: userEntity
}


export interface Party{
  partyId: string;
  targetNum: number;
  currentNum: number;
  partyName: string;
  partyDescription: string;
  startDate: string;
  locationName: string | null;
  endDate: string;
  decision_date: string;
  user_id: string;
  alarms: any[];
  dates: PartyDate[]
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
