"use client";

import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { RecoilRoot } from "recoil";
import { useEffect, useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px 이하를 모바일로 간주
    };

    handleResize(); // 초기 화면 크기 확인
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <html lang="en">
        <head>
          <link rel="icon" href="/icons/moyeobwayoIcon.svg" />
          <title>모여봐요</title>
        </head>
        <body className={`${geistSans.variable} antialiased`}>
          <div style={{ textAlign: "center", marginTop: "20%" }}>
            <h1>모바일 화면은 지원하지 않습니다.</h1>
            <p>PC로 접속해 주세요.</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/moyeobwayoIcon.svg" />
        <title>모여봐요</title>
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        {/* Kakao Script */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
        ></Script>
        <RecoilRoot>{children}</RecoilRoot>
      </body>
    </html>
  );
}