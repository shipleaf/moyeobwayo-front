import { timeslot } from "../api/getTableAPI";

export const countTimeSlots = (timeslots: timeslot[], startTime: string, endTime: string):number[] => {
  // 시간만 취하기 위해 Date 대신 시간을 직접 추출
  const start = new Date(startTime);
  const end = new Date(endTime);
  console.log('start - end', start, end)
  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const endHour = end.getHours();
  const endMinute = end.getMinutes();

  // 30분 간격으로 총 몇 개의 슬롯이 있는지 계산
  const totalSlots = Math.ceil(((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 30);
  console.log(totalSlots)
  // 슬롯 수만큼 0으로 초기화된 배열 생성
  const result = new Array(totalSlots).fill(0);

  for (const slot of timeslots) {
    const slotStart = new Date(slot.selected_start_time);
    const slotEnd = new Date(slot.selected_end_time);

    const slotStartHour = slotStart.getHours();
    const slotStartMinute = slotStart.getMinutes();
    const slotEndHour = slotEnd.getHours();
    const slotEndMinute = slotEnd.getMinutes();

    // 시간 차이를 기반으로 슬롯의 인덱스를 계산
    const startIndex = Math.max(0, Math.floor(((slotStartHour * 60 + slotStartMinute) - (startHour * 60 + startMinute)) / 30));
    const endIndex = Math.min(totalSlots - 1, Math.floor(((slotEndHour * 60 + slotEndMinute) - (startHour * 60 + startMinute)) / 30));

    // 각 슬롯에 포함되는 인덱스 범위의 값을 증가
    for (let i = startIndex; i <= endIndex; i++) {
      result[i]++;
    }
  }

  return result;
};