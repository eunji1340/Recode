chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getAccessToken") {
    const token = localStorage.getItem("accessToken");
    sendResponse({ accessToken: token });
  }
});