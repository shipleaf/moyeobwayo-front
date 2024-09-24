import React from "react";
import TimeTable from "./components/TimeTable";
import Login from "./components/Login";
import UserTimeTable from "./components/UserTimeTable";

export default function Home() {
  return (
    <div className="flex">
      <TimeTable />
      <Login />
      <UserTimeTable />
    </div>
  );
}
