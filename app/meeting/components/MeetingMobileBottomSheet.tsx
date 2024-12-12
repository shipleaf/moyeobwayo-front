import React, { useEffect, useRef, useState } from "react";
import { Info } from "@phosphor-icons/react";
import { Jua } from "next/font/google";
import PartyPriority from "@/app/components/getParty/PartyPriority";
import TimeSelector from "@/app/components/getParty/VoteTable";
import TableLogin from "@/app/components/login/TableLogin";
import { TableData } from "../[hash]/page";

const jua = Jua({
  weight: "400", // 폰트 굵기 설정
  subsets: ["latin"], // 필요한 언어 설정
  display: "swap", // FOUT 방지
});

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  decisionTime: string | undefined;
  globalKakaoState: KakaoUser;
  globalUserId: number | null;
  tableData: TableData | null;
  isMobile: boolean;
}

interface KakaoUser {
  nickname: string; // 닉네임
  profile_image: string; // 프로필 이미지 URL
  kakaoUserId: number | null; // 카카오 사용자 ID (숫자 또는 null)
}

export default function BottomSheet({
  isOpen,
  onClose,
  decisionTime,
  globalKakaoState,
  globalUserId,
  tableData,
  isMobile,
}: BottomSheetProps) {
  const [showTooltip, setShowTooltip] = useState(true);
  const [activeTab, setActiveTab] = useState<"vote" | "recommend">("vote"); // 현재 활성화된 버튼 상태
  const tooltipRef = useRef<HTMLDivElement>(null); // Tooltip 참조

  const handleTabClick = (tab: "vote" | "recommend") => {
    setActiveTab(tab);
  };

  const toggleTooltip = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowTooltip((prev) => !prev);
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log(event.target);
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".tooltip-trigger")
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={handleClose}
        ></div>
      )}

      <div
        className={`fixed inset-x-0 bottom-0 bg-white rounded-t-lg p-5 transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ zIndex: 1000, height: "80vh", overflow: "auto" }}
      >
        <div className="w-full flex relative">
          <div className="w-full relative">
            <div className="flex mb-5 justify-between">
              <div className="flex gap-5">
                <button
                  className={`${jua.className} text-lg box-border pb-2 ${
                    activeTab === "vote"
                      ? "text-[#262669] border-b-2 border-[#262669]"
                      : "text-[#8E8E94] border-b-2 border-transparent"
                  }`}
                  onClick={() => handleTabClick("vote")}
                >
                  투표하기
                </button>
                <button
                  className={`${jua.className} text-lg box-border pb-2 ${
                    activeTab === "recommend"
                      ? "text-[#262669] border-b-2 border-[#262669]"
                      : "text-[#8E8E94] border-b-2 border-transparent"
                  }`}
                  onClick={() => handleTabClick("recommend")}
                >
                  추천 시간
                </button>
              </div>
              {activeTab === "recommend" && (
                <Info
                  size={24}
                  color="#D9D9D9"
                  weight="fill"
                  onClick={toggleTooltip}
                  className="cursor-pointer ml-2 tooltip-trigger"
                />
              )}
            </div>
            {activeTab === "vote" && (
              <div className="flex justify-center items-center gap-4 flex-col">
                {(globalKakaoState.kakaoUserId !== null || globalUserId) &&
                tableData ? (
                  <TimeSelector party={tableData.party} isMobile={isMobile} />
                ) : (
                  <div className="flex flex-col justify-center items-center py-[20px]">
                    <span className={`${jua.className}`}>
                      로그인 후 투표가 가능합니다!
                    </span>
                    <TableLogin isMobile={isMobile} />
                  </div>
                )}
                <button
                  onClick={handleClose}
                  className={`${jua.className} bg-[#6161ce] hover:opacity-60 text-white w-[50%] p-1 rounded-[5px]`}
                >
                  확인
                </button>
              </div>
            )}
            {activeTab === "recommend" && (
              <div ref={tooltipRef} className="flex justify-center">
                {showTooltip && (
                  <div
                    className="absolute top-[28px] right-0 bg-white text-black text-sm rounded-md 
                  p-2.5 shadow-lg w-[65vw] border border-gray-300 z-50"
                  >
                    <p
                      className={`${jua.className} text-[12px]`}
                      style={{ color: "#1D1D1D" }}
                    >
                      많은 사람이 투표한 시간이에요!
                    </p>
                    <div
                      className="absolute -top-[7px] right-[10px] w-3 h-3 bg-white rotate-360 border border-gray-300"
                      style={{
                        zIndex: -1,
                        transform: "rotate(-225deg)",
                        borderColor: "transparent transparent #C6C6C6 #C6C6C6",
                      }}
                    ></div>
                  </div>
                )}
                <PartyPriority decisionTime={decisionTime} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
