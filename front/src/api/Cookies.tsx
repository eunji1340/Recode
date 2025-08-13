// 서버 API 엔드포인트와 사용자 ID를 설정합니다.
import { useUserStore } from '../stores/userStore';
import api from './axiosInstance';

export default function Cookies() {
  const userId = useUserStore();

  console.log('백준 쿠키 추출 스크립트 로드');

  // document.cookie에서 'OnlineJudge' 쿠키 값을 추출하는 함수
  function getBojCookieValue() {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith('OnlineJudge=')) {
        return cookie.substring('OnlineJudge='.length, cookie.length);
      }
    }
    return null;
  }

  // 추출한 쿠키 값을 서버로 전송하는 함수
  async function sendCookieToServer(cookieValue) {
    console.log(cookieValue);
    if (!cookieValue) {
      console.log('OnlineJudge 쿠키를 찾을 수 없습니다.');
      return;
    }

    try {
      const { accessToken } = await chrome.storage.local.get(['accessToken']);

      const response = await api.post(
        `/users/${userId}/boj-cookies`,
        {
          cookieValue: cookieValue,
        },
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      );

      if (response.ok) {
        console.log('✅ 백준 쿠키가 서버에 성공적으로 저장되었습니다.');
      } else {
        console.error('❌ 쿠키 저장 실패:', await response.data());
      }
    } catch (error) {
      console.error('❌ API 호출 중 오류 발생:', error);
    }
  }

  const openBOJ = () => {
    window.open('https://www.acmicpc.net/', '_blank');
  };

  const handleClick = () => {
    alert('백준 로그인 해주세요');
    // 백준을 띄워주고 로그인까지 시키기
    openBOJ();
    // 페이지가 로드되면 자동으로 쿠키를 추출하고 전송합니다.
    const cookieValue = getBojCookieValue();
    sendCookieToServer(cookieValue);
  };

  return (
    <div>
      <button onClick={handleClick}>쿠키 허락하기</button>
    </div>
  );
}
