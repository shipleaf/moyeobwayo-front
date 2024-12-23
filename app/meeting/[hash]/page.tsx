"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation"; // App Router에서 useParams 사용
import { getTable, GetTableResponse } from "@/app/api/getTableAPI"; // API 호출 주석 처리
import { GoShareAndroid } from "react-icons/go";
import { useRecoilState, useSetRecoilState } from "recoil";
// import { selectedAvatarState } from "@/app/recoil/atom";
import { MdContentPaste } from "react-icons/md";
// import { HiUserCircle } from "react-icons/hi2";
import TimeTable from "@/app/components/createParty/TimeTable";
import Image from "next/image";
import Modal from "react-modal";
import {
  kakaoUserState,
  userIdValue,
  userNumberState,
} from "@/app/recoil/atom";
import KakaoLogin from "@/app/components/login/KakaoLogin";
import TimeSelector from "@/app/components/getParty/VoteTable";
import PartyPriority from "@/app/components/getParty/PartyPriority";
import TableLogin from "@/app/components/login/TableLogin";
import { Party } from "@/app/api/getTableAPI"; // interfaces 파일의 경로
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getUserAvatar,
  GetUserAvatarResponse,
} from "@/app/api/getUserAvatarAPI";
import { loadFromLocalStorage } from "@/app/recoil/recoilUtils";
import { decodeJWT } from "@/app/utils/jwtUtils";
import { LoginData } from "@/app/api/tableLogin";
import { tableLoginHandler } from "@/app/utils/tableLoginCallback";
import { GetCompleteResponse, getDecision } from "@/app/api/partyCompleteAPI";
// import { tableRefreshTrigger } from "@/app/recoil/atom";
import { FaRegCalendarCheck } from "react-icons/fa";
import MeetingMobileBody from "../components/MeetingMobileBody";
import BottomSheet from "../components/MeetingMobileBottomSheet";
import { LuAlarmClock } from "react-icons/lu";
import { Jua } from "next/font/google";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { BiSolidNoEntry } from "react-icons/bi";
import { FaMinus, FaPlus } from "react-icons/fa6";
import MobileHeader from "@/app/components/common/MobileHeader";
import LinkShareModal from "./components/LinkShareModal";

const jua = Jua({
  weight: "400", // 폰트 굵기 설정
  subsets: ["latin"], // 필요한 언어 설정
  display: "swap", // FOUT 방지
});

export interface TableData {
  party: Party;
  formattedDates: string[];
  startTime: string;
  endTime: string;
  dates: {
    dateId: number;
    selected_date: string;
    convertedTimeslots: {
      userId: number;
      userName: string;
      byteString: string;
    }[];
  }[];
}

export default function MeetingPage() {
  const router = useRouter();
  const { hash } = useParams(); // meetingId를 URL에서 추출
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [originalTableData, setOriginalTableData] =
    useState<GetTableResponse | null>(null);
  const [, setLoading] = useState(false);
  const [users, setUsers] = useState<GetUserAvatarResponse[]>([]);
  const [selectedAvatar, setSelectedAvatar] =
    useState<GetUserAvatarResponse | null>(null);
  const [hoveredAvatar, setHoveredAvatar] =
    useState<GetUserAvatarResponse | null>(null);
  const setGlobalTotalNum = useSetRecoilState(userNumberState);

  const [selectedButton, setSelectedButton] = useState<"calendar" | "content">(
    "calendar"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLinkShareModalOpen, setIsLinkShareModalOpen] = useState(true);
  const [globalKakaoState, setGlobalKakaoState] =
    useRecoilState(kakaoUserState); // Recoil 상태 사용
  const [globalUserId, setGlobalUserId] = useRecoilState(userIdValue);
  const [possibleUsers, setPossibleUsers] = useState<string[]>([]);
  const [impossibleUsers, setImpossibleUsers] = useState<string[]>([]);
  const [decisionTime, setDecisionTime] = useState<string>("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [decisionEndTime, setDecisionEndTine] = useState<string>("");

  const handleLogoClick = () => {
    router.push(`/`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //초기 랜더링시 작동 callback
  useEffect(() => {
    const fetchKakaoData = async () => {
      const jwt = await loadFromLocalStorage("kakaoUserJWT");
      if (jwt) {
        const kakaoData = decodeJWT(jwt);
        const KakaoData_obj = {
          nickname: kakaoData?.nickname as string,
          kakaoUserId: kakaoData?.kakao_user_id as number,
          profile_image: kakaoData?.profile_image as string,
        };

        const loginDate: LoginData = {
          userName: KakaoData_obj.nickname,
          password: null,
          partyId: hash as string,
          isKakao: true,
          kakaoUserId: KakaoData_obj.kakaoUserId,
        };
        await tableLoginHandler(loginDate, setGlobalUserId);

        setGlobalKakaoState(KakaoData_obj);
      }
    };
    if (hash) {
      setLoading(true);

      // 두 개의 API 요청을 동시에 호출
      Promise.all([
        getTable({ table_id: hash as string }),
        getUserAvatar({ table_id: hash as string }),
      ])
        .then(([tableDataResponse, userAvatarResponse]) => {
          setOriginalTableData(tableDataResponse);

          const dates = tableDataResponse.party.dates.map((date) => {
            const localDate = new Date(date.selected_date);
            return localDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD 형식으로 변환
          });

          const timeslots = tableDataResponse.party.dates.map((date) => ({
            dateId: date.dateId as number,
            selected_date: date.selected_date as string,
            convertedTimeslots: (date.convertedTimeslots || []).map((slot) => ({
              userId: slot.userId as number,
              userName: slot.userName as string,
              byteString: slot.byteString as string,
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

          // 두 번째 API 응답 처리
          setUsers(userAvatarResponse);
          setGlobalTotalNum(userAvatarResponse.length);

          // 상태 업데이트
          setTableData({
            ...tableDataResponse,
            formattedDates: dates,
            startTime: startTime,
            endTime: endTime,
            dates: timeslots,
          });
          fetchKakaoData();
          setLoading(false); // API 호출이 끝나면 loading 해제
        })
        .catch((error) => {
          console.error("에러 발생: ", error);
        })
        .finally(() => {
          setLoading(false); // 모든 API 호출이 끝나면 loading 해제
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const formatDecisionTime = (startTime: string, endTime: string) => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const startDate = new Date(startTime);

    const month = startDate.getMonth() + 1; // 월은 0부터 시작하므로 +1
    const day = startDate.getDate();
    const dayOfWeek = daysOfWeek[startDate.getDay()];

    const startHours = startDate.getHours();
    const startMinutes = startDate.getMinutes();
    const formattedStartHours = startHours % 12 || 12; // 0을 12로 변환
    const startAmPm = startHours >= 12 ? "PM" : "AM";
    const formattedStartMinutes = startMinutes.toString().padStart(2, "0");

    const endDate = new Date(endTime);
    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes();
    const formattedEndHours = endHours % 12 || 12; // 0을 12로 변환
    const endAmPm = endHours >= 12 ? "PM" : "AM";
    const formattedEndMinutes = endMinutes.toString().padStart(2, "0");

    // 같은 날짜를 가정하고 출력
    return `${month}월 ${day}일 (${dayOfWeek}) ${formattedStartHours}:${formattedStartMinutes} ${startAmPm} ~ ${formattedEndHours}:${formattedEndMinutes} ${endAmPm}`;
  };

  const formattedDecisionTime = formatDecisionTime(
    decisionTime,
    decisionEndTime
  );

  const resetSelection = () => setSelectedAvatar(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        resetSelection();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resetSelection();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  useEffect(() => {
    if (tableData?.party.decisionDate && hash) {
      getDecision({ table_id: hash as string })
        .then((decisionData: GetCompleteResponse) => {
          setPossibleUsers(decisionData.possibleUsers);
          setImpossibleUsers(decisionData.impossibleUsers);
          setDecisionTime(decisionData.startTime);
          setDecisionEndTine(decisionData.endTime);
        })
        .catch((error) => {
          console.error("getDecision API 호출 에러:", error);
        });
    }
  }, [tableData?.party.decisionDate, hash]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px 이하를 모바일로 간주
    };

    handleResize(); // 초기 화면 크기 확인
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScrollControl = () => {
      if (isMobile) {
        document.body.style.overflow = "auto"; // 모바일이면 스크롤 활성화
      } else {
        document.body.style.overflow = "hidden"; // 모바일이 아니면 스크롤 비활성화
      }
    };

    handleScrollControl(); // 초기 실행

    return () => {
      document.body.style.overflow = "auto"; // 컴포넌트 언마운트 시 스크롤 활성화
    };
  }, [isMobile]); // isMobile 상태가 변경될 때마다 실행

  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLUListElement | null>(null); // 컨텐츠 참조

  const [isPossibleAccordianOpen, setIsPossibleAccordianOpen] = useState(false); // 아코디언 열림 상태
  const [isImpossibleAccordianOpen, setImpossibleIsAccordianOpen] =
    useState(false); // 아코디언 열림 상태

  const toggleAccordion = () => {
    setIsPossibleAccordianOpen(!isPossibleAccordianOpen);
  };

  const toggleImpossibleAccordion = () => {
    setImpossibleIsAccordianOpen(!isImpossibleAccordianOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isImpossibleAccordianOpen
        ? `${contentRef.current.scrollHeight}px`
        : "0";
    }
  }, [isImpossibleAccordianOpen]);

  if (isMobile) {
    if (!tableData?.party.decisionDate) {
      return (
        <div>
          <div className="p-2">
            <MobileHeader endpoint="home" />
          </div>
          <div className="body bg-[rgb(216,216,255)] bg-opacity-50 rounded-[10px] relative pb-[25px]">
            <MeetingMobileBody
              tableData={originalTableData}
              userAvatar={users}
            />
            <LinkShareModal
              partyId={hash as string}
              isOpen={isLinkShareModalOpen}
              onClose={() => {
                setIsLinkShareModalOpen(false);
              }}
            />
            <div
              className={`flex flex-row gap-1 justify-center items-center ${jua.className} text-[#6161CE]`}
            >
              <LuAlarmClock />
              <span className="flex items-center justify-center">
                현재 투표된 시간
              </span>
              <LuAlarmClock />
            </div>
            <TimeTable
              userList={users}
              setUserList={setUsers}
              selectedUserId={selectedAvatar?.userId}
              isMobile={isMobile}
            />
            <div className="fixed-btn-container">
              <button
                className={`${jua.className} text-sm fixed-btn`}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                투표하기
              </button>
            </div>
          </div>
          <BottomSheet
            isMobile={isMobile}
            tableData={tableData}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            decisionTime={decisionTime}
            globalKakaoState={globalKakaoState}
            globalUserId={globalUserId}
          />
        </div>
      );
    } else {
      return (
        <div>
          <MobileHeader endpoint="home" />
          <MeetingMobileBody tableData={originalTableData} userAvatar={users} />
          <div className="pl-[5%] flex flex-row h-[30%] w-full items-center gap-1 mb-[10px]">
            <div
              className={`font-pretendard text-md font-[600] text-[#686868] text-center ${jua.className}`}
            >
              {"모임장"}
            </div>
            {users
              .filter((user) => user.userName === tableData?.party.userId)
              .map((user, index) => (
                <div key={user.userId}>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {user.profileImage == null ? (
                      <Image
                        src={`/images/sample_avatar${(index % 3) + 1}.png`}
                        alt={user.userName}
                        width={25}
                        height={25}
                        className="rounded-full"
                      />
                    ) : (
                      <Image
                        src={user.profileImage}
                        alt={user.userName}
                        width={25}
                        height={25}
                        className="rounded-full"
                      />
                    )}
                    <div className="inset-0 rounded-full bg-[#6161CE] backdrop-blur-[2px]"></div>
                  </div>
                </div>
              ))}
            <div
              className={`text-center text-sm font-pretendard font-[600] ${jua.className}`}
            >
              {tableData?.party.userId.split("(")[0]}님
            </div>
          </div>
          <span className={`${jua.className} pl-[5%]`}>
            {formattedDecisionTime}
          </span>
          <div className="flex flex-col w-full items-center justify-center gap-[20%] pt-[2%]">
            <div className="mb-4 w-full flex flex-col items-center">
              <button
                onClick={toggleAccordion}
                className="border w-[90%] p-2 flex flex-row gap-1 items-center justify-between text-lg font-bold text-[#6161CE] mb-2 hover:bg-[#efefef]"
              >
                <div className="flex flex-row items-center gap-1">
                  <IoIosCheckmarkCircle />
                  <span>참여 가능</span>
                </div>
                {isPossibleAccordianOpen ? (
                  <FaMinus size={20} />
                ) : (
                  <FaPlus size={20} />
                )}
              </button>
              {isPossibleAccordianOpen && (
                <ul className="list-none space-y-2">
                  {tableData?.party.decisionDate &&
                    possibleUsers.map((user, index) => (
                      <li
                        key={index}
                        className="flex flex-col items-center gap-1 text-gray-700 text-sm"
                      >
                        <span className="w-8 h-8 rounded-full bg-[#ddd] flex items-center justify-center text-white">
                          {user.charAt(0)}
                        </span>
                        <span className="font-pretendard font-[600] text-[10px]">
                          {user.split("(")[0]}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <div className="mb-4 w-full flex flex-col items-center">
              <button
                onClick={toggleImpossibleAccordion}
                className="border w-[90%] flex flex-row gap-1 justify-between items-center p-2 hover:bg-[#efefef] text-lg font-bold text-[#aaa] mb-2"
              >
                <div className="flex flex-row items-center gap-1">
                  <BiSolidNoEntry />
                  <span>참여 불가능</span>
                </div>
                {isImpossibleAccordianOpen ? (
                  <FaMinus size={20} />
                ) : (
                  <FaPlus size={20} />
                )}
              </button>
              {isImpossibleAccordianOpen && (
                <ul className="grid grid-cols-3 gap-4 mt-2">
                  {tableData?.party.decisionDate ? (
                    impossibleUsers.length > 0 ? (
                      impossibleUsers.map((user, index) => (
                        <li
                          key={index}
                          className="flex flex-col items-center gap-2 text-gray-700 text-sm"
                        >
                          <span className="w-8 h-8 rounded-full bg-[#ddd] flex items-center justify-center text-white">
                            {user.charAt(0)}
                          </span>
                          <span className="font-pretendard font-[600] text-[10px]">
                            {user.split("(")[0]}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li
                        className={`${jua.className} col-span-3 flex justify-center text-gray-500 text-sm`}
                      >
                        불가능한 유저가 없습니다.
                      </li>
                    )
                  ) : null}
                </ul>
              )}
            </div>
          </div>
          <div className="body bg-[#7878801E] bg-opacity-50 rounded-[10px] relative pb-[25px] pt-[25px]">
            {tableData.party.decisionDate ? (
              <div
                className={`flex flex-row gap-1 justify-center items-center ${jua.className} text-[#6161CE]`}
              >
                <LuAlarmClock />
                <span className="flex items-center justify-center">
                  완료된 투표
                </span>
                <LuAlarmClock />
              </div>
            ) : (
              <div
                className={`flex flex-row gap-1 justify-center items-center ${jua.className} text-[#6161CE]`}
              >
                <LuAlarmClock />
                <span className="flex items-center justify-center">
                  현재 투표된 시간
                </span>
                <LuAlarmClock />
              </div>
            )}

            <TimeTable
              userList={users}
              setUserList={setUsers}
              selectedUserId={selectedAvatar?.userId}
              isMobile={isMobile}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <div className="flex items-center justify-end bg-[#6161CE] h-screen p-[2%] relative">
        <div className="flex flex-col w-[10%] h-[100%] pl-[1%] items-start">
          <LinkShareModal
            partyId={hash as string}
            isOpen={isLinkShareModalOpen}
            onClose={() => {
              setIsLinkShareModalOpen(false);
            }}
          />
          <div className="flex flex-col items-center h-full">
            <Image
              src="/images/mainLogo.png"
              alt=""
              width={80}
              height={80}
              className="mb-[50%] cursor-pointer"
              onClick={handleLogoClick}
            />
            <div className="flex flex-col items-center">
              <Link
                href={"/meetlist"}
                className={`content w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer mb-[50%] ${
                  selectedButton === "content"
                    ? "bg-white text-black"
                    : "bg-[rgba(255,255,255,0.1)] border-none"
                }`}
              >
                <MdContentPaste
                  size={30}
                  className={`${
                    selectedButton === "content"
                      ? "text-black"
                      : "text-white opacity-100"
                  }`}
                />
              </Link>
              <button
                onClick={() => setSelectedButton("calendar")}
                className={`calendar w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer ${
                  selectedButton === "calendar"
                    ? "bg-white text-black"
                    : "bg-[rgba(255,255,255,0.1)] border-none"
                }`}
              >
                <FaRegCalendarCheck
                  size={30}
                  className={`${
                    selectedButton === "calendar"
                      ? "text-[#777]"
                      : "text-white opacity-100 "
                  }`}
                />
              </button>
              <div className="flex flex-col mt-8" ref={containerRef}>
                {users.map((user, index) => (
                  <div
                    key={user.userId}
                    onClick={() => setSelectedAvatar(user)} // Hover 시 avatar 선택
                    className={`relative w-[80px] h-[80px] rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 ${
                      selectedAvatar?.userId === user.userId ||
                      hoveredAvatar?.userId === user.userId
                        ? "translate-y-[-20px] ring-2 ring-purple-400"
                        : "hover:translate-y-[-20px] hover:ring-2 hover:ring-purple-400"
                    }`}
                    onMouseEnter={() => setHoveredAvatar(user)} // Hover 시 상태 업데이트
                    onMouseLeave={() => setHoveredAvatar(null)} // Hover 해제 시 상태 초기화
                    style={{
                      top: `${index * -45}px`,
                      zIndex: 10 + index,
                    }}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      {user.profileImage == null ? (
                        <div
                          className="w-[79px] h-[79px] rounded-full bg-[#ddd] flex items-center justify-center text-white text-xl font-bold"
                          style={{ fontSize: "24px" }} // 글자 크기 조정
                        >
                          {user.userName.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <Image
                          src={user.profileImage}
                          alt={user.userName}
                          width={79}
                          height={79}
                          className="rounded-full"
                        />
                      )}
                      <div className="inset-0 rounded-full bg-[#6161CE] backdrop-blur-[2px]"></div>
                    </div>
                    {(selectedAvatar?.userId === user.userId ||
                      hoveredAvatar?.userId === user.userId) && (
                      <div
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md shadow-md text-xs text-gray-700"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {user.userName.split("(")[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {tableData?.party.decisionDate ? (
          <div className="w-[90%] h-[100%] bg-white rounded-[20px] z-50 p-[2%] flex flex-col gap-[2%]">
            <div className="w-[65%] rounded-[10px] h-[10%] box-border">
              <div className="Title font-pretendard text-[25px] font-[600] flex flex-row box-border items-center justify-start gap-2">
                <div className="font-pretendard text-[25px] font-[600] flex flex-row">
                  {tableData?.party.partyName}
                </div>
                <div className="ml-[2%] py-[6px] px-3 font-pretendard text-[15px] rounded-[50px] border-1  bg-[#6161CE] text-white ">
                  확정
                </div>
                <div
                  className="flex items-center justify-center rounded-full border w-[4%] aspect-square bg-white cursor-pointer"
                  style={{
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // 원하는 그림자 값
                  }}
                  onClick={() => {
                    navigator.clipboard
                      .writeText(window.location.href)
                      .then(() => {
                        alert("링크가 클립보드에 복사되었습니다!");
                      })
                      .catch((err) => {
                        console.error("링크 복사 중 오류가 발생했습니다:", err);
                        alert("링크 복사에 실패했습니다.");
                      });
                  }}
                >
                  <GoShareAndroid size={18} />
                </div>
              </div>
              <div className="font-pretendard text-[18px] font-[400] text-[#5E5E5E] pl-2">
                {tableData?.party.partyDescription}
              </div>
            </div>
            <div className="flex flex-row w-full h-[90%] gap-[5%]">
              <div className="w-[65%] h-full">
                <TimeTable
                  userList={users}
                  setUserList={setUsers}
                  selectedUserId={selectedAvatar?.userId}
                  isMobile={isMobile}
                />
              </div>
              <div className="w-[30%] h-full flex flex-col items-center justify-between">
                <div className="flex flex-col h-[30%] gap-[10%] w-full items-center mb-[10px]">
                  <div className="w-full font-pretendard text-[24px] font-[600] text-[#686868] text-center">
                    {"모임장"}
                  </div>
                  {users
                    .filter((user) => user.userName === tableData?.party.userId)
                    .map((user, index) => (
                      <div key={user.userId}>
                        <div className="w-full h-full rounded-full overflow-hidden">
                          {user.profileImage == null ? (
                            <Image
                              src={`/images/sample_avatar${
                                (index % 3) + 1
                              }.png`}
                              alt={user.userName}
                              width={79}
                              height={79}
                              className="rounded-full"
                            />
                          ) : (
                            <Image
                              src={user.profileImage}
                              alt={user.userName}
                              width={79}
                              height={79}
                              className="rounded-full"
                            />
                          )}
                          <div className="inset-0 rounded-full bg-[#6161CE] backdrop-blur-[2px]"></div>
                        </div>
                      </div>
                    ))}
                  <div className="text-center font-pretendard font-[600]">
                    {tableData?.party.userId.split("(")[0]}
                  </div>
                </div>
                <div className="flex flex-row w-full h-[30%] items-start justify-center gap-[20%] overflow-auto">
                  <div className="mb-4">
                    <h3 className="font-pretendard text-lg font-bold text-[#6161CE] mb-2">
                      참여 가능
                    </h3>
                    <ul className="list-none space-y-2">
                      {tableData?.party.decisionDate &&
                        possibleUsers.map((user, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-gray-700 text-sm"
                          >
                            <span className="w-8 h-8 rounded-full bg-[#ddd] flex items-center justify-center text-white">
                              {user.charAt(0)}
                            </span>
                            <span className="font-pretendard font-[600] text-sm">
                              {user.split("(")[0]}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-pretendard text-lg font-bold text-[#FF6B6B] mb-2">
                      참여 불가능
                    </h3>
                    <ul className="list-none space-y-2">
                      {tableData?.party.decisionDate &&
                        impossibleUsers.map((user, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-gray-700 text-sm"
                          >
                            <span className="w-8 h-8 rounded-full bg-[#ddd] flex items-center justify-center text-white">
                              {user.charAt(0)}
                            </span>
                            <span className="font-pretendard font-[600] text-sm">
                              {user.split("(")[0]}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <PartyPriority decisionTime={decisionTime} />
              </div>
            </div>
          </div>
        ) : (
          <div className="page w-[90%] h-[100%] bg-white rounded-[20px] z-50 p-[2%] flex flex-row">
            <div className="flex flex-col mr-[2%] items-center w-[25%]">
              <div className="w-full flex flex-col mb-[10px]">
                <span className="font-pretendard font-[600] text-[30px] text-[#6161CE]">
                  {tableData?.party.partyName}
                </span>
                <span className="font-pretendard font-[400] text-[15px] text-[#aaa] pl-[2%]">
                  {tableData?.party.partyDescription}
                </span>
              </div>
              <PartyPriority />
              {(globalKakaoState.kakaoUserId !== null || globalUserId) &&
              tableData ? (
                <TimeSelector isMobile={isMobile} party={tableData.party} />
              ) : (
                <TableLogin isMobile={isMobile} />
              )}
            </div>
            <div className="w-[75%]">
              {tableData !== null && (
                <TimeTable
                  userList={users}
                  setUserList={setUsers}
                  selectedUserId={selectedAvatar?.userId}
                  isMobile={isMobile}
                />
              )}
            </div>
          </div>
        )}
        <div
          className={`toggle absolute transition-all duration-300 z-0 ${
            selectedButton === "calendar"
              ? "top-[31%] left-[10.5%]"
              : "top-[18%] left-[10.5%]"
          }`}
        >
          <div className="w-16 h-16 bg-white rounded-[20%] transform rotate-45 shadow-lg"></div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
      >
        <KakaoLogin />
      </Modal>
    </>
  );
}
