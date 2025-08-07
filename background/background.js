console.log("✅ background.js 시작됨");

chrome.cookies.getAll({}, (cookies) => {
  console.log("🌐 모든 쿠키 목록:", cookies.map(c => `${c.domain} → ${c.name}`));
});
