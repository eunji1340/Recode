
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("메시지 수신됨:", message);
  if (message.type === "getCookie") {
     console.log("쿠키 요청 처리 시작");
    chrome.cookies.get(
      { url: "https://www.acmicpc.net", name: "bojautologin" },
      function (cookie) {
          console.log("쿠키 검색 결과:", cookie);
        if (cookie) {
          const now = Math.floor(Date.now() / 1000);
          if (cookie.expirationDate && cookie.expirationDate < now) {
            console.warn("bojautologin 쿠키가 만료되었습니다.");
            return;
          }

          fetch("https://recode.example.com/api/baekjoon-cookie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cookie: cookie.value }),
          })
            .then((res) => {
              if (res.ok) {
                console.log("✅ 쿠키 전송 성공");
              } else {
                console.error("❌ 쿠키 전송 실패 - 응답 오류", res.status);
              }
            })
            .catch((err) => {
              console.error("❌ 쿠키 전송 실패 - 네트워크 오류", err);
            });
        } else {
          console.warn("⚠️ bojautologin 쿠키가 없습니다.");
        }
      }
    );
  }
});