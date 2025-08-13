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
      const cookie = cookies[i].trim();
      if (cookie.startsWith('OnlineJudge=')) {
        return cookie.substring('OnlineJudge='.length, cookie.length);
      }
    }
    return null;
  }

  // 추출한 쿠키 값을 서버로 전송하는 함수
  async function sendCookieToServer(cookieValue: string) {
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
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log('✅ 백준 쿠키가 서버에 성공적으로 저장되었습니다.');
      } else {
        console.error('❌ 쿠키 저장 실패:', response.data);
      }
    } catch (error) {
      console.error('❌ API 호출 중 오류 발생:', error);
    }
  }

  const openBOJ = () => {
    window.open('https://www.acmicpc.net/login', '_blank');
  };

  const handleClick = () => {
    openBOJ();
    // 페이지가 로드되면 자동으로 쿠키를 추출하고 전송합니다.
    const cookieValue = getBojCookieValue();
    if (cookieValue !== null) {
      sendCookieToServer(cookieValue);
    } else {
      console.log('OnlineJudge 쿠키를 찾을 수 없습니다.');
    }
  };

  return (
    <div>
      <button
        className="px-6 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={handleClick}
      >
        백준 로그인하기
      </button>
    </div>
  );
}
