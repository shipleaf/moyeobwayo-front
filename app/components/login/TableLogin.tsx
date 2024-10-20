import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { loginState, userIdValue } from '@/app/recoil/atom'; // Recoil 상태
import { tableLogin } from '@/app/api/tableLogin'; // API 호출 함수
import { LoginData } from '@/app/api/types'; // LoginData 인터페이스
import { useParams } from 'next/navigation'; // useParams를 import

export default function TableLogin() {
  const { hash } = useParams(); // URL에서 hash 값을 추출
  const [userName, setUserName] = useState(''); // 사용자 이름 입력 상태
  const [password, setPassword] = useState(''); // 비밀번호 입력 상태
  const setIsLoggedIn = useSetRecoilState(loginState); // 로그인 상태 관리
  const setUserIdValue = useSetRecoilState(userIdValue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // LoginData 객체 생성
    const loginData: LoginData = {
      userName: userName,
      password: password,
      partyId: hash, // 추출한 hash 값 사용
      isKakao: false,
    };

    try {
      const response = await tableLogin(loginData);
      console.log('API 응답:', response);

      setIsLoggedIn(true);
      setUserIdValue(response.user.user_id);

      // 추가적으로 필요한 동작이 있으면 여기에 추가
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userName">User ID:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
