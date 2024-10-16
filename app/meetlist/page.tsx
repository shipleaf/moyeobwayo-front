import Image from "next/image";
import React from "react";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { Clipboard } from "@phosphor-icons/react/dist/ssr";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import { Bell, BellSlash } from "@phosphor-icons/react/dist/ssr";
import Toggle from "./components/Toggle";
import MeetList from "./components/MeetList";
import MeetDetail from "./components/MeetDetail";
import { DummyMeet, Alarm, PartyDate, Timeslot } from "../interfaces/Party";

// 예시 사용자 데이터
const users = [
  { id: 1, username: "Alice", profileImage: "" },
  { id: 2, username: "Bob", profileImage: "" },
  { id: 3, username: "Charlie", profileImage: "" },
];

const dummyMeetList: DummyMeet[] = [
  {
      partyId: "party-1",
      target_num: 5,
      current_num: 3,
      party_name: "Birthday Celebration",
      party_description: "Join us for a fun birthday party!",
      start_date: "2024-10-15T14:00:00.000Z",
      location_name: "Central Park",
      endDate: "2024-10-15T18:00:00.000Z",
      decision_date: "2024-10-10T12:00:00.000Z",
      user_id: "user-123",
      alarms: [
          {
              alarmId: 1,
              alarm_on: true,
              party: "Birthday Celebration"
          }
      ],
      dates: [
          {
              date_id: 1,
              selected_date: "2024-10-15T00:00:00.000Z",
              timeslots: [
                  {
                      slot_id: 1,
                      selected_start_time: "2024-10-15T14:00:00.000Z",
                      selected_end_time: "2024-10-15T18:00:00.000Z"
                  }
              ]
          }
      ]
  },
  {
      partyId: "party-2",
      target_num: 10,
      current_num: 7,
      party_name: "Game Night",
      party_description: "Let's play some board games and have fun!",
      start_date: "2024-10-20T18:00:00.000Z",
      location_name: "My Place",
      endDate: "2024-10-20T22:00:00.000Z",
      decision_date: "2024-10-15T12:00:00.000Z",
      user_id: "user-456",
      alarms: [
          {
              alarmId: 2,
              alarm_on: false,
              party: "Game Night"
          }
      ],
      dates: [
          {
              date_id: 2,
              selected_date: "2024-10-20T00:00:00.000Z",
              timeslots: [
                  {
                      slot_id: 2,
                      selected_start_time: "2024-10-20T18:00:00.000Z",
                      selected_end_time: "2024-10-20T22:00:00.000Z"
                  }
              ]
          }
      ]
  },
  {
      partyId: "party-3",
      target_num: 8,
      current_num: 5,
      party_name: "Movie Night",
      party_description: "Enjoy a movie marathon with friends!",
      start_date: "2024-11-01T19:00:00.000Z",
      location_name: "Cinema Hall",
      endDate: "2024-11-01T23:00:00.000Z",
      decision_date: "2024-10-25T10:00:00.000Z",
      user_id: "user-789",
      alarms: [
          {
              alarmId: 3,
              alarm_on: true,
              party: "Movie Night"
          }
      ],
      dates: [
          {
              date_id: 3,
              selected_date: "2024-11-01T00:00:00.000Z",
              timeslots: [
                  {
                      slot_id: 3,
                      selected_start_time: "2024-11-01T19:00:00.000Z",
                      selected_end_time: "2024-11-01T23:00:00.000Z"
                  }
              ]
          }
      ]
  },
  {
      partyId: "party-4",
      target_num: 6,
      current_num: 2,
      party_name: "Sports Day",
      party_description: "Join us for a fun sports day!",
      start_date: "2024-11-05T10:00:00.000Z",
      location_name: "Sports Complex",
      endDate: "2024-11-05T15:00:00.000Z",
      decision_date: "2024-10-30T08:00:00.000Z",
      user_id: "user-234",
      alarms: [
          {
              alarmId: 4,
              alarm_on: false,
              party: "Sports Day"
          }
      ],
      dates: [
          {
              date_id: 4,
              selected_date: "2024-11-05T00:00:00.000Z",
              timeslots: [
                  {
                      slot_id: 4,
                      selected_start_time: "2024-11-05T10:00:00.000Z",
                      selected_end_time: "2024-11-05T15:00:00.000Z"
                  }
              ]
          }
      ]
  },
  {
      partyId: "party-5",
      target_num: 12,
      current_num: 10,
      party_name: "Charity Event",
      party_description: "Join us for a charity fundraiser!",
      start_date: "2024-11-10T16:00:00.000Z",
      location_name: "Community Center",
      endDate: "2024-11-10T20:00:00.000Z",
      decision_date: "2024-11-05T12:00:00.000Z",
      user_id: "user-345",
      alarms: [
          {
              alarmId: 5,
              alarm_on: true,
              party: "Charity Event"
          }
      ],
      dates: [
          {
              date_id: 5,
              selected_date: "2024-11-10T00:00:00.000Z",
              timeslots: [
                  {
                      slot_id: 5,
                      selected_start_time: "2024-11-10T16:00:00.000Z",
                      selected_end_time: "2024-11-10T20:00:00.000Z"
                  }
              ]
          }
      ]
  },
  {
      partyId: "party-6",
      target_num: 4,
      current_num: 2,
      party_name: "Cooking Class",
      party_description: "Learn to cook delicious meals!",
      start_date: "2024-11-15T11:00:00.000Z",
      location_name: "Culinary School",
      endDate: "2024-11-15T14:00:00.000Z",
      decision_date: "2024-11-10T09:00:00.000Z",
      user_id: "user-456",
      alarms: [
          {
              alarmId: 6,
              alarm_on: false,
              party: "Cooking Class"
          }
      ],
      dates: [
          {
              date_id: 6,
              selected_date: "2024-11-15T00:00:00.000Z",
              timeslots: [
                  {
                      slot_id: 6,
                      selected_start_time: "2024-11-15T11:00:00.000Z",
                      selected_end_time: "2024-11-15T14:00:00.000Z"
                  }
              ]
          }
      ]
  },
  {
      partyId: "party-7",
      target_num: 8,
      current_num: 6,
      party_name: "Art Workshop",
      party_description: "Unleash your creativity in this art workshop!",
      start_date: "2024-11-20T13:00:00.000Z",
      location_name: "Art Studio",
      endDate: "2024-11-20T17:00:00.000Z",
      decision_date: "2024-11-15T10:00:00.000Z",
      user_id: "user-678",
      alarms: [
          {
              alarmId: 7,
              alarm_on: true,
              party: "Art Workshop"
          }
      ],
      dates: [
          {
              date_id: 7,
              selected_date: "2024-11-20T00:00:00.000Z",
              timeslots: [
                  {
                      slot_id: 7,
                      selected_start_time: "2024-11-20T13:00:00.000Z",
                      selected_end_time: "2024-11-20T17:00:00.000Z"
                  }
              ]
          }
      ]
  }
];
export default function Page() {
  
  console.log('useRecoilValue')
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
          {/* HEADER */}
          <header className="pt-[12px] pb-[13px] flex justify-between items-center">
            <h1 className="font-bold text-[20px]">
              <strong className="text-[#6161CE]">김선엽님</strong>의 
              <br/>일정 한눈에 보기
            </h1>
            {/* button-group */}
            <div className="flex gap-4 items-center">
            <button className="text-[#5F5F5F] text-[16px] font-semibold py-3 px-[26px] 
                  border-[1px] border-[#D7D7D7] rounded-[50px] outline-none 
                  transition-all duration-300 ease-in-out 
                  hover:bg-[#F0F0F0] hover:text-[#3E3E3E] hover:border-[#B0B0B0]">
              로그아웃
            </button>
                <button className="text-[#5F5F5F] text-[16px] font-semibold py-[9px] px-4
                  border-[1px] border-[#D7D7D7] rounded-[50px]
                  flex  items-center gap-4 outline-none
                  ">
                  <Bell size={24}/>
                  <Toggle isToggled={true}/>
                </button>
            </div>
          </header>
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
