/** @format */

console.log(
  "✅ Recode 확장 프로그램의 백그라운드 서비스 워커가 시작되었습니다."
);

// 환경별 API URL 설정
const API_ENDPOINTS = {
  development: "http://localhost:8080/users/",
  production: "http://i13a507.p.ssafy.io:8080/users/", // 실제 배포 API 도메인으로 변경하세요
};

// 현재 환경에 맞는 API URL 반환
async function getApiUrl() {
  try {
    // 웹 서비스 탭을 찾아서 환경 판단
    const tabs = await chrome.tabs.query({});
    const webServiceTab = tabs.find((tab) => isWebServiceDomain(tab.url));

    if (webServiceTab) {
      // 웹 서비스 탭 URL로 환경 판단
      if (webServiceTab.url.includes("localhost")) {
        console.log("🔧 개발환경으로 감지됨");
        return API_ENDPOINTS.development;
      } else {
        console.log("🚀 배포환경으로 감지됨");
        return API_ENDPOINTS.production;
      }
    }

    // 웹 서비스 탭이 없으면 기본값 (배포환경)
    console.log("❓ 환경을 감지할 수 없음, 배포환경 사용");
    return API_ENDPOINTS.production;
  } catch (error) {
    console.error("❌ 환경 감지 오류, 배포환경 사용:", error);
    return API_ENDPOINTS.production;
  }
}

let USER_ID = null; // 초기값은 null로 유지
let USER_TOKEN = null; // 사용자 토큰 저장

// 지원하는 도메인 목록 (개발환경 + 배포환경)
const SUPPORTED_DOMAINS = [
  "localhost:5173", // 개발환경
  "localhost:3000", // 다른 개발 포트
  "i13a507.p.ssafy.io:8080", // 배포환경 - 실제 도메인으로 변경하세요
  "i13a507.p.ssafy.io", // www 포함 도메인
  // 필요한 다른 도메인들 추가...
];

// URL이 지원되는 웹 서비스인지 확인하는 함수 (더 유연하게)
function isWebServiceDomain(url) {
  if (!url) return false;

  // localhost 개발환경 체크
  if (url.includes("localhost:")) return true;

  // 배포 도메인 체크
  return SUPPORTED_DOMAINS.some((domain) => {
    if (domain.startsWith("localhost:")) return false; // localhost는 위에서 처리
    return url.includes(domain);
  });
}

// 웹 서비스에서 동적으로 userId를 가져오는 함수
async function getUserIdFromWebService() {
  console.log("🔍 getUserIdFromWebService 함수 시작");

  try {
    // 모든 탭에서 웹 서비스 도메인을 찾기 (window.open으로 백준을 열기 때문)
    const tabs = await chrome.tabs.query({});
    console.log(
      "🔍 전체 탭 목록:",
      tabs.map((tab) => ({ id: tab.id, url: tab.url }))
    );

    // 지원되는 웹 서비스 탭 찾기
    const webServiceTab = tabs.find((tab) => isWebServiceDomain(tab.url));

    if (!webServiceTab) {
      console.log(
        "❌ 웹 서비스 탭을 찾을 수 없습니다. 지원되는 도메인:",
        SUPPORTED_DOMAINS
      );
      console.log("❌ 저장된 값을 사용합니다.");
      return await getStoredUserInfo();
    }

    console.log("✅ 웹 서비스 탭을 찾았습니다:", webServiceTab.url);
    console.log("✅ 웹 서비스 탭에서 localStorage 접근을 시도합니다.");

    // 찾은 웹 서비스 탭에서 localStorage 접근
    const results = await chrome.scripting.executeScript({
      target: { tabId: webServiceTab.id },
      func: () => {
        console.log("🔍 Content Script 실행됨 (웹 서비스 탭에서)");
        try {
          const userStore = localStorage.getItem("user-store");
          console.log("🔍 localStorage user-store 원본:", userStore);

          if (userStore) {
            const parsed = JSON.parse(userStore);
            console.log("🔍 파싱된 객체:", parsed);
            console.log("🔍 parsed.state:", parsed.state);
            console.log("🔍 parsed.state?.userId:", parsed.state?.userId);
            console.log("🔍 parsed.state?.token:", parsed.state?.token);

            // user-store 구조: {"state": {"userId": "79", "token": "...", ...}, "version": 0}
            const userId =
              parsed.state?.userId || parsed.userId || parsed.id || null;
            const token = parsed.state?.token || parsed.token || null;

            console.log("🔍 최종 추출된 userId:", userId);
            console.log(
              "🔍 최종 추출된 token:",
              token ? "토큰 있음" : "토큰 없음"
            );

            return { userId, token };
          } else {
            console.log("❌ user-store가 localStorage에 없습니다.");
            return { userId: null, token: null };
          }
        } catch (error) {
          console.error("❌ localStorage 접근 오류:", error);
          return { userId: null, token: null };
        }
      },
    });

    console.log("🔍 executeScript 결과:", results);

    if (results && results[0] && results[0].result) {
      const { userId, token } = results[0].result;

      if (userId && token) {
        console.log(
          "✅ 웹 서비스에서 userId와 token을 동적으로 가져왔습니다:",
          userId
        );

        // 가져온 userId와 token을 extension storage에도 저장
        await chrome.storage.local.set({
          state: {
            isAuthenticated: true,
            userId: userId,
            token: token,
            lastUpdated: Date.now(),
          },
        });
        console.log("✅ Extension storage에 userId와 token 저장 완료");
        return { userId, token };
      } else {
        console.log("❌ userId 또는 token이 없습니다.");
      }
    } else {
      console.log("❌ executeScript에서 사용자 정보를 가져오지 못했습니다.");
    }

    return { userId: null, token: null };
  } catch (error) {
    console.error(
      "❌ 웹 서비스에서 사용자 정보를 가져오는 중 오류 발생:",
      error
    );
    // 오류 시 저장된 값 fallback
    return await getStoredUserInfo();
  }
}

// 저장된 사용자 정보 가져오기 (fallback)
async function getStoredUserInfo() {
  console.log("🔍 getStoredUserInfo 함수 시작");

  try {
    const result = await chrome.storage.local.get(["state"]);
    console.log("🔍 chrome.storage.local에서 가져온 state:", result);

    if (
      result.state &&
      result.state.isAuthenticated &&
      result.state.userId &&
      result.state.token
    ) {
      console.log("✅ 저장된 사용자 정보 찾음:", result.state.userId);
      return {
        userId: result.state.userId,
        token: result.state.token,
      };
    } else {
      console.log("❌ 저장된 사용자 정보가 없거나 불완전함");
      return { userId: null, token: null };
    }
  } catch (error) {
    console.error("❌ 저장된 사용자 정보 로드 오류:", error);
    return { userId: null, token: null };
  }
}

// 로그인 상태를 로드하고 USER_ID와 USER_TOKEN을 설정합니다.
async function loadAndSetUserInfo() {
  try {
    // 먼저 웹 서비스에서 동적으로 가져오기 시도
    let userInfo = await getUserIdFromWebService();

    // 웹 서비스에서 가져오지 못한 경우 저장된 값 사용
    if (!userInfo.userId || !userInfo.token) {
      userInfo = await getStoredUserInfo();
    }

    if (userInfo.userId && userInfo.token) {
      USER_ID = userInfo.userId;
      USER_TOKEN = userInfo.token;
      console.log("✅ 사용자 정보 설정됨 - userId:", USER_ID);
    } else {
      console.warn("❌ 로그인 상태 정보를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("❌ 로그인 상태를 로드하는 중 오류 발생:", error);
  }
}

// 특정 도메인에서 userId 변경 감지 (옵션)
async function setupUserIdWatcher() {
  try {
    const tabs = await chrome.tabs.query({});

    tabs.forEach((tab) => {
      if (tab.url && isWebServiceDomain(tab.url)) {
        chrome.scripting
          .executeScript({
            target: { tabId: tab.id },
            func: () => {
              // localStorage 변경 감지
              window.addEventListener("storage", (e) => {
                if (e.key === "user-store" && e.newValue) {
                  chrome.runtime.sendMessage({
                    type: "USER_ID_CHANGED",
                    data: e.newValue,
                  });
                }
              });

              // 주기적으로 체크 (선택사항)
              setInterval(() => {
                const userStore = localStorage.getItem("user-store");
                if (userStore) {
                  chrome.runtime.sendMessage({
                    type: "USER_ID_CHECK",
                    data: userStore,
                  });
                }
              }, 30000); // 30초마다 체크
            },
          })
          .catch((err) => {
            // content script 주입 실패는 무시 (권한 없는 페이지 등)
          });
      }
    });
  } catch (error) {
    console.error("❌ userId 감시자 설정 오류:", error);
  }
}

// content script에서 메시지 받기
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "USER_ID_CHANGED" || message.type === "USER_ID_CHECK") {
    try {
      const parsed = JSON.parse(message.data);
      // user-store 구조: {"state": {"userId": "79", "token": "...", ...}, "version": 0}
      const newUserId = parsed.state?.userId || parsed.userId || parsed.id;
      const newToken = parsed.state?.token || parsed.token;

      if (
        newUserId &&
        newToken &&
        (newUserId !== USER_ID || newToken !== USER_TOKEN)
      ) {
        USER_ID = newUserId;
        USER_TOKEN = newToken;
        console.log("🔄 사용자 정보가 업데이트되었습니다:", USER_ID);

        // extension storage 업데이트
        chrome.storage.local.set({
          state: {
            isAuthenticated: true,
            userId: USER_ID,
            token: USER_TOKEN,
            lastUpdated: Date.now(),
          },
        });
      }
    } catch (error) {
      console.error("❌ 사용자 정보 업데이트 처리 오류:", error);
    }
  }
});

// 1. 페이지 접속 시 쿠키를 확인하여 전송합니다. (초기값 설정)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.startsWith("https://www.acmicpc.net")
  ) {
    // 탭이 로드될 때마다 사용자 정보를 새로 로드합니다.
    await loadAndSetUserInfo();

    if (!USER_ID || !USER_TOKEN) {
      console.warn(
        "❌ 사용자 정보가 아직 설정되지 않았습니다. API 호출을 건너뜁니다."
      );
      return;
    }

    console.log("🌐 백준 페이지 접속이 감지되었습니다. 쿠키를 확인합니다.");
    chrome.cookies.get({ url: tab.url, name: "OnlineJudge" }, (cookie) => {
      if (cookie) {
        console.log(`🔎 'OnlineJudge' 쿠키를 찾았습니다: ${cookie.value}`);
        sendCookieToServer(cookie.value);
      } else {
        console.log(
          "❌ 'OnlineJudge' 쿠키를 찾을 수 없습니다. 백준 로그인이 필요합니다."
        );
      }
    });
  }
});

// 2. 쿠키 값의 변경을 실시간으로 감지하여 전송합니다. (갱신)
chrome.cookies.onChanged.addListener(async (changeInfo) => {
  const { cookie, removed } = changeInfo;

  if (
    cookie.name === "OnlineJudge" &&
    cookie.domain === ".acmicpc.net" &&
    !removed
  ) {
    // 쿠키가 변경될 때마다 사용자 정보를 새로 로드합니다.
    await loadAndSetUserInfo();

    if (!USER_ID || !USER_TOKEN) {
      console.warn(
        "❌ 사용자 정보가 아직 설정되지 않았습니다. API 호출을 건너뜁니다."
      );
      return;
    }

    console.log(`🔎 'OnlineJudge' 쿠키가 갱신되었습니다: ${cookie.value}`);
    sendCookieToServer(cookie.value);
  }
});

// 서버로 전송
async function sendCookieToServer(cookieValue) {
  if (!USER_ID || !USER_TOKEN) {
    console.warn(
      "❌ 사용자 정보가 아직 설정되지 않았습니다. 로그인 정보가 필요합니다."
    );
    return;
  }

  try {
    // 환경에 맞는 API URL 가져오기
    const API_URL = await getApiUrl();
    console.log("🔗 사용할 API URL:", API_URL);

    const response = await fetch(`${API_URL}${USER_ID}/boj-cookies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${USER_TOKEN}`, // JWT 토큰 헤더 추가
      },
      body: JSON.stringify({ cookieValue }),
    });

    if (response.ok) {
      console.log("✅ 백준 쿠키가 서버에 성공적으로 저장되었습니다.");
    } else {
      console.error("❌ 쿠키 저장 실패:", await response.text());
    }
  } catch (error) {
    console.error("❌ API 호출 중 오류 발생:", error);
  }
}

// 확장 프로그램이 처음 로드될 때 사용자 정보를 미리 설정하고 감시자 설정
loadAndSetUserInfo();
setupUserIdWatcher();
