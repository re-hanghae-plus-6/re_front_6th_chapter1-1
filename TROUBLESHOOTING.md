# CI 환경 E2E 테스트 `장바구니 비우기` 실패 원인 및 해결 가이드

## 😱 증상

- GitHub Actions(또는 CI)에서 `pnpm run test:hard:advanced` 실행 시 다음 오류가 간헐적으로, 혹은 항상 발생
  ```
  Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  Locator: locator('text=장바구니가 비어있습니다')
  ...
  element was detached from the DOM, retrying
  ```
- 로컬 환경(맥·Windows)에서는 동일 스크립트가 정상 통과 → **환경 의존적 플러키(flaky) 테스트**

## 🔍 1단계: 원인 분석

| 단계                   | 관찰                                                                                                            | 결론                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Playwright Traces 확인 | `#cart-modal-clear-cart-btn` 클릭 직후 모달 내부 DOM이 즉시 `innerHTML` 교체로 재생성됨                         | 테스트 러너가 버튼을 다시 찾는 동안 요소가 "detached" 상태가 되며 실패 |
| 코드 탐색              | `src/core/cart.js` 의 `handleModalClick()` 에서 `renderModalContent()` 호출을 **`await` 하지 않고** 즉시 넘어감 | DOM 업데이트가 비동기로 진행되어 버튼·텍스트가 바뀌는 타이밍 불안정    |
| 속도 차이 실험         | `slowMo` 100ms 로컬 실행 시 동일 오류 재현                                                                      | 네트워크·CPU가 느린 CI 환경에서만 주기적으로 터짐                      |

## 💡 해결 전략

1. **DOM 안정화**: 상태 변경 후 `await renderModalContent()` 로 렌더 완료까지 대기
2. **불필요한 `Promise.resolve()` 래핑 제거**: 불필요한 마이크로태스크 스케줄링이 race condition 확대
3. **전역 패턴 적용**: 수량 변경, 선택 토글, 삭제 등 모든 위치에 동일 처리

## 🛠️ 적용된 핵심 코드 (발췌)

```diff
- renderModalContent(); // 비동기 처리하지만 대기하지 않음
+ await renderModalContent(); // DOM 업데이트 완료까지 대기
```

모든 write 계열 이벤트(선택 삭제·전체 비우기 등)에 동일 패치가 적용되었습니다.

## ✅ 결과

- 로컬 & CI 환경 모두 **18/18** 테스트 통과 (Playwright)
- element detached, timeout 에러 재발 없음 (3회 반복 실행 기준)

## 🔒 재발 방지 체크리스트

1. **UI 변경 직후 테스트 검증 필요** → `await` 로 DOM 안정화
2. **E2E 플러키 테스트는 Trace 열어 정확한 DOM 상태 확인**
3. **CI slowMo / throttling 옵션으로 로컬에서 미리 스트레스 테스트**

## 📚 참고 자료

- Playwright Docs – "Element is not attached to the DOM" FAQ
- MDN – `requestAnimationFrame` 로 렌더링 완료 보장 패턴

> 이 문서는 `cart.js` 수정 PR 과 함께 유지보수 히스토리를 기록하기 위한 용도입니다. 추가 이슈가 발생하면 업데이트해 주세요.
