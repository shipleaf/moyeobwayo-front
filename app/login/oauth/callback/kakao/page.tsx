"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function Page() {
  const searchParams = useSearchParams();
  const [authCode, setAuthCode] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    setAuthCode(code);
    if (code) {
      console.log("Authorization code:", code);
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
