// 애플리케이션 실제 엔트리 (TypeScript)
// 앞으로 모든 SPA 초기화 코드를 여기에 작성합니다.

/**
 * 초기 부트스트랩 함수
 */
export function bootstrap() {
  const root = document.getElementById("root");
  if (!root) return;

  // 임시: 기본 화면 표시 (개발 중)
  root.innerHTML = `<div class="p-4 text-center text-gray-700">TypeScript 기반 SPA 부트스트랩 성공 🎉</div>`;
}

// 실행
bootstrap();
