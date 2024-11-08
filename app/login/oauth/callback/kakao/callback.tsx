import dynamic from "next/dynamic";
import { Suspense } from "react";

// KakaoCallback 컴포넌트를 동적으로 가져오기
const DynamicKakaoCallback = dynamic(() => import("./page"), {
  ssr: false, // 서버 사이드 렌더링 비활성화
});

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicKakaoCallback />
    </Suspense>
  );
}
