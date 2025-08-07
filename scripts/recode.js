//Recode 웹사이트 (지금은 http://localhost:8080)에서 JWT accessToken을 추출해서 background script로 전달

(function () {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    console.log("✅ accessToken 추출 성공:", accessToken);
    chrome.runtime.sendMessage({ accessToken });
  } else {
    console.warn("⚠️ accessToken이 localStorage에 없습니다.");
  }
})();