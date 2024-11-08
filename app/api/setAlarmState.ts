import axiosInstance from "./axiosInstance"

export interface alarmUpdateResponse {
  alarmId: number,
  alarm_on: boolean,
}

export interface alarmUpdateRequest {
  alarmOn: boolean,
}

export const setServerAlarmState = async (id:number, alarmOn: boolean):Promise<alarmUpdateResponse> =>{
  try {
    const reqData:alarmUpdateRequest = {
      alarmOn : alarmOn
    }
    const response = await axiosInstance.put(`/alarm/${id}`, JSON.stringify(reqData));
    return response.data;
  } catch (error) {
    console.error("에러 발생: ", error);
    throw error;
  }
}
