chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getCookie") {
    chrome.cookies.get(
      { url: "https://www.acmicpc.net", name: "bojautologin" },
      function (cookie) {
        if (cookie) {
          const now = Math.floor(Date.now() / 1000);
          if (cookie.expirationDate && cookie.expirationDate < now) {
            console.warn("⏰ bojautologin 쿠키가 만료되었습니다.");
            sendResponse({ success: false, reason: "expired" });
            return;
          }

          // ⭐ accessToken을 chrome.storage.local에서 가져오기
          chrome.storage.local.get("accessToken", (result) => {
            const token = result.accessToken;

            if (!token) {
              console.error("❌ accessToken 없음. 서버 전송 불가");
              sendResponse({ success: false, reason: "no accessToken" });
              return;
            }

            // ✅ 서버로 쿠키 + accessToken 전송
            fetch("http://localhost:8080/api/baekjoon-cookie", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // accessToken 붙이기
              },
              body: JSON.stringify({
                cookie: cookie.value,
              }),
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
          });
        } else {
          console.warn("⚠️ bojautologin 쿠키가 없습니다.");
          sendResponse({ success: false, reason: "no cookie" });
        }
      }
    );

    return true; // sendResponse 비동기 응답 허용
  }
});
