"use client";

import { useRecoilState, useRecoilValue } from "recoil";
import "react-datepicker/dist/react-datepicker.css";
import TimeBlock from "./TimeBlock";
import {
  GetUserAvatarResponse,
  getUserAvatar,
} from "@/app/api/getUserAvatarAPI";
import {
  tableRefreshTrigger,
  userNumberState,
} from "@/app/recoil/atom";
import { useEffect, useState } from "react";
import { getTable } from "@/app/api/getTableAPI";
import { useParams } from "next/navigation";
import { Party } from "@/app/api/getTableAPI";
import { useSearchParams } from "next/navigation";
import { roboto } from "@/app/utils/getRobot";
import { VotedUser } from "@/app/interfaces/VotedUser";

interface timeTableProps {
  userList: GetUserAvatarResponse[];
  setUserList: React.Dispatch<React.SetStateAction<GetUserAvatarResponse[]>>;
  selectedUserId: number | undefined;
}
export interface Table {
  party: Party;
  formattedDates: string[];
  startTime: string;
  endTime: string;
  dates: {
    dateId: number;
    convertedTimeslots: {
      userId: number;
      userName: string;
      byteString: string;
    }[];
  }[];
}

export const getGradationNum = (currentVal: number, maxNum: number): string => {
  if (maxNum === 0) {
    return "0";
  }
  const percent = (currentVal / maxNum) * 100;
  const rounded = Math.round(percent / 10) * 10;
  return rounded.toString();
};

function getSrcMap(userList: GetUserAvatarResponse[]): Record<number, string> {
  return userList.reduce((acc, user, index) => {
    acc[user.userId] = user.profileImage
      ? user.profileImage
      : `/images/sample_avatar${(index % 3) + 1}.png`;
    return acc;
  }, {} as Record<number, string>);
}
export interface convertedTimeslot {
  userId: number;
  userName: string;
  byteString: string;
}
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
export default function TimeTable({
  userList,
  setUserList,
  selectedUserId,
}: timeTableProps) {
  const srcMap = getSrcMap(userList);
  
  const searchParams = useSearchParams();
  const { hash } = useParams();
  const partyId = searchParams.get("partyId");
  const [tableData, setTableData] = useState<Table | null>(null); // 테이블 데이터 상태 관리
  const refreshValue = useRecoilValue(tableRefreshTrigger);
  const [globalTotalNum, setGlobalTotalNum] = useRecoilState(userNumberState);
  const [blockWidth, setBlockWidth] = useState(130);
  const [blockHeight, setBlockHeight] = useState("6vh");
  const [timeColumnWidth, setTimeColumnWidth] = useState(110);
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const tableId = hash || partyId; // hash가 없으면 partyId를 사용
        if (!tableId) return;

        // 두 개의 API 요청을 동시에 호출
        Promise.all([
          getTable({ table_id: hash as string }),
          getUserAvatar({ table_id: hash as string }),
        ]).then(([tableDataResponse, userAvatarResponse]) => {
            const dates = tableDataResponse.party.dates.map((date) => {
              const localDate = new Date(date.selected_date);
              return localDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD 형식
            });
    
            const timeslots = tableDataResponse.party.dates.map((date) => ({
              dateId: date.dateId,
              convertedTimeslots: (date.convertedTimeslots || []).map((slot) => ({
                userId: slot.userId,
                userName: slot.userName,
                byteString: slot.byteString,
              })),
            }));
    
            const startTime = new Date(
              tableDataResponse.party.startDate
            ).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            });
    
            const endTime = new Date(
              tableDataResponse.party.endDate
            ).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            });
    
            setTableData({
              party: tableDataResponse.party,
              formattedDates: dates,
              startTime: startTime,
              endTime: endTime,
              dates: timeslots,
            });

          setUserList(userAvatarResponse);
          setGlobalTotalNum(userAvatarResponse.length);
        });
      } catch (error) {
        throw error;
      }
    };

    if ((hash || partyId) && refreshValue >= 0) {
      fetchTableData();
    }
  }, [hash, partyId, refreshValue]);
  // 화면 너비에 따른 계산
  const updateWidths = () => {
    const screenWidth = window.innerWidth;

    // 화면 너비가 1000px 이하일 때만 0.8을 곱해줌
    if (screenWidth <= 1000) {
      setBlockWidth(130 * 0.6); // 0.8을 곱해줌
      setTimeColumnWidth(110 * 0.6); // 0.8을 곱해줌
      setBlockHeight("5vh"); // 0.8을 곱해줌
    } else {
      setBlockWidth(130); // 원래 크기로 복원
      setTimeColumnWidth(110); // 원래 크기로 복원
      setBlockHeight("6vh"); // 원래 크기로 복원
    }
  };

  useEffect(() => {
    // 화면 크기 변화에 따라 너비 업데이트
    updateWidths();
    window.addEventListener("resize", updateWidths);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
    return () => {
      window.removeEventListener("resize", updateWidths);
    };
  }, []); // 빈 배열을 사용해 처음 한번만 실행되도록 설정

  if (!tableData) {
    return <div>Loading...</div>;
  }

  const dates = tableData.formattedDates.map(
    (dateString) => new Date(dateString)
  );

  // 요일을 반환하는 함수
  const getWeekday = (date: Date) => {
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    return daysOfWeek[date.getDay()];
  };

  const generateTimeSlots = () => {
    const slots = [];
    const start = parseInt(tableData.startTime.split(":")[0], 10) || 0;
    const prevEnd = parseInt(tableData.endTime.split(":")[0], 10) || 0;

    const end = prevEnd === 0 ? 24 : prevEnd;
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const generateHourlyLabels = () => {
    const labels = [];
    const start = parseInt(tableData.startTime.split(":")[0], 10);
    const prevEnd = parseInt(tableData.endTime.split(":")[0], 10);
    const end = prevEnd === 0 ? 24 : prevEnd; 
    for (let hour = start; hour <= end; hour++) {
      labels.push(`${hour}:00`);
    }
    return labels;
  };
  const hourlyLabels = generateHourlyLabels(); // 시간 라벨

  const timeSlots = generateTimeSlots(); // 30분 간격의 시간 슬롯 생성
  const maxVotes = globalTotalNum;
  const dateLength = dates?.length;
  
  return (
    <div className="flex flex-col gap-[2%] h-full overflow-auto">
      <div className="Head gap-[10px] h-[10%] flex flex-row w-full pr-[2%]">
        <div
          className={`${roboto.className} rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] text-[17px] backdrop-blur-[48px] 
          h-full flex justify-center items-center font-[500]`}
          style={{ minWidth: `${timeColumnWidth}px` }}
        >
          Time
        </div>
        <div className="flex gap-[10px]">
          {dates ? (
            dates.map((date, index) => (
              <div
                key={index}
                className=" rounded-[10px] bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur-[48px] py-2
                h-full flex justify-center items-center"
                style={{ width: `${blockWidth}px` }}
              >
                <span className={`${roboto.className} font-[500] text-[17px]`}>
                  {getWeekday(date)}
                </span>
                <span className={`${roboto.className} font-[500] text-[35px]`}>
                  {date.getDate()}
                </span>
              </div>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
      <div
        className="Table relative gap-[10px]
        inline-flex rounded-[10px] pt-4 min-w-full bg-[#F7F7F7]"
      >
        {/* 배경판 깔기 */}
        <div 
          className={`bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] min-h-full absolute top-0 left-0 -z-10`} 
          style={{
            width: `${
              (blockWidth + 10) * dateLength + 10 + timeColumnWidth + 30
            }px `,
          }}
        />
        <div style={{ minWidth: `${timeColumnWidth}px` }}>
          {hourlyLabels.map((label, index) => (
            <div
              key={index}
              className={`${roboto.className} font-[500] text-[15px] text-center m-0 p-0 h-[12vh] max-[1000px]:h-[10vh]`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex gap-[10px]">
          {tableData.dates.map((day, dateIndex: number, dayArray) => (
            <div
              key={dateIndex}
              className=""
              style={{ width: `${blockWidth}px` }}
            >
              {timeSlots.map((timeSlot, slotIndex, timeSlotArray) => {
                let votes = 0;

                if (selectedUserId !== undefined) {
                  // selectedUserId가 존재하는 경우, 해당 유저 데이터만 표시
                  const selectedUserSlot = day.convertedTimeslots.find(
                    (slot) => slot.userId === selectedUserId
                  );
                  votes = selectedUserSlot
                    ? Number(selectedUserSlot.byteString[slotIndex])
                    : 0;
                } else {
                  // selectedUserId가 없으면 전체 유저 데이터를 합산
                  votes = day.convertedTimeslots.reduce(
                    (acc: number, timeslot) =>
                      acc + Number(timeslot.byteString[slotIndex]),
                    0
                  );
                }

                const colorLevel = getGradationNum(votes, maxVotes);
                const votedUsersData = selectedUserId
                  ? getVotedUsers(
                      day.convertedTimeslots.filter(
                        (slot) => slot.userId === selectedUserId
                      ),
                      srcMap,
                      slotIndex
                    )
                  : getVotedUsers(day.convertedTimeslots, srcMap, slotIndex);

                return (
                  <TimeBlock
                    key={`${dateIndex}-${slotIndex}`}
                    dayLength={dayArray.length}
                    dayIndex={dateIndex}
                    dateLength={timeSlotArray.length}
                    slotIndex={slotIndex}
                    time={`${getWeekday(dates[dateIndex])} ${dates[
                      dateIndex
                    ].getDate()} ${timeSlot}`}
                    targetDate={dates[dateIndex]}
                    hourlyLabels={hourlyLabels[slotIndex]}
                    votes={votes}
                    votedUsersData={votedUsersData}
                    maxVotes={maxVotes}
                    className={
                      colorLevel === "0"
                        ? "bg-white"
                        : `bg-MO${colorLevel} w-full`
                    }
                    style={{
                      height: `${blockHeight}`,
                      marginBottom: slotIndex % 2 === 0 ? "0" : "4px",
                      borderRadius:
                        slotIndex % 2 === 0 ? "10px 10px 0 0" : "0 0 10px 10px",
                      borderBottom:
                        slotIndex === timeSlotArray.length - 1
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
    </div>
  );
}
