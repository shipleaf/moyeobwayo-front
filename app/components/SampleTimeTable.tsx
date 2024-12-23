"use client";
import { useRecoilValue } from "recoil";
import "react-datepicker/dist/react-datepicker.css";
import { Roboto } from "next/font/google";
import TimeBlock from "./createParty/TimeBlock";
import { selectedAvatarState } from "../recoil/atom";
import { convertedTimeslot } from "./createParty/TimeTable";
import { VotedUser } from "../interfaces/VotedUser";

// Roboto 폰트 불러오기
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export interface PartyDate {
  dateId: number;
  timeslots: Timeslot[];
}

export interface Timeslot {
  userId: number;
  byteString: string;
  dateId: number;
  userName: string;
}
export interface GetSampleUserAvatarResponse {
  userId: number;
  userName: string;
  profileImage?: string;
}
// 1시간 단위로 시간을 반환하는 함수
const generateHourlyLabels = () => {
  const labels = [];
  for (let hour = 9; hour <= 15; hour++) {
    labels.push(`${hour}:00`); // 09:00 ~ 15:00 고정 시간 추가
  }
  return labels;
};

export const getGradationNum = (currentVal: number, maxNum: number): string => {
  if (maxNum === 0) {
    return "0";
  }
  const percent = (currentVal / maxNum) * 100;
  const rounded = Math.round(percent / 10) * 10;
  return rounded.toString();
};

// 요일을 반환하는 함수
const getWeekday = (date: Date) => {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return daysOfWeek[date.getDay()];
};

// 오늘부터 7일간 날짜 생성 함수
const generateDatesFromToday = () => {
  const dates = [];
  const currentDate = new Date();

  for (let i = 0; i < 7; i++) {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + i);
    dates.push(newDate);
  }

  return dates;
};

function generateDummyData(): PartyDate[] {
  const dummyData: PartyDate[] = [];

  // 오늘부터 7일간의 날짜에 대해 수동 타임슬롯 설정
  dummyData.push({
    dateId: 1,
    timeslots: [
      { userId: 1, dateId: 1, byteString: "000000011111", userName: "제시카" },
      { userId: 2, dateId: 1, byteString: "000000000111", userName: "존" },
      { userId: 3, dateId: 1, byteString: "000000000111", userName: "사라" },
    ],
  });

  dummyData.push({
    dateId: 2,
    timeslots: [
      { userId: 1, dateId: 2, byteString: "000000011111", userName: "제시카" },
      { userId: 2, dateId: 2, byteString: "111111111111", userName: "존" },
      { userId: 3, dateId: 2, byteString: "000001111100", userName: "사라" },
    ],
  });

  dummyData.push({
    dateId: 3,
    timeslots: [
      { userId: 1, dateId: 3, byteString: "000000001111", userName: "제시카" },
      { userId: 2, dateId: 3, byteString: "000000000000", userName: "존" },
      { userId: 3, dateId: 3, byteString: "000000000000", userName: "사라" },
    ],
  });

  dummyData.push({
    dateId: 4,
    timeslots: [
      { userId: 2, dateId: 4, byteString: "111111110000", userName: "존" },
      { userId: 1, dateId: 4, byteString: "111111111111", userName: "제시카" },
      { userId: 3, dateId: 4, byteString: "000000000000", userName: "사라" },
    ],
  });

  dummyData.push({
    dateId: 5,
    timeslots: [
      { userId: 1, dateId: 5, byteString: "111111111111", userName: "제시카" },
      { userId: 2, dateId: 5, byteString: "111111111111", userName: "존" },
      { userId: 3, dateId: 5, byteString: "111111111111", userName: "사라" },
    ],
  });

  dummyData.push({
    dateId: 6,
    timeslots: [
      { userId: 1, dateId: 6, byteString: "111111111111", userName: "제시카" },
      { userId: 2, dateId: 6, byteString: "111111111111", userName: "존" },
      { userId: 3, dateId: 6, byteString: "111111111111", userName: "사라" },
    ],
  });

  dummyData.push({
    dateId: 7,
    timeslots: [
      { userId: 1, dateId: 7, byteString: "111111111111", userName: "제시카" },
      { userId: 2, dateId: 7, byteString: "000000000000", userName: "존" },
      { userId: 3, dateId: 7, byteString: "000000000000", userName: "사라" },
    ],
  });

  return dummyData;
}

const dummyData = generateDummyData();

function getVotedUsers(
  users: convertedTimeslot[],
  srcMap: Record<number, string>,
  slotIndex: number
): VotedUser[] {
  return users
    .filter((user) => user.byteString[slotIndex] === "1") // byteString[slotIndex]가 '1'인 경우만 포함
    .map((user) => ({
      src: srcMap[user.userId] || "/images/default_avatar.png", // srcMap에서 찾지 못하면 기본 이미지 사용
      name: user.userName,
    }));
}
// 시간 슬롯을 30분 간격으로 생성하는 함수
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 15; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  return slots;
};
function getSrcMap(
  userList: GetSampleUserAvatarResponse[]
): Record<number, string> {
  return userList.reduce((acc, user, index) => {
    acc[user.userId] = user.profileImage
      ? user.profileImage
      : `/images/sample_avatar${(index % 3) + 1}.png`;
    return acc;
  }, {} as Record<number, string>);
}
const dates = generateDatesFromToday(); // 화면에 보여줄 dates
const timeSlots = generateTimeSlots(); // 30분 간격의 시간 슬롯 생성
const userList: GetSampleUserAvatarResponse[] = [
  {
    userId: 1,
    userName: "제시카",
    profileImage: undefined,
  },
  {
    userId: 2,
    userName: "존",
    profileImage: undefined,
  },
  {
    userId: 3,
    userName: "사라",
    profileImage: undefined,
  },
];

export default function SampleTimeTable() {
  const srcMap = getSrcMap(userList);
  const selectedAvatar = useRecoilValue(selectedAvatarState);
  const maxVotes = 3;
  const hourlyLabels = generateHourlyLabels(); // 시간 라벨

  return (
    <>
      <div className="Head gap-[10px] h-[10%] flex flex-row w-full pr-[2%]">
        <div
          className={`${roboto.className} rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] text-[17px] backdrop-blur-[48px] w-[8%] h-full flex justify-center items-center font-[500]`}
        >
          Time
        </div>
        <div className="flex flex-grow gap-[10px]">
          {dates.map((date, index) => (
            <div
              key={index}
              className="flex-1 rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] h-full flex justify-center items-center gap-[10px]"
            >
              <span className={`${roboto.className} font-[500] text-[17px]`}>
                {getWeekday(date)}
              </span>
              <span className={`${roboto.className} font-[500] text-[35px]`}>
                {date.getDate()}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="Table flex gap-[10px] w-full h-[90%] rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] py-[3%] pr-[2%] overflow-auto">
        <div className="w-[8%]">
          {hourlyLabels.map((label, index) => (
            <div
              key={index}
              className={`${roboto.className} font-[500] text-[15px] text-center m-0 p-0 h-[12vh]`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex flex-grow gap-[10px]">
          {dummyData.map((day, dateIndex, dayArray) => (
            <div key={dateIndex} className="flex-grow">
              {timeSlots.map((timeSlot, slotIndex, timeSlotArray) => {
                let votes = 0;

                if (selectedAvatar) {
                  // 선택된 아바타가 있을 경우 해당 userId의 데이터만 가져오기
                  const selectedUserSlot = day.timeslots.find(
                    (slot) => slot.userId === selectedAvatar.id
                  );
                  votes = selectedUserSlot
                    ? Number(selectedUserSlot.byteString[slotIndex])
                    : 0;
                } else {
                  // 선택된 아바타가 없을 경우 모든 유저의 합산 결과 표시
                  votes = day.timeslots.reduce(
                    (acc, timeslot) =>
                      acc + Number(timeslot.byteString[slotIndex]),
                    0
                  );
                }
                const colorLevel = getGradationNum(votes, maxVotes);

                const votedUsersData = getVotedUsers(
                  day.timeslots,
                  srcMap,
                  slotIndex
                );

                return (
                  <TimeBlock
                    key={`${dateIndex}-${slotIndex}`}
                    dayLength={dayArray.length}
                    dayIndex={dateIndex}
                    dateLength={timeSlotArray.length}
                    maxVotes={maxVotes}
                    time={`${getWeekday(dates[dateIndex])} ${dates[
                      dateIndex
                    ].getDate()} ${timeSlot}`}
                    votedUsersData={votedUsersData}
                    votes={votes}
                    targetDate={dates[dateIndex]}
                    hourlyLabels={hourlyLabels[slotIndex]}
                    slotIndex={slotIndex}
                    className={
                      colorLevel === "0" ? "bg-white" : `bg-MO${colorLevel}`
                    }
                    style={{
                      height: "6vh",
                      marginBottom: slotIndex % 2 === 0 ? "0" : "4px",
                      borderRadius:
                        slotIndex % 2 === 0 ? "10px 10px 0 0" : "0 0 10px 10px",
                      borderBottom:
                        slotIndex === timeSlots.length - 1
                          ? "none"
                          : slotIndex % 2 === 0
                          ? "0.572px dashed #EBEBEB"
                          : "0.572px solid #EBEBEB",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
