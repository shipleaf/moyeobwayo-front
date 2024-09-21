// app/login/loginpage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Login from "../components/login/login";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 로그인 로직 추가
    console.log("로그인 시도:", { email, password });
    // 로그인 성공 시 홈으로 이동
    router.push("/");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1>로그인 페이지</h1>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          로그인
        </button>
      </form>
      <Login />
    </div>
  );
};

export default LoginPage;
