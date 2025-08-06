console.log("📤 Content Script loaded. Sending message to background...");

chrome.runtime.sendMessage({ type: "getCookie" }, (response) => {
  console.log("📬 Message sent to background.js");
});