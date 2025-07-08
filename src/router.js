// 페이지 컴포넌트 임포트
// 컴포넌트 추가 부분
import { home } from "./pages/home.js";

// 404 페이지 컴포넌트
const NotFoundPage = (mainStatus) => {
  return /*html*/ `
    <main class="max-w-md mx-auto px-4 py-4">
      <div class="text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg">
      <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1a73e8;stop-opacity:1" />
          </linearGradient>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="#000000" flood-opacity="0.1"/>
          </filter>
        </defs>
        
        <!-- 404 Numbers -->
        <text x="160" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="48" font-weight="600" fill="url(#blueGradient)" text-anchor="middle">404</text>
        
        <!-- Icon decoration -->
        <circle cx="80" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
        <circle cx="240" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
        <circle cx="90" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
        <circle cx="230" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
        
        <!-- Message -->
        <text x="160" y="110" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="400" fill="#5f6368" text-anchor="middle">페이지를 찾을 수 없습니다</text>
        
        <!-- Subtle bottom accent -->
        <rect x="130" y="130" width="60" height="2" rx="1" fill="url(#blueGradient)" opacity="0.3"/>
      </svg>
      
      <a href="/" data-link class="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">홈으로</a>
    </div>
    </main>
  `;
};

const routes = {
  "/": home,
  // "/products/:id": productDetail, 
};

// 라우터 인스턴스 생성 및 관리 함수
export const createRouter = (initialmainStatus) => {
  let currentmainStatus = initialmainStatus; // main.js에서 전달받은 mainStatus 객체
  const appRoot = document.querySelector("#root"); // 콘텐츠가 렌더링될 DOM 요소

  // 현재 URL 경로에 맵핑된 컴포넌트 렌더링 함수
  const render = () => {
    const path = window.location.pathname;
    let ComponentToRender = routes[path] || NotFoundPage; // 매칭되는 라우트가 없으면 404 페이지

    // 매칭된 컴포넌트를 현재 mainStatus 객체와 함께 렌더링
    appRoot.innerHTML = ComponentToRender(currentmainStatus);
  };

  // URL 변경을 트리거하고 렌더링을 재 수행 함수
  const navigate = (path) => {
    if (window.location.pathname !== path) { // 현재 경로와 다를 때만 pushState
      window.history.pushState(null, "", path);
    }
    render(); // URL 변경 후 렌더링
  };

  // 외부에서 mainStatus을 업데이트하고 렌더링을 트리거할 수 있는 함수
  const updateStateAndRender = (newmainStatus) => {
    currentmainStatus = newmainStatus; // 상태 업데이트
    render(); // 업데이트된 상태로 다시 렌더링
  };

  // 링크 클릭 이벤트 핸들러
  const handleLinkClick = (event) => {
    // data-link 속성이 있는 링크만 처리
    if (event.target.matches("[data-link]")) {
      event.preventDefault(); // 기본 링크 동작(페이지 새로고침) 방지
      navigate(event.target.href); // 라우터의 navigate 함수 호출
    }
  };

  // 브라우저 뒤로/앞으로 버튼 클릭 시
  window.addEventListener("popstate", render);

  // 초기 페이지 로드 시 라우팅 실행 및 링크 이벤트 리스너 등록
  document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", handleLinkClick);
    render(); // 초기 렌더링
  });

  // 외부에서 사용할 수 있는 라우터 API 반환
  return {
    navigate,
    updateStateAndRender,
    // 필요하다면 현재 상태를 반환하는 getter 등 추가 가능
    getCurrentState: () => currentmainStatus,
  };
};
