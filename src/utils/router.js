// // 라우터 유틸리티
// class Router {
//   constructor() {
//     this.routes = new Map();
//     this.currentPath = "/";
//     this.isInitialized = false;
//     this.pendingInitialRoute = window.location.pathname;
//   }

//   // 라우트 등록
//   register(path, handler) {
//     this.routes.set(path, handler);
//   }

//   // 라우터 초기화 완료 후 초기 경로 처리
//   initializeRoutes() {
//     if (!this.isInitialized) {
//       this.isInitialized = true;
//       console.log("라우터 초기화 완료, 초기 경로 처리:", this.pendingInitialRoute);
//       this.navigate(this.pendingInitialRoute, false);
//     }
//   }

//   // 패턴 매칭 함수
//   matchRoute(requestedPath) {
//     console.log("경로 매칭 시도:", requestedPath);
//     console.log("등록된 라우트:", Array.from(this.routes.keys()));

//     for (const [pattern, handler] of this.routes) {
//       // 정확한 매칭
//       if (pattern === requestedPath) {
//         console.log("정확한 매칭 발견:", pattern);
//         return { handler, params: {} };
//       }

//       // 동적 라우트 매칭 (예: /product/:id)
//       if (pattern.includes(":")) {
//         const patternParts = pattern.split("/");
//         const pathParts = requestedPath.split("/");

//         if (patternParts.length === pathParts.length) {
//           const params = {};
//           let isMatch = true;

//           for (let i = 0; i < patternParts.length; i++) {
//             if (patternParts[i].startsWith(":")) {
//               // 동적 파라미터 추출
//               const paramName = patternParts[i].substring(1);
//               params[paramName] = pathParts[i];
//             } else if (patternParts[i] !== pathParts[i]) {
//               isMatch = false;
//               break;
//             }
//           }

//           if (isMatch) {
//             console.log("동적 매칭 발견:", pattern, "파라미터:", params);
//             return { handler, params };
//           }
//         }
//       }
//     }

//     console.log("매칭되는 라우트 없음");
//     return null;
//   }

//   // 페이지 이동
//   navigate(path, updateHistory = true) {
//     console.log("페이지 이동 시도:", path);
//     this.currentPath = path;

//     if (updateHistory) {
//       window.history.pushState({ path }, "", path);
//     }

//     const match = this.matchRoute(path);
//     if (match) {
//       // 파라미터를 전역에서 접근할 수 있도록 설정
//       this.currentParams = match.params;
//       console.log("핸들러 실행:", path);
//       match.handler();
//     } else {
//       console.log("404 처리:", path);
//       // 404 처리 - 등록된 404 핸들러가 있으면 사용, 없으면 기본 404 페이지
//       const notFoundHandler = this.routes.get("/404");
//       if (notFoundHandler) {
//         notFoundHandler();
//       } else {
//         this.navigate("/404", false);
//       }
//     }
//   }

//   // 현재 경로 가져오기
//   getCurrentPath() {
//     return this.currentPath;
//   }

//   // 현재 파라미터 가져오기
//   getCurrentParams() {
//     return this.currentParams || {};
//   }

//   // URL 파라미터 파싱 (쿼리 스트링)
//   getParams() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const params = {};
//     for (const [key, value] of urlParams) {
//       params[key] = value;
//     }
//     return params;
//   }

//   // URL 변경 감지 (수동으로 URL을 수정했을 때)
//   handleUrlChange() {
//     const currentPath = window.location.pathname;
//     if (currentPath !== this.currentPath) {
//       this.navigate(currentPath, false);
//     }
//   }

//   // 디버깅용: 등록된 라우트 확인
//   getRegisteredRoutes() {
//     return Array.from(this.routes.keys());
//   }
// }

// // 전역 라우터 인스턴스
// export const router = new Router();

// // 편의 함수들
// export const navigateTo = (path) => router.navigate(path);
// export const getCurrentPath = () => router.getCurrentPath();
// export const getCurrentParams = () => router.getCurrentParams();
// export const getParams = () => router.getParams();
