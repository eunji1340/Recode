/** @format */

// 서버 API 엔드포인트
const API_URL = "http://localhost:8080/api/users/";

console.log("백준 쿠키 추출 스크립트가 로드되었습니다.");

// document.cookie에서 'OnlineJudge' 쿠키 값을 추출
function getBojCookieValue() {
  const cookieString = document.cookie;
  const cookies = cookieString.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith("OnlineJudge=")) {
      return cookie.substring("OnlineJudge=".length, cookie.length);
    }
  }
  return null;
}

// content script에서 background 또는 다른 script에 USER_ID를 전달받는 구조
chrome.runtime.sendMessage({ type: "GET_USER_ID" }, async (response) => {
  const USER_ID = response?.userId;
  if (!USER_ID) {
    console.warn("❌ 로그인 유저 ID를 찾을 수 없습니다.");
    return;
  }

  const cookieValue = getBojCookieValue();
  if (!cookieValue) {
    console.log("OnlineJudge 쿠키를 찾을 수 없습니다.");
    return;
  }

  try {
    const { accessToken } = await chrome.storage.local.get(["accessToken"]);
    const resp = await fetch(`${API_URL}${USER_ID}/boj-cookies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ cookieValue }),
    });

    if (resp.ok) {
      console.log("✅ 백준 쿠키가 서버에 성공적으로 저장되었습니다.");
    } else {
      console.error("❌ 쿠키 저장 실패:", await resp.text());
    }
  } catch (error) {
    console.error("❌ API 호출 중 오류 발생:", error);
  }
});
