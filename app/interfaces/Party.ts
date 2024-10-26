import { timeslot } from "../api/getTableAPI";

export interface Alarm {
  alarmId: number;
  alarm_on: boolean;
  party: string;
}


export interface PartyDate {
  date_id: number;
  selected_date: string;  // ISO 8601 형식의 날짜 문자열
  timeslots: timeslot[];
}
export interface DummyMeet {
  partyId: string;
  target_num: number;
  current_num: number;
  party_name: string;
  party_description: string;
  start_date: string;  // ISO 8601 형식의 날짜 문자열
  location_name: string;
  endDate: string;     // ISO 8601 형식의 날짜 문자열
  decision_date: string;  // ISO 8601 형식의 날짜 문자열
  user_id: string;
  alarms: Alarm[];
  dates: PartyDate[];
}

export interface AvailableTime {
  start: string;
  end: string;
  users: string[];
}

export interface PartyGetResponse{
  party: DummyMeet;
  availableTimes: AvailableTime[];
}