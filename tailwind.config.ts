import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "custom-white": "rgba(255, 255, 255, 0.36)", // 사용자 정의 색상
        "custom-bg": "rgba(246, 246, 246, 0.36)",
        "custom-gray": "rgba(120, 120, 128, 0.12)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // HeatMap 색상을 hex 코드로 수정
        MO10: "#A1A1FF",
        MO20: "#8D8DF4",
        MO30: "#8181E8",
        MO40: "#7272D9",
        MO50: "#6161CE",
        MO60: "#5555BF",
        MO70: "#4A4AAE",
        MO80: "#3D3D97",
        MO90: "#313183",
        MO100: "#262669",
      },
      borderRadius: {
        custom: "10.078px", // 커스텀 border-radius
      },
      boxShadow: {
        "custom-shadow": "0px 0px 4.216px 0px rgba(0, 0, 0, 0.15)", // 커스텀 그림자
        prior: "0px 0px 6px 0px rgba(0, 0, 0, 0.15)",
      },
      backdropBlur: {
        "custom-blur": "47.432px", // 커스텀 블러
        "48px": "48px",
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      borderWidth: {
        "0.5": "0.5px",
        "1": "1px",
      },
    },
  },
  safelist: [
    {
      pattern: /bg-MO[0-9]{1,3}/, // bg-MO0부터 bg-MO100까지 모든 경우를 미리 safelist에 추가
    },
  ],
  plugins: [],
};
export default config;
