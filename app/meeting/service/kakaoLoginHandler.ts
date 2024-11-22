const redirectUri: string = process.env
  .NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI as string;

const scope = [
  "profile_nickname",
  "profile_image",
  "talk_message", // 카카오 메시지 동의 항목 추가
  "talk_calendar",
  "phone_number",
].join(",");

export const kakaoLoginHandlerbyMeeting = (globalUserId: number | null,  hash: string) => {
  if (globalUserId !== null) {
    // globalUserId를 세션 스토리지에 저장
    sessionStorage.setItem("globalUserId", globalUserId.toString()); // 문자열로 변환하여 저장
  }
  if (window.Kakao && window.Kakao.Auth) {
    window.Kakao.Auth.authorize({
      redirectUri,
      scope,
    });

    sessionStorage.setItem("have_to_route", hash); // 문자열로 변환하여 저장
  } else {
  }
};