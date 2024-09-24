"use client";

import React, { useState } from "react";

export default function Login() {
  const [name, setName] = useState(""); // 이름 입력 상태 관리
  const [password, setPassword] = useState(""); // 비밀번호 입력 상태 관리

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div style={{ border: "1px solid gray", padding: "20px", width: "300px" }}>
      <h3>로그인</h3>
      <form onSubmit={handleFormSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            이름:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-black"
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            비밀번호:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-black"
            />
          </label>
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          로그인
        </button>
      </form>
    </div>
  );
}
