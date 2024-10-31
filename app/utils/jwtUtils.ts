import jwt, { JwtPayload } from 'jsonwebtoken';
import { decode } from "js-base64";
export interface KakaoUserPayload extends JwtPayload {
  kakao_user_id: number; // 카카오 사용자 ID
  nickname: string; // 사용자 닉네임
  profile_image: string; // 사용자 프로필 이미지 URL
}

// secretKey를 환경 변수에서 가져옵니다.
const secretKey = Buffer.from(process.env.NEXT_PUBLIC_JWT_SECRET as string, 'utf-8');


export const decodeJWT = (token: string): JwtPayload | null => {
  try {
      const payload = token.split('.')[1]; // JWT의 페이로드 부분 추출
      const decodedPayload = decode(payload); // Base64 URL 디코딩
      return JSON.parse(decodedPayload); // JSON 객체로 변환하여 반환
  } catch (error) {
      console.error("JWT 디코딩 오류:", error);
      return null; // 디코딩 실패 시 null 반환
  }
};