import Image from "next/image";
import React from "react";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { Clipboard } from "@phosphor-icons/react/dist/ssr";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import MeetList from "./components/MeetList";
import MeetDetail from "./components/MeetDetail";
import Header from "./components/Header";

// 예시 사용자 데이터
const users = [
  { id: 1, username: "Alice", profileImage: "" },
  { id: 2, username: "Bob", profileImage: "" },
  { id: 3, username: "Charlie", profileImage: "" },
];

export default function Page() {
  
  return (
    <div className="flex items-center justify-end bg-[#6161CE] h-screen p-[2%] relative">
        <div className="flex flex-col w-[10%] h-[100%] pl-[1%] items-start">
          <div className="flex flex-col items-center">
            <Image
              src="/images/moyeobwayo.png"
              alt=""
              width={80}
              height={80}
              className="mb-[50%]"
            />
            <div className="flex flex-col items-center">
              <button
                 // content 버튼 클릭 핸들러
                className="content w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer mb-[50%]
                    bg-white text-black"
              >
                <Clipboard
                  size={30}
                  weight="bold"
                  className="text-black"
                />
              </button>
              <button
                className="calendar w-[80px] h-[80px] flex items-center justify-center border rounded-[10px] cursor-pointer
                    bg-[rgba(255,255,255,0.1)] border-none"
              >
                <CalendarBlank
                  size={30}
                  weight="bold"
                  className="text-white opacity-100"
                />
              </button>
              <div className="relative flex flex-col mt-8">
                {users.map((user, index) => (
                  <div
                    key={user.id}
                    className="relative w-[80px] h-[80px] rounded-full flex items-center justify-center cursor-pointer bg-white"
                    style={{
                      top: `${index * -45}px`,
                      zIndex: 10 + index,
                    }}
                  >
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.username}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    ) : (
                      <UserCircle size={80} className="text-[#ced4da]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="page w-[90%] flex flex-col h-full bg-white rounded-[20px] z-50 p-[2%]">
          <Header></Header>
          {/* Content */}
          <section className="flex gap-6">
            {/* List */}
            <div className="w-1/3 flex flex-col max-h-[76vh] overflow-auto">
              <MeetList />
            </div>

            {/* Detail */}
            <div className="w-full">
              <MeetDetail/>
            </div>
          </section>
          {/* Detail은 나머지 오른쪽에 배치되어야해 */}
          {/* Detail */}

        </div>

        <div
          className={`absolute transition-all duration-300 z-0 ${
        "top-[18%] left-[10.5%]"
          }`}
        >
          <div className="w-16 h-16 bg-white rounded-[20%] transform rotate-45 shadow-lg"></div>
        </div>
      </div>
  )
}
