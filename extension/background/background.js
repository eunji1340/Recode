chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "requestAccessToken") {
    fetchAccessTokenFromWeb();
    sendResponse({ success: true });
  }

  // content script에서 직접 accessToken 보내는 케이스 처리
  if (request.type === "accessTokenFromContent") {
    chrome.storage.local.set({ accessToken: request.accessToken }, () => {
      console.log("✅ background에 accessToken 저장 완료:", request.accessToken);
      sendResponse({ success: true });
    });

    return true; // sendResponse 비동기 처리
  }
});