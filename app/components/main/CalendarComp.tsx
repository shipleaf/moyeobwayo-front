"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaMinus } from "react-icons/fa6";

export default function CalendarComp() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartToggled, setIsStartToggled] = useState(false); // 시작 시간 AM/PM 상태
  const [isEndToggled, setIsEndToggled] = useState(false); // 종료 시간 AM/PM 상태
  const [totalPeople, setTotalPeople] = useState<number>(1); // 총 인원수 상태
  const [startTime, setStartTime] = useState<string>("09:00"); // 시작 시간
  const [endTime, setEndTime] = useState<string>("18:00"); // 종료 시간
  const [title, setTitle] = useState<string>(""); // 제목
  const [subTitle, setSubTitle] = useState<string>(""); // 부제

  // Start time toggle
  const toggleStartTime = () => setIsStartToggled(!isStartToggled);

  // End time toggle
  const toggleEndTime = () => setIsEndToggled(!isEndToggled);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const incrementPeople = () => setTotalPeople((prev) => prev + 1);
  const decrementPeople = () => {
    if (totalPeople > 1) {
      setTotalPeople((prev) => prev - 1); // 1명 이하로 줄지 않게
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setTotalPeople(value);
    }
  };

  // 제출 시 JSON 객체를 console.log
  const handleSubmit = () => {
    const data = {
      startDate,
      endDate,
      startTime,
      endTime,
      title,
      subTitle,
      totalPeople,
    };
    console.log("Submitted Data: ", JSON.stringify(data, null, 2));
  };

  useEffect(() => {
    // 날짜 선택 영역의 요일 이름을 커스터마이즈하는 함수
    const customizeWeekDays = () => {
      const dayNames = document.querySelectorAll(".react-datepicker__day-name");
      const customNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      dayNames.forEach((element, index) => {
        element.textContent = customNames[index];
      });
    };

    customizeWeekDays(); // 컴포넌트가 로드될 때 요일 이름 변경
  }, []);

  return (
    <div className="mr-[2%]">
      <div className="flex flex-col basis-1/4 flex-none items-center justify-center bg-custom-bg border border-solid shadow-custom-shadow backdrop-blur-custom-blur rounded-custom">
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />
        <hr className="w-[90%] border border-1 border-[#ECECED] my-[1%]"/>
        <div className="flex flex-row align-center justify-between bg-white w-[84%] py-[5px]">
          <span className="w-[15%] font-pretendard font-[500] text-[18px]">
            Starts
          </span>
          <div className="flex flex-row justify-end">
            <input
              placeholder="09:00"
              onChange={(e) => setStartTime(e.target.value)}
              className="w-[25%] pr-[5px] mr-[5%] focus:outline-none rounded-[4.216px] bg-[rgba(120,120,128,0.12)] placeholder-black font-pretendard font-[500] text-right"
            />
            <button
              onClick={toggleStartTime}
              className="w-[35%] h-8 flex z-2 flex-row items-center relative p-1 transition-colors duration-300 bg-custom-gray rounded-[6px]"
            >
              <span className="z-10 w-[50%] text-black font-pretendard font-[500]">
                AM
              </span>
              <div
                className={`toggle absolute bg-white w-[48%] h-6 rounded-[10px] shadow-md transform transition-transform duration-300 z-0 ${
                  isStartToggled ? "translate-x-10" : ""
                }`}
              ></div>
              <span className="z-10 w-[50%] text-black font-pretendard font-[500]">
                PM
              </span>
            </button>
          </div>
        </div>
        <div className="flex flex-row align-center justify-between bg-white w-[84%] py-[5px]">
          <span className="w-[15%] font-pretendard font-[500] text-[18px]">
            Ends
          </span>
          <div className="flex flex-row justify-end">
            <input
              placeholder="18:00"
              onChange={(e) => setEndTime(e.target.value)}
              className="w-[25%] mr-[5%] pr-[5px] focus:outline-none rounded-[4.216px] bg-[rgba(120,120,128,0.12)] text-right font-pretendard font-[500] placeholder-black"
            />
            <button
              onClick={toggleEndTime}
              className="w-[35%] h-8 flex z-2 flex-row items-center relative p-1 transition-colors duration-300 bg-custom-gray rounded-[6px]"
            >
              <span className="z-10 w-[50%] text-black font-pretendard font-[500]">
                AM
              </span>
              <div
                className={`toggle absolute bg-white w-[48%] h-6 rounded-[10px] shadow-md transform transition-transform duration-300 z-0 ${
                  isEndToggled ? "translate-x-10" : ""
                }`}
              ></div>
              <span className="z-10 w-[50%] text-black font-pretendard font-[500]">
                PM
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center bg-custom-bg border border-solid shadow-custom-shadow backdrop-blur-custom-blur rounded-custom mt-[5%] p-[4%] pl-[10%]">
        <div className="flex flex-col items-start">
          <span className="text-[18px] mb-[3%] font-pretendard font-[600] text-[#222] text-[15px]">
            Title
          </span>
          <input
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-[5%] text-[18px] focus:outline-none font-pretendard"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[18px] mb-[3%] font-pretendard font-[600] text-[15px] text-[#222]">
            Sub
          </span>
          <input
            placeholder="설명을 입력해주세요"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            className="text-[18px] focus:outline-none font-pretendard"
          />
        </div>
      </div>
      {/* 총 인원수 컨트롤하는 섹션 */}
      <div className="number flex flex-col items-start justify-center bg-custom-bg border border-solid shadow-custom-shadow backdrop-blur-custom-blur rounded-custom mt-[5%] p-[4%] pl-[2%]">
        <span className="text-[18px] mb-[5%] font-bold pl-[8%] font-pretendard">
          총 인원
        </span>
        <div className="flex flex-row items-center justify-between w-full px-[8%]">
          <button
            onClick={decrementPeople}
            className="w-11 h-11 bg-[#9F9F9F] rounded-full flex items-center justify-center text-2xl text-white"
          >
            <FaMinus size={15} />
          </button>
          <input
            type="number"
            value={totalPeople}
            onChange={handleInputChange}
            className="w-[60%] h-[40px] text-center text-xl focus:outline-none rounded-[32.988px] bg-[#EEE] appearance-none font-bold"
            min="1"
          />
          <style jsx>{`
            /* Chrome, Safari, Edge, Opera 스피너 없애기*/
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            /* Firefox */
            input[type="number"] {
              -moz-appearance: textfield;
            }
          `}</style>
          <button
            onClick={incrementPeople}
            className="w-11 h-11 bg-[#9F9F9F] rounded-full flex items-center justify-center text-2xl text-white"
          >
            <FaPlus size={15} />
          </button>
        </div>
      </div>
      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        className="mt-[5%] w-[100%] bg-[#6161CE] text-white font-bold py-2 px-4 rounded-[32.988px] hover:bg-blue-600"
      >
        일정 생성하기
      </button>
    </div>
  );
}
