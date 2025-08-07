(function () {
  const token = localStorage.getItem("accessToken");
  if (token) {
    chrome.runtime.sendMessage({
      type: "accessTokenFromContent",
      accessToken: token
    }, (response) => {
      if (response?.success) {
        console.log("✅ accessToken 자동 전송 성공");
      } else {
        console.warn("❌ accessToken 전송 실패");
      }
    });
  } else {
    console.warn("⚠️ localStorage에서 accessToken을 찾을 수 없습니다.");
  }
})();