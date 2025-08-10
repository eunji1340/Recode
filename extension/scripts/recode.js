
// 서버 API 엔드포인트와 사용자 ID를 설정합니다.
// 💡 아래 URL과 userId는 실제 서버 환경에 맞게 변경해야 합니다.
const API_URL = "http://localhost:8080/api/users/";
const USER_ID = 1; // 쿠키를 저장할 사용자의 ID

console.log("백준 쿠키 추출 스크립트가 로드되었습니다.");

// document.cookie에서 'OnlineJudge' 쿠키 값을 추출하는 함수
function getBojCookieValue() {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('OnlineJudge=')) {
            return cookie.substring('OnlineJudge='.length, cookie.length);
        }
    }
    return null;
}

// 추출한 쿠키 값을 서버로 전송하는 함수
async function sendCookieToServer(cookieValue) {
    if (!cookieValue) {
        console.log("OnlineJudge 쿠키를 찾을 수 없습니다.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}${USER_ID}/boj-cookie-value`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cookieValue: cookieValue })
        });

        if (response.ok) {
            console.log("✅ 백준 쿠키가 서버에 성공적으로 저장되었습니다.");
        } else {
            console.error("❌ 쿠키 저장 실패:", await response.text());
        }
    } catch (error) {
        console.error("❌ API 호출 중 오류 발생:", error);
    }
}

// 페이지가 로드되면 자동으로 쿠키를 추출하고 전송합니다.
const cookieValue = getBojCookieValue();
sendCookieToServer(cookieValue);