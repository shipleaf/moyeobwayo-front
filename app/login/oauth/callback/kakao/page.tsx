"use client"; // Redirect 페이지

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { sendAuthCodeToBackend } from "@/app/api/kakaoLoginAPI"; // API 호출 함수 가져오기

function Page() {
  const searchParams = useSearchParams();
  const [authCode, setAuthCode] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    setAuthCode(code);

    if (code) {
      console.log("Authorization code:", code);
      // 백엔드로 코드 전송
      sendAuthCodeToBackend(code);
    }
  }, [searchParams]);

  return (
    <div>
      <div>Authorization Code:</div>
      <div>{authCode ? authCode : "No code found"}</div>
    </div>
  );
}

export default Page;
