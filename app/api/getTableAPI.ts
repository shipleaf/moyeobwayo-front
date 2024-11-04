import axiosInstance from "./axiosInstance";

export interface TableId {
  table_id: string;
}

export interface UserEntity {
  userId: number;
  userName: string;
  password: null;
}

// Timeslot representing each time slot with user entity information
export interface Timeslot {
  userId: number,
  userName: string,
  byteString: string;
}

// PartyDate representing each date with timeslots
export interface PartyDate {
  dateId: number;
  selected_date: string;
  convertedTimeslots: Timeslot[];
}

export interface Party {
  partyId: string;
  targetNum: number;
  currentNum: number;
  partyName: string;
  partyDescription: string;
  startDate: string;
  endDate: string;
  decisionDate: boolean;
  userId: string;
  locationName: string;
  alarms: boolean[];
  dates: PartyDate[]; // 날짜 배열
}

export interface AvailableTimesResponse {
  start: string;
  end: string;
  users: {
    userName: string;
    userId: number;
  }[];
}

// Response structure for getTable API
export interface GetTableResponse {
  party: Party;
  availableTime: AvailableTimesResponse[];
}

// getTable API function to fetch table details
export const getTable = async (data: TableId): Promise<GetTableResponse> => {
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
