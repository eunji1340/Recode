//크롬 확장 프로그램의 background script에서 쿠키 추출하고 서버로 전송하는 역할

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { //content script(backjoon.js)에서 보낸 메시지를 수신하는 리스너
  if (message.type === "getCookie") { //메시지 타입이 "getCookie"일 때만 로직 실행
    chrome.cookies.get( //bojautologin이라는 이름의 쿠키를 백준 도메인에서 가져옴
      { url: "https://www.acmicpc.net", name: "bojautologin" },
      function (cookie) {
        if (cookie) {
          const now = Math.floor(Date.now() / 1000); //현재 시간을 초 단위로 계산, 쿠키의 expiretionDate가 유닉스 타임스탬프이므로 형식을 맞추기 위해 ms -> s로 변환
          if (cookie.expirationDate && cookie.expirationDate < now) { //쿠키가 만료된 경우를 체크
            console.warn("bojautologin 쿠키가 만료되었습니다.");
            sendResponse({ success: false, reason: "expired" });
            return;
          }

          fetch("http://localhost:8080/api/baekjoon-cookie", { //백엔드 서버에 쿠키를 POST 방식으로 전송
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cookie: cookie.value }),
          })
            .then((res) => {
              if (res.ok) {
                console.log("✅ 쿠키 전송 성공");
                sendResponse({ success: true });
              } else {
                console.error("❌ 쿠키 전송 실패 - 응답 오류", res.status);
                sendResponse({ success: false, reason: "response error" });
              }
            })
            .catch((err) => {
              console.error("❌ 쿠키 전송 실패 - 네트워크 오류", err);
              sendResponse({ success: false, reason: "network error" });
            });
        } else {
          console.warn("⚠️ bojautologin 쿠키가 없습니다.");
          sendResponse({ success: false, reason: "no cookie" });
        }
      }
    );

    return true; 
  }
});
