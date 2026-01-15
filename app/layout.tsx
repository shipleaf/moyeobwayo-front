import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import Providers from "./Providers";

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
    icon: "/icons/moyeobwayoIcon.svg",
    apple: "/icons/moyeobwayoIcon.svg",
  },
  openGraph: {
    title: "모여봐요",
    description: "만남 스케줄링 서비스 모여봐요",
    url: "https://www.moyeobwayo.com",
    siteName: "모여봐요",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} antialiased`}>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
