import React, { useEffect, useRef, useState } from "react";
import { GetTableResponse } from "@/app/api/getTableAPI";
import { GetUserAvatarResponse } from "@/app/api/getUserAvatarAPI";
import Image from "next/image";
import { Jua } from "next/font/google";
import { LuAlarmClock } from "react-icons/lu";

const jua = Jua({
  weight: "400", // 폰트 굵기 설정
  subsets: ["latin"], // 필요한 언어 설정
  display: "swap", // FOUT 방지
});

interface MeetingMobileBodyProps {
  tableData: GetTableResponse | null;
  userAvatar: GetUserAvatarResponse | null;
}

export default function MeetingMobileBody({
  tableData,
  userAvatar,
}: MeetingMobileBodyProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleTooltipToggle = () => {
    setShowTooltip((prev) => !prev);
  };

  useEffect(() => {
    if (showTooltip && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const { right, bottom } = tooltip.getBoundingClientRect();

      if (right > window.innerWidth) {
        tooltip.style.left = `${window.innerWidth - right - 10}px`; // 오른쪽 경계를 벗어나지 않도록 조정
      }
      if (bottom > window.innerHeight) {
        tooltip.style.top = `${window.innerHeight - bottom - 10}px`; // 아래 경계를 벗어나지 않도록 조정
      }
    }
  }, [showTooltip]);

  return (
    <>
      <div className="p-4 flex flex-row justify-between">
        <div className="flex flex-col items-start">
          <span className="text-lg font-bold text-[#6161ce]">
            {tableData?.party.partyName}
          </span>
          <span className="text-sm font-[500] text-[#6161ce]">
            {tableData?.party.partyDescription}
          </span>
        </div>
        <div className="flex flex-col relative">
          <span className="text-sm font-[700] text-[#313183] flex justify-center">
            현재 투표 인원
          </span>
          <div
            className="profile flex flex-row items-start justify-center cursor-pointer"
            onClick={handleTooltipToggle}
          >
            {Array.isArray(userAvatar) &&
              userAvatar.slice(0, 4).map((user, index) => (
                <div
                  key={user.userId}
                  className="flex flex-col items-center text-center w-16"
                  style={{ marginLeft: index === 0 ? 0 : "-40px" }}
                >
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-[#ddd] flex items-center justify-center text-white">
                      {user.userName.charAt(0)}
                    </span>
                  )}
                </div>
              ))}
            {userAvatar && userAvatar.length > 4 && (
              <div
                className="flex flex-col items-center justify-center text-center w-10"
                style={{ marginLeft: "-20px", marginTop: "5px" }}
              >
                <span className={`${jua.className} w-9 h-6 rounded-full text-sm bg-[#D9D9FF] flex items-center text-bold justify-center text-[#313183]`}>
                  +{userAvatar.length - 4}
                </span>
              </div>
            )}
          </div>
          {showTooltip && (
            <div className="absolute top-full mt-2 right-0 w-max bg-white border border-[#ddd] shadow-lg rounded-md p-2 z-50">
              {Array.isArray(userAvatar) &&
                userAvatar.map((user) => (
                  <div
                    key={user.userId}
                    className="flex flex-row items-center gap-2 py-1 px-2 rounded"
                  >
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt=""
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="w-[30px] h-[30px] rounded-full bg-[#ddd] flex items-center justify-center text-white">
                        {user.userName.charAt(0)}
                      </span>
                    )}
                    <div className="text-sm text-[#313183] flex items-center">
                      <span
                        style={{
                          maxWidth: "9ch", //
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {user.userName.replace(/\(\d+\)$/, "")}
                      </span>
                      {/\(\d+\)$/.test(user.userName) && (
                        <Image
                          src="/images/kakaotalk_sharing_btn_small_ov.png"
                          alt="Exclamation Icon"
                          width={15}
                          height={15}
                          className="ml-1 inline-block rounded-2xl"
                        />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={`flex flex-row gap-1 justify-center items-center ${jua.className} text-[#6161CE]`}
      >
        <LuAlarmClock />
        <span className="flex items-center justify-center">
          현재 투표된 시간
        </span>
        <LuAlarmClock />
      </div>
    </>
  );
}
