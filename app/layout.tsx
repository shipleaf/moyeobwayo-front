"use client";

import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { RecoilRoot } from "recoil";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata = {
  title: "모여봐요",
  description:
    "모여봐요는 만남 스케줄링 서비스로, 일정 조율과 약속 관리를 간편하게 제공합니다.",
  icons: {
    icon: "/public/icons/moyeobwayoIcon.svg",
    apple: "/public/icons/moyeobwayoIcon.svg",
  },
  openGraph: {
    title: "모여봐요",
    description: "만남 스케줄링 서비스 모여봐요",
    url: "https://www.moyeobwayo.com",
    siteName: "모여봐요",
    // images: [
    //   {
    //     url: "https://www.moyeobwayo.com/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "모여봐요 서비스 미리보기",
    //   },
    // ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 768); // 768px 이하를 모바일로 간주
  //   };

  //   handleResize(); // 초기 화면 크기 확인
  //   window.addEventListener("resize", handleResize);

  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  useEffect(() => {
    // 페이지 로드 시 스크롤 비활성화
    document.body.style.overflow = "auto";

    return () => {
      // 언마운트 시 스크롤 복구
      document.body.style.overflow = "auto";
    };
  }, []);

  // if (isMobile) {
  //   return (
  //     <html lang="en">
  //       <head>
  //         <link rel="icon" href="/icons/moyeobwayoIcon.svg" />
  //         <title>모여봐요</title>
  //       </head>
  //       <body className={`${geistSans.variable} antialiased`}>
  //         <div style={{ textAlign: "center", marginTop: "20%" }}>
  //           <h1>모바일 화면은 지원하지 않습니다.</h1>
  //           <p>PC로 접속해 주세요.</p>
  //         </div>
  //       </body>
  //     </html>
  //   );
  // }

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
        <RecoilRoot>
          {children}
          <Analytics />
        </RecoilRoot>
      </body>
    </html>
  );
}
