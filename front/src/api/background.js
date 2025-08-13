// background.js
import { useUserStore } from '../stores/userStore';
import api from './axiosInstance';

console.log(
  '✅ Recode 확장 프로그램의 백그라운드 서비스 워커가 시작되었습니다.',
);

// const API_URL = 'http://localhost:8080/users/';
// const USER_ID = 44;

// 1. 페이지 접속 시 쿠키를 확인하여 전송합니다. (초기값 설정)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    tab.url.startsWith('https://www.acmicpc.net')
  ) {
    console.log('🌐 백준 페이지 접속이 감지되었습니다. 쿠키를 확인합니다.');
    chrome.cookies.get({ url: tab.url, name: 'OnlineJudge' }, (cookie) => {
      if (cookie) {
        console.log(`🔎 'OnlineJudge' 쿠키를 찾았습니다: ${cookie.value}`);
        sendCookieToServer(cookie.value);
      } else {
        console.log(
          "❌ 'OnlineJudge' 쿠키를 찾을 수 없습니다. 백준 로그인이 필요합니다.",
        );
      }
    });
  }
});

// 2. 쿠키 값의 변경을 실시간으로 감지하여 전송합니다. (갱신)
chrome.cookies.onChanged.addListener((changeInfo) => {
  const { cookie, removed } = changeInfo;

  // 'OnlineJudge' 쿠키가 백준 페이지에서 변경되었는지 확인합니다.
  if (
    cookie.name === 'OnlineJudge' &&
    cookie.domain === '.acmicpc.net' &&
    !removed
  ) {
    console.log(`🔎 'OnlineJudge' 쿠키가 갱신되었습니다: ${cookie.value}`);
    sendCookieToServer(cookie.value);
  }
});

const { userId } = useUserStore();

async function sendCookieToServer(cookieValue) {
  try {
    const response = await api.post(`/users/${userId}/boj-cookies`, {
      cookieValue: cookieValue,
    });

    console.log(response.data);

    if (response.ok) {
      console.log('✅ 백준 쿠키가 서버에 성공적으로 저장되었습니다.');
    } else {
      console.error('❌ 쿠키 저장 실패:', await response.text());
    }
  } catch (error) {
    console.error('❌ API 호출 중 오류 발생:', error);
  }
}
