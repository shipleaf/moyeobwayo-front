"use client";

import { useRecoilState, useRecoilValue } from "recoil";
import "react-datepicker/dist/react-datepicker.css";
import TimeBlock from "./TimeBlock";
import {
  GetUserAvatarResponse,
  getUserAvatar,
} from "@/app/api/getUserAvatarAPI";
import { tableRefreshTrigger, userNumberState } from "@/app/recoil/atom";
import { useEffect, useState } from "react";
import { getTable } from "@/app/api/getTableAPI";
import { useParams } from "next/navigation";
import { Party } from "@/app/api/getTableAPI";
import { useSearchParams } from "next/navigation";
import { roboto } from "@/app/utils/getRobot";
import { VotedUser } from "@/app/interfaces/VotedUser";
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";

interface timeTableProps {
  userList: GetUserAvatarResponse[];
  setUserList: React.Dispatch<React.SetStateAction<GetUserAvatarResponse[]>>;
  selectedUserId: number | undefined;
  isMobile: boolean;
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
  isMobile}: timeTableProps) {
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
  const [startIndex, setStartIndex] = useState(0); // 날짜 시작 인덱스 상태

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
    // eslint-disable-next-line
  }, [hash, partyId, refreshValue]);

  useEffect(() => {
    const updateWidths = () => {
      const screenWidth = window.innerWidth;

      // 7개의 date를 화면에 균등 배치하기 위해 blockWidth 계산
      if (screenWidth <= 1000) {
        const totalGapWidth = 6 * 10; // gap의 총 너비 (7개 날짜 사이에 6개의 gap)
        const availableWidth = screenWidth - totalGapWidth; // gap을 제외한 나머지 너비
        const calculatedBlockWidth = availableWidth / 7; // 7개의 날짜로 나눔

        setBlockWidth(calculatedBlockWidth); // blockWidth를 동적으로 설정
        setTimeColumnWidth(calculatedBlockWidth); // 시간 칼럼 너비도 동일하게 설정
        setBlockHeight("5vh");
      } else {
        setBlockWidth(130); // 기본 너비로 복원
        setTimeColumnWidth(110); // 기본 시간 칼럼 너비로 복원
        setBlockHeight("6vh");
      }
    };

    // 초기 너비 설정 및 resize 이벤트 추가
    updateWidths();
    window.addEventListener("resize", updateWidths);

    // cleanup
    return () => {
      window.removeEventListener("resize", updateWidths);
    };
  }, []);

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

  if (isMobile) {
    const maxVisibleDates = 6; // 한 번에 보여줄 날짜 수

    // 현재 표시할 날짜들 계산
    const visibleDates = dates.slice(startIndex, startIndex + maxVisibleDates);
    const visibleData = tableData.dates.slice(
      startIndex,
      startIndex + maxVisibleDates
    );

    // 오른쪽 화살표 클릭 핸들러
    const handleNext = () => {
      if (startIndex + maxVisibleDates < dates.length) {
        setStartIndex(startIndex + maxVisibleDates);
      }
    };

    // 왼쪽 화살표 클릭 핸들러
    const handlePrev = () => {
      if (startIndex - maxVisibleDates >= 0) {
        setStartIndex(startIndex - maxVisibleDates);
      }
    };

    return (
      <>
        <div className={`flex justify-between items-center px-2`}>
          {/* 왼쪽 화살표 */}
          <button
            className={`${
              startIndex > 0
                ? "text-[#4a4aae]"
                : "text-gray-400 cursor-not-allowed"
            }`}
            onClick={startIndex > 0 ? handlePrev : undefined} // 콘텐츠가 없으면 클릭 비활성화
            disabled={startIndex <= 0} // 콘텐츠가 없으면 버튼 비활성화
          >
            <IoIosArrowDropleft size={35} />
          </button>
          {/* 오른쪽 화살표 */}
          <div className="flex justify-center items-center">
            <div className="flex">
              {visibleDates.map((date, index) => (
                <div
                  key={index}
                  className="dates py-2 flex flex-col justify-center items-center"
                  style={{ width: `${blockWidth}px` }}
                >
                  <span className={`${roboto.className} font-[400] text-sm`}>
                    {getWeekday(date)}
                  </span>
                  <span className={`${roboto.className} font-[500] text-lg`}>
                    {date.getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button
            className={`${
              startIndex + maxVisibleDates < dates.length
                ? "text-[#4a4aae]"
                : "text-gray-400 cursor-not-allowed"
            }`}
            onClick={
              startIndex + maxVisibleDates < dates.length
                ? handleNext
                : undefined
            } // 콘텐츠가 없으면 클릭 비활성화
            disabled={startIndex + maxVisibleDates >= dates.length} // 콘텐츠가 없으면 버튼 비활성화
          >
            <IoIosArrowDropright size={35} />
          </button>
        </div>

        <div
          className="Table
      inline-flex relative justify-center rounded-[10px] pt-4 w-full"
        >
          {/* <div
            className={`bg-[#F7F7F7] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)] absolute top-0 left-0 -z-10`}
            style={{
              width: `${
                (blockWidth + 10) * dateLength + 10 + timeColumnWidth + 30
              }px `,
            }}
          /> */}
          <div
            style={{
              minWidth: `${timeColumnWidth}px`,
              position: "absolute",
              left: `${
                (6 - visibleDates.length) * (1 / 2) * timeColumnWidth + 15
              }px`,
              top: -1,
              zIndex: 1,
            }}
          >
            <div
              style={{ minWidth: `${timeColumnWidth}px`, position: "relative" }}
            >
              {hourlyLabels.map((label, index) => (
                <div
                  key={index}
                  className={`${roboto.className} font-[500] text-[10px] absolute`}
                  style={{
                    width: "27px",
                    textAlign: "right",
                    top: `calc(${index} * 2 * ${blockHeight} + ${
                      index === hourlyLabels.length - 1
                        ? (index - 1) * 4
                        : index * 4
                    }px)`,
                    height: blockHeight,
                    lineHeight: blockHeight,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="tableblock flex">
            {visibleData.map((day, dateIndex: number, dayArray) => (
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
                          slotIndex % 2 === 0
                            ? "10px 10px 0 0"
                            : "0 0 10px 10px",
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
      </>
    );
  }

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
