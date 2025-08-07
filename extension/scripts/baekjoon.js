console.log("📤 Content Script loaded. Sending message to background..."); 
//브라우저 콘솔에 로그를 찍는 코드
//백준 페이지에 콘텐츠 스크립트(baekjoon.js)가 정상적으로 로드되었음을 시각적으로 확인하기 위함

chrome.runtime.sendMessage({ type: "getCookie" }, (response) => {
  console.log("📬 Message sent to background.js");
});
//확장 프로그램의 백그라운드 스크립트로 메시지 전송
//background.js에 등록된 onMessage 리스너가 이 메시지를 수신함
//백 그라운드로 메시지를 보내고 나서, 응답과 상관없이 무조건 이 로그가 찍힘