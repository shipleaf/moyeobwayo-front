"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { createTable, SubmitData } from "@/app/api/createTable";
import { useRecoilState } from "recoil";
import { loginState, userIdValue } from "@/app/recoil/atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loginValue } from "@/app/recoil/atom";
import TableLogin from "@/app/components/login/TableLogin";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import { tableLogin, LoginData } from "@/app/api/tableLogin";

export default function CalendarComp() {
  const router = useRouter();

  const [selectedDates, setSelectedDates] = useState<Date[]>([]); // 다중 날짜 선택
  const [isStartToggled, setIsStartToggled] = useState(false); // 시작 시간 AM/PM 상태
  const [isEndToggled, setIsEndToggled] = useState(false); // 종료 시간 AM/PM 상태
  const [totalPeople, setTotalPeople] = useState<number>(1); // 총 인원수 상태
  const [isTotalPeopleUnset, setIsTotalPeopleUnset] = useState<boolean>(false); // 총 인원 미정 상태
  const [startTime, setStartTime] = useState<number>(9); // 시작 시간 (1 ~ 12)
  const [endTime, setEndTime] = useState<number>(15); // 종료 시간 (1 ~ 12)
  const [title, setTitle] = useState<string>(""); // 제목
  const [subTitle, setSubTitle] = useState<string>(""); // 부제
  const [isLoggedIn, setIsLoggedIn] = useRecoilState<boolean>(loginState);
  const [userId, setUserId] = useRecoilState<number>(userIdValue);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const userName = useRecoilValue(loginValue);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const toggleStartTime = () => setIsStartToggled(!isStartToggled);
  const toggleEndTime = () => setIsEndToggled(!isEndToggled);

  // 날짜 선택 핸들러
  const handleDateChange = (date: Date) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(
        selectedDates.filter((d) => d.getTime() !== date.getTime())
      );
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const incrementPeople = () => setTotalPeople((prev) => prev + 1);
  const decrementPeople = () => {
    if (totalPeople > 1) {
      setTotalPeople((prev) => prev - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setTotalPeople(value);
    }
  };

  const handleCheckboxChange = () => {
    setIsTotalPeopleUnset(!isTotalPeopleUnset);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTime(parseInt(e.target.value));
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTime(parseInt(e.target.value));
  };

  const calculateTime = (time: number, isPM: boolean) => {
    if (isPM && time < 12) {
      return time + 12; // PM일 때 12시간을 더함
    } else if (!isPM && time === 12) {
      return 0; // AM 12시일 때는 0시로 변경
    }
    return time;
  };

  // 제출 시 JSON 객체를 console.log
  const handleSubmit = async () => {
    if (userName.userId.trim() === "") {
      handleOpenModal(); // 로그인이 안 되어있다면 모달 띄우기
      return;
    }
    // startHour와 endHour는 AM/PM 계산을 통해 얻어짐
    const startHour = calculateTime(startTime, isStartToggled);
    const endHour = calculateTime(endTime, isEndToggled);

    // 첫 번째 선택된 날짜에 startHour 추가
    const firstSelectedDate =
      selectedDates.length > 0 ? selectedDates[0] : null;
    // 마지막 선택된 날짜에 endHour 추가
    const lastSelectedDate =
      selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null;

    let startDateTime: Date | null = null;
    let endDateTime: Date | null = null;

    if (firstSelectedDate) {
      startDateTime = new Date(firstSelectedDate);
      startDateTime.setHours(startHour, 0, 0, 0); // 시작 시간 적용
    }

    if (lastSelectedDate) {
      endDateTime = new Date(lastSelectedDate);
      endDateTime.setHours(endHour, 0, 0, 0); // 종료 시간 적용
    }

    // 인터페이스 SubmitData에 맞게 데이터를 매핑
    const dataToSubmit: SubmitData = {
      participants: totalPeople,
      partyTitle: title,
      partyDescription: subTitle,
      startTime: startDateTime as Date, // Date 형식으로 전송
      endTime: endDateTime as Date, // Date 형식으로 전송
      dates: selectedDates,
      decisionDate: new Date(), // 버튼을 누른 시점의 시간 기록
      user_id: userName.userId,
    };

    console.log("Submitted Data: ", JSON.stringify(dataToSubmit, null, 2));

    try {
      const result = await createTable(dataToSubmit); // API 호출 시 SubmitData 인터페이스 사용
      const hash = result.party_id;

      const loginData: LoginData = {
        userName: userName.userId,
        password: userName.userPassword,
        partyId: hash,
        isKakao: false,
      };

      const response = await tableLogin(loginData);
      setUserId(response.user_id)
      
      console.log(response.user_id);

      console.log("서버 응답: ", result);

      router.push(`/meeting/${hash}`);
    } catch (error) {
      console.error("제출 실패: ", error);
    }
  };
  useEffect(() => {
    console.log("User ID Changed:", userId);
  }, [userId]);

  useEffect(() => {
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
    <div className="mr-[2%] basis-1/4">
      <div className="flex flex-col flex-none items-center justify-center bg-custom-bg border border-solid shadow-custom-shadow backdrop-blur-custom-blur rounded-custom">
        <DatePicker
          selected={null} // 단일 선택 방지
          onChange={(date) => handleDateChange(date as Date)} // 다중 선택 처리
          inline
          highlightDates={selectedDates} // 선택된 날짜 강조
          dayClassName={(date) =>
            selectedDates.some(
              (selectedDate) => selectedDate.getTime() === date.getTime()
            )
              ? "selected-date"
              : undefined
          }
        />
        <hr className="w-[90%] border border-1 border-[#ECECED] my-[1%]" />
        <div className="flex flex-row align-center justify-between bg-white w-[84%] py-[5px]">
          <span className="w-[15%] font-pretendard font-[500] text-[18px]">
            Starts
          </span>
          <div className="flex flex-row justify-end w-[60%]">
            <select
              value={startTime}
              onChange={handleStartTimeChange}
              className="w-[55%] pr-[5px] mr-[5%] focus:outline-none rounded-[4.216px] bg-[rgba(120,120,128,0.12)] text-right font-pretendard font-[500]"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}:00
                </option>
              ))}
            </select>
            <button
              onClick={toggleStartTime}
              className="w-[70%] h-8 flex z-2 flex-row items-center relative p-1 transition-colors duration-300 bg-custom-gray rounded-[6px]"
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
          <div className="flex flex-row justify-end w-[60%]">
            <select
              value={endTime}
              onChange={handleEndTimeChange}
              className="w-[55%] pr-[5px] mr-[5%] focus:outline-none rounded-[4.216px] bg-[rgba(120,120,128,0.12)] text-right font-pretendard font-[500]"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}:00
                </option>
              ))}
            </select>
            <button
              onClick={toggleEndTime}
              className="w-[70%] h-8 flex z-2 flex-row items-center relative p-1 transition-colors duration-300 bg-custom-gray rounded-[6px]"
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

      <div className="number flex flex-col items-start justify-center bg-custom-bg border border-solid shadow-custom-shadow backdrop-blur-custom-blur rounded-custom mt-[5%] p-[4%] pl-[2%]">
        <div className="w-[100%] mb-[5%] pl-[8%] flex flex-row justify-between">
          <span className="text-[18px] font-bold font-pretendard">총 인원</span>
          <div className="flex flex-row items-center">
            <label className="font-pretendard text-[14px]">
              아직 정해지지 않았어요
            </label>
            <input
              type="checkbox"
              checked={isTotalPeopleUnset}
              onChange={handleCheckboxChange}
              className="mx-2"
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-full px-[8%]">
          {!isTotalPeopleUnset ? (
            <>
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
              <button
                onClick={incrementPeople}
                className="w-11 h-11 bg-[#9F9F9F] rounded-full flex items-center justify-center text-2xl text-white"
              >
                <FaPlus size={15} />
              </button>
            </>
          ) : (
            <div className="w-[100%] h-[40px] text-center text-xl flex items-center justify-center font-bold bg-[#EEE] rounded-[32.988px]">
              미정
            </div>
          )}
        </div>
      </div>
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
      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        className="mt-[5%] w-[100%] bg-[#6161CE] text-white font-bold py-2 px-4 rounded-[32.988px] hover:bg-blue-600"
      >
        일정 생성하기
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="z-[9999] fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9998]" // 배경을 어둡게 하면서 z-index 설정
      >
        <TableLogin closeModal={handleCloseModal} />
      </Modal>
    </div>
  );
}