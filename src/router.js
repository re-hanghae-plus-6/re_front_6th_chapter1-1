// 페이지 컴포넌트 임포트
// 컴포넌트 추가 부분
import { home } from "./pages/home.js";
import { ProductDetail } from "./pages/ProductDetail.js";
import { NotFound } from "./pages/NotFound.js";

const routes = {
  "/": home,
  "/product/:id": ProductDetail,
};

// 라우터 인스턴스 생성 및 관리 함수
export const createRouter = (initialmainStatus) => {
  let currentmainStatus = JSON.parse(JSON.stringify(initialmainStatus)); // main.js에서 전달받은 mainStatus 객체
  const appRoot = document.querySelector("#root"); // 콘텐츠가 렌더링될 DOM 요소

  // 현재 URL 경로에 맵핑된 컴포넌트 렌더링 함수
  const render = () => {
    const path = window.location.pathname;
    let ComponentToRender = routes[path] || NotFound(); // 매칭되는 라우트가 없으면 404 페이지

    // 매칭된 컴포넌트를 현재 mainStatus 객체와 함께 렌더링
    appRoot.innerHTML = ComponentToRender(currentmainStatus);
  };

  // URL 변경을 트리거하고 렌더링을 재 수행 함수
  const navigate = (path) => {
    if (window.location.pathname !== path) {
      // 현재 경로와 다를 때만 pushState
      window.history.pushState(null, "", path);
    }
    render(); // URL 변경 후 렌더링
  };

  // 외부에서 mainStatus을 업데이트하고 렌더링을 트리거할 수 있는 함수
  const updateStateAndRender = (newmainStatus) => {
    currentmainStatus = JSON.parse(JSON.stringify(newmainStatus)); // 상태 업데이트
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
