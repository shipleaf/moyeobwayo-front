"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import CalendarComp from "./components/createParty/CalendarComp";
import Link from "next/link";
import { Clipboard } from "@phosphor-icons/react/dist/ssr";
import SampleAvatarList from "./components/SampleAvatarList";
import SampleTimeTable from "./components/SampleTimeTable";
import Footer from "./components/common/Footer";
import MeetPageRedirectHandler from "./components/MeetPageRedirectHandler";
import { FaRegCalendarCheck } from "react-icons/fa";
import MobileHeader from "./components/common/MobileHeader";
import MemberStatusPopup from "./components/getParty/MemberStatusPopup";

const HighlightDescription = ({
  direction,
  title,
  content,
  number,
  onPrevious,
  onNext,
  onExit,
}: {
  direction: string;
  title: string;
  content: string;
  number: number;
  onPrevious: () => void;
  onNext: () => void;
  onExit: () => void;
}) => {
  const getTooltipPosition = () => {
    switch (direction) {
      case "left":
        return {
          position: "left-[20%] top-[30%]",
          tail: "after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-full after:border-8 after:border-transparent after:border-l-white",
        }; // 왼쪽에 말풍선 꼬리
      case "rightList": // 참여자 위치 fixed로 바꾸면서 다 분류해야댐 ㅅㅂ
        return {
          position: "left-[10%] top-[50%]",
          tail: "after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:right-full after:border-8 after:border-transparent after:border-r-white",
        }; // 오른쪽에 말풍선 꼬리
      case "right":
        return {
          position: "left-[10%] top-[120px]",
          tail: "after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:right-full after:border-8 after:border-transparent after:border-r-white",
        }; // 오른쪽에 말풍선 꼬리
      case "rightCalendar":
        return {
          position: "top-[10%] left-[30%]",
          tail: "after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:right-full after:border-8 after:border-transparent after:border-r-white",
        }; // 오른쪽에 말풍선 꼬리
      case "rightCreate":
        return {
          position: "bottom-[10%] left-[30%]",
          tail: "after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:right-full after:border-8 after:border-transparent after:border-r-white",
        }; // 오른쪽에 말풍선 꼬리
      default:
        return {
          position: "left-0",
          tail: "",
        }; // 기본값
    }
  };

  return (
    <div
      className={`tooltip ${getTooltipPosition().position} ${
        getTooltipPosition().tail
      } w-[25%] opacity-100 max-w-[400px] min-w-[300px] fixed bg-white text-black p-4 rounded-[5px] shadow-md z-[100000] pointer-events-auto`} // 동적으로 위치 설정
    >
      <div className="flex flex-row justify-between items-center">
        <span className="font-pretendard font-bold text-lg">{title}</span>
        <button
          className="text-[#98A8B9] cursor-pointer hover:text-black hover:font-[600]"
          onClick={onExit}
        >
          X
        </button>
      </div>
      <span className="font-pretendard text-md">{content}</span>
      <div className="flex flex-row justify-between">
        <span className="text-[#98A8B9]">{number + 1} / 6</span>
        <div className="rounded-[5px] overflow-hidden w-[25%] min-w-[70px] flex justify-between items-center">
          <button
            className={`cursor-pointer w-[50%] text-white ${
              number === 0 ? "bg-gray-400 pointer-events-none" : "bg-[#6161CE]"
            }`}
            onClick={onPrevious}
            disabled={number === 0}
          >
            이전
          </button>
          {number === 5 ? (
            <button
              className="cursor-pointer w-[50%] bg-[#6161CE] text-white"
              onClick={onExit}
            >
              종료
            </button>
          ) : (
            <button
              className={`cursor-pointer w-[50%] text-white bg-[#6161CE]`}
              onClick={onNext}
              disabled={number === 5}
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const TUTORIAL_DONE = 6;
  const TUTORIAL_KEY = "tutorialDone";
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 튜토리얼 상태 확인
    const tutorialStatus = localStorage.getItem(TUTORIAL_KEY);
    if (tutorialStatus === "true") {
      setCount(TUTORIAL_DONE); // 이미 완료된 상태라면 튜토리얼 스킵
    }
    setIsLoading(false); // 로딩 완료
  }, []);

  useEffect(() => {
    if (count === TUTORIAL_DONE) {
      return;
    }
  }, [count]);

  // 튜토리얼 완료 시 로컬 스토리지 업데이트
  const handleTutorialExit = () => {
    localStorage.setItem(TUTORIAL_KEY, "true"); // 튜토리얼 완료 저장
    setCount(TUTORIAL_DONE); // 튜토리얼 종료 상태로 설정
  };

  // 튜토리얼 단계에 따라 강조할 CSS 클래스 설정
  const getHighlightClass = (step: number) => {
    if (count === TUTORIAL_DONE) {
      return "";
    }
    return count === step
      ? "pointer-events-none"
      : "pointer-events-none opacity-20";
  };

  const handlePrevious = () => {
    setCount((prev) => Math.max(prev - 1, 0));
  };

  // 다음 버튼 핸들러
  const handleNext = () => {
    setCount((prev) => Math.min(prev + 1, TUTORIAL_DONE - 1));
  };

  if (isLoading) {
    // 로딩 중에는 튜토리얼 관련 UI를 렌더링하지 않음
    return null;
  }

  return (
    <>
      <MeetPageRedirectHandler></MeetPageRedirectHandler>
      <div className="flex items-center justify-end bg-[#6161CE] h-screen min-[740px]:p-[2%] relative">
        {/* Side Nav */}
        <div className="flex flex-col w-[10%] h-[100%] pl-[1%] items-start max-[740px]:hidden">
          <div className="flex flex-col items-center">
            <Image
              src="/images/mainLogo.png"
              alt=""
              width={80}
              height={80}
              className="mb-[50%]"
            />
            <div
              className={`link relative flex flex-col items-center ${getHighlightClass(
                0
              )}`}
            >
              {count === 0 && (
                <HighlightDescription
                  direction="right"
                  title="내 모임 모아보기"
                  content="카카오 로그인을 통해 내 모임을 모아보고 알림 여부를 설정할 수 있어요."
                  number={count}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onExit={handleTutorialExit} // 종료 핸들러 전달
                />
              )}
              <Link
                href={"/meetlist"}
                className={`content w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer mb-[50%] focus:outline-none bg-[rgba(255,255,255,0.1)] border-none`}
              >
                <Clipboard size={30} className="text-white opacity-100" />
              </Link>
              <Link
                href={"/"}
                className={`calendar w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer ${"bg-white text-black"}`}
              >
                <FaRegCalendarCheck size={30} className="text-[#777]" />
              </Link>
            </div>
          </div>
          <div
            className={`avatar relative flex flex-col items-center ${getHighlightClass(
              1
            )}`}
          >
            {count === 1 && (
              <HighlightDescription
                direction="rightList"
                title="모임 참여자 목록"
                content="여기서 모임에 투표한 참여자들을 모아볼 수 있어요. 아이콘을 클릭하면 해당 유저가 투표한 내용만 확인할 수 있어요."
                number={count}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onExit={handleTutorialExit} // 종료 핸들러 전달
              />
            )}
            <SampleAvatarList />
          </div>
        </div>
        <div
          className={`relative page w-[90%] max-[740px]:w-full h-[100%] bg-white min-[740px]:rounded-[20px] z-50 p-[2%] max-[740px]:px-[13px] overflow-y-auto`}
        >
          <div className="flex flex-row max-[740px]:flex-col h-[100%]">
            <MobileHeader></MobileHeader>
            <div
              className={`relative mr-[2%] min-[740px]:basis-1/4 overflow-auto ${
                count === 2 || count === 3
                  ? "pointer-events-none"
                  : getHighlightClass(2)
              }`}
            >
              {count === 2 && (
                <HighlightDescription
                  direction="rightCalendar"
                  title="일정 설정하기"
                  content="날짜를 선택하고, 시작 시간과 종료 시간을 설정한 후, 제목과 설명을 입력하세요."
                  number={count}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onExit={handleTutorialExit} // 종료 핸들러 전달
                />
              )}
              {count === 3 && (
                <HighlightDescription
                  direction="rightCreate"
                  title="일정 생성하기"
                  content="카카오 유저에게 알림톡을 보내고 싶다면 인원수를 설정해주세요. 모든 설정을 완료하셨다면 ‘일정 생성하기’ 버튼을 눌러 일정을 생성하세요. (버튼이 보이지 않을 경우 스크롤을 내려 확인해주세요."
                  number={count}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onExit={handleTutorialExit} // 종료 핸들러 전달
                />
              )}
              <CalendarComp />
            </div>
            <div
              className={`relative flex flex-col gap-[20px] basis-3/4 max-[740px]:hidden ${
                count === 4 || count === 5
                  ? "pointer-events-none"
                  : getHighlightClass(4)
              }`}
            >
              {count === 4 && (
                <HighlightDescription
                  direction="left"
                  title="투표 현황보기"
                  content="타임 테이블에서 현재 투표된 일정을 확인해보세요. 색상이 짙어질수록 더 많은 참여자가 투표한 거예요."
                  number={count}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onExit={handleTutorialExit}
                />
              )}
              {count === 5 && (
                <>
                  <HighlightDescription
                    direction="left"
                    title="투표 현황보기"
                    content="타임 테이블에 마우스 커서를 올려서 해당 시간의 투표 현황을 알 수 있어요."
                    number={count}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onExit={handleTutorialExit}
                  />
                  <div className="absolute left-[30%] top-[20%]">
                    <MemberStatusPopup
                      time="FRI 29 10:30"
                      targetDate={new Date("FRI NOV 29 2024 04:45:45 GMT+0900")}
                      maxVotes={3}
                      votes={1}
                      votedUsersData={[
                        {
                          name: "존",
                          src: "/images/sample_avatar2.png",
                        },
                      ]}
                    />
                  </div>
                </>
              )}
              <SampleTimeTable />
            </div>
          </div>
          <Footer></Footer>
        </div>
        <div
          className={`absolute transition-all duration-300 z-0 ${"top-[32%] left-[10.5%]"}`}
        >
          <div
            className={`${getHighlightClass(
              12
            )}w-16 h-16 bg-white rounded-[20%] transform rotate-45 shadow-lg`}
          ></div>
        </div>
      </div>
    </>
  );
}
