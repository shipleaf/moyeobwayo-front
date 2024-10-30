// import { Timeslot } from "../api/getTableAPI";

// export const countTimeSlots = (timeslots: Timeslot[], startTime: string, endTime: string):number[] => {
//   // 시간만 취하기 위해 Date 대신 시간을 직접 추출
//   const start = new Date(startTime);
//   const end = new Date(endTime);
//   const startHour = start.getHours();
//   const startMinute = start.getMinutes();
//   const endHour = end.getHours();
//   const endMinute = end.getMinutes();

//   // 30분 간격으로 총 몇 개의 슬롯이 있는지 계산
//   const totalSlots = Math.ceil(((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 30);
//   // 슬롯 수만큼 0으로 초기화된 배열 생성
//   const result = new Array(totalSlots).fill(0);

//   for (const slot of timeslots) {
//     const slotStart = new Date(slot.selectedStartTime);
//     const slotEnd = new Date(slot.selectedEndTime);

//     const slotStartHour = slotStart.getHours();
//     const slotStartMinute = slotStart.getMinutes();
//     const slotEndHour = slotEnd.getHours();
//     const slotEndMinute = slotEnd.getMinutes();

//     // 시간 차이를 기반으로 슬롯의 인덱스를 계산
//     const startIndex = Math.max(0, Math.floor(((slotStartHour * 60 + slotStartMinute) - (startHour * 60 + startMinute)) / 30));
//     const endIndex = Math.min(totalSlots - 1, Math.floor(((slotEndHour * 60 + slotEndMinute) - (startHour * 60 + startMinute)) / 30));

//     // 각 슬롯에 포함되는 인덱스 범위의 값을 증가
//     for (let i = startIndex; i <= endIndex; i++) {
//       result[i]++;
//     }
//   }

//   return result;
// };

// export const getGradationNum: (currentVal: number, maxNum: number) => string = (currentVal, maxNum) => {
//   if(maxNum === 0){
//     return "0"
//   }
  
//   const percent = (currentVal / maxNum) * 100;

//   // 일의 자리에서 반올림
//   const rounded = Math.round(percent / 10) * 10;
//   return rounded.toString(); // 숫자를 문자열로 변환
// };