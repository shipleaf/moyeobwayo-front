"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // useRouter 추가
import { sendAuthCodeToBackend } from "@/app/api/kakaoLoginAPI"; // API 호출 함수 가져오기

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter(); // useRouter 사용
  const code = searchParams.get("code"); // URL에서 code 추출
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  useEffect(() => {
    if (code) {
      setLoading(true);
      sendAuthCodeToBackend(code)
        .then((data) => {
          console.log(data);
          if (data.status === 200) { // 서버 응답의 상태가 정상일 때
            router.push("/meetlist"); // /meetlist 페이지로 이동
          }
        })
        .catch((err) => {
          console.error("Failed to send authorization code", err);
          setError("Failed to send authorization code");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [code, router]); // router를 의존성 배열에 추가

  return (
    <div>
      <h1>Kakao OAuth Callback</h1>
      {loading && <div>Loading...</div>} {/* 로딩 상태 표시 */}
      {!loading && code && (
        <div>
          <div>Authorization Code:</div>
          <div>{code}</div>
        </div>
      )}
      {!loading && !code && <div>No authorization code found.</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default Page;
