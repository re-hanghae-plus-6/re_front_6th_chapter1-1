## 과제 셀프회고

### 기술적 성장

**Pub/Sub 패턴 기반 상태 관리 시스템 구현**

- React의 useState와 유사하게 반응형 상태 관리를 바닐라 JS로 구현
- `subscribe/notify` 패턴을 통해 상태 변경 시 자동 리렌더링
- 여러 컴포넌트 간 상태 공유와 동기화에 대한 깊은 이해 획득
  아쉬운점: 모든 상태를 전역 state하나로 구현함. 해당 페이지에서만 사용되는 상태도 state에 전부 있어 점점 state가 커짐
  **커스텀 SPA 라우팅 시스템 개발**

- History API를 활용한 브라우저 네비게이션 구현
- 정규식 기반 라우트 매칭과 파라미터 추출 로직 설계
- URL 쿼리 파라미터를 통한 상태 관리
  아쉬운점: 네비게이션으로 페이지 이동시, 전체적으로 로딩이필요한경우, 로딩 없이 일부 UI만 렌더가 필요한 경우가 나뉘는데 이부분에대한 고민을 깊게하지않고 모두 하나의 네비게이션 함수로 통일. 관련처리는 router에게 넘김(router에서 판단하여 렌더링분기)
  **컴포넌트 생명주기 관리**

- 페이지 컴포넌트의 생성, 렌더링, 정리 과정으로 분리(create, render, clean)
- 컴포넌트 인스턴스 생성해 page 변수에 할당
  아쉬운점: clean 은 상품리스트 페이지에만 존재. (scrollEvent 해지를 위한 역할). 좀더 명확한 분리 필요

### 자랑하고 싶은 코드

**Pub-Sub 패턴 상태 관리 (`src/store/stateStore.js`)**

```javascript
const listeners = new Set();

export function subscribe(callback) {
  listeners.add(callback);
  callback();
  return () => listeners.delete(callback);
}

export const setState = (partialState) => {
  Object.assign(state, partialState);
  notify();
};
```

- React의 setState와 유사하게, 상태업데이트시 재렌더링 하기위해 Pub/Sub패턴을 사용하기로 결정
  아쉬운점: 해지가 없다. 페이지를 수차례 이동하면 리스너가 계속 추가될지도 모르겠다.

### 개선이 필요하다고 생각하는 코드

**장바구니 상태 관리의 이중화 문제**

- `stateStore.js`의 cart 상태와 `cartStore.js`의 분리된 관리
- 두 store 간 동기화 코드의 복잡성이 올라감. 실수할 가능성 증가
- cart 데이터는 state에 저장하지않고 cartStore에서만 관리했어야 할까?
- cartStore 는 localstorage와 연결되어있음. 이것도 분리해도 좋을것 같다.

**컴포넌트 간 의존성 주입의 복잡성**

```javascript
page = ProductListPage({ state, setState, openCartModal, addToCart, navigateTo });
```

- 너무 많은 의존성을 props로 전달하는 구조
- 의존성 주입 ? 어떻게 개선해야할지 모르겠다.

**라우터 함수의 복잡성과 책임 과다**

```javascript
function router() {
  // 70여 줄의 복잡한 로직
  if (!page || page.pageType === "detail") {
    setState({ loading: true });
  }
  cartStore.loadFromStorage();
  const { openCartModal, updateQuantityInputs, addToCart, renderCartModal } = cartModal({ state, setState });
  subscribe(() => {
    /* 구독 1 */
  });
  setState({ cart: cartStore.state.cart });

  if (route.page === "list") {
    setState({
      /* 상태 설정 */
    });
    if (page && page.pageType === "list") {
      page.render();
      return;
    }
    page = ProductListPage({
      /* 의존성 주입 */
    });
    subscribe(() => {
      /* 구독 2 */
    });
    page.createPage();
    return;
  }
  // 유사한 패턴이 각 페이지마다 반복...
}
```

- 라우팅, 상태 관리, 페이지 생성, 구독 관리 등 너무 많은 책임
- 각 페이지마다 중복되는 패턴 (상태 설정 → 페이지 생성 → 구독 → 초기화) 묶을 수 있을텐데 하지 못함.
- 구독 해지 없이 계속 누적되는 메모리 누수 문제
- 전역 `page` 변수 사용으로 인한 상태 관리의 복잡함
- 페이지별 특수 처리 로직이 하드코딩..

### 학습 효과 분석

**가장 큰 배움이 있었던 부분**

- 프레임워크 없이 현대적인 웹 애플리케이션 패턴 구현
- Pub/Sub 패턴의 실제 적용과 상태 관리 시스템 설계
- SPA 라우팅과 브라우저 히스토리 API 활용
- 테스트코드의 이해도가 올라감

**추가 학습이 필요한 영역**

- 상태 관리 라이브러리 (Redux, Zustand) 패턴 학습
- 컴포넌트 간 통신 최적화 방법

**실무 적용 가능성**

- Pub/Sub 패턴을 활용한 상태 관리 개념
- 컴포넌트 생명주기 관리 경험
- 브라우저 API 활용 능력 향상..?

### 과제 피드백

**과제에서 좋았던 부분**

- 단계별 요구사항으로 점진적으로 개발 해볼 수 있었음
- 테스트 코드 작성을 통한 안정성 확보
  - 잘 돌아가던 테스트가 다른 코드 수정시 안되는 문제 다수 발생. 코드의 안정성을 보장받는다 느낌
- 평소 라이브러리와 프레임워크에 의존해 구현하던 것들을 직접 해보니 고려해야할 것들이 많다는것을 느낌  
  그러면서 평소 내가 개발하며 놓치고있었던 메모리관리와 설계에 대해서도 고민해보게됨

오랜만에 신입때처럼 몰두해서 개발했어요. 역시 난이도 있는 과제는 할땐 힘들어도 하고나면 뿌듯하고 성취감이 드는것 같습니다. 또 SPA, React useState 직접 구현해보자 해보자 말만하고 항상 쉽게 손이 가질 않는데 이번기회에 이렇게 좋은 과제로 주셔서 너무 재밌게 개발했어요!!! 힘들었지만 그만큼 얻어가는게 많은 과제였습니다 감사합니다. 고생하셨습니다.

**과제에서 모호하거나 애매했던 부분**

- 로딩 순서 같은거.. 모호했어요 e.g) 상품 디테일 선로드 후 관련상품 로드. 기준이 '관련 상품' 이런.. UI 적인 모호함.. 하지만 테스트코드가 곧 요구사항이다 라고 생각하고 개발했습니다.

### AI 활용 경험 공유하기

**사용한 AI 도구**

적극적으로 활용했습니다.

- Claude (Cursor IDE)
- ChatGPT (에러, 배포 관련 )

**AI와 함께한 개발 과정**

- 옵저버 패턴 구현 시 구체적인 구현 방법과 베스트 프랙티스 학습
- 복잡한 라우팅 로직의 정규식 패턴 최적화
- 테스트 코드 작성 시 다양한 시나리오 발굴

**AI가 일을 더 잘 하게 만든 방법**

- 구체적인 요구사항과 함께 현재 코드 컨텍스트 제공
- 단계별 질문을 통한 점진적 문제 해결 ( 페이지만들어줘. 가 아니라 잘게 쪼개서 패치 구현, UI 로드, 서버에서 받아온 데이터 UI 반영 등 나누어 요청 )
- 코드 리뷰 관점에서 개선점 도출 (두가지 중 고민이 될때 각각 입장을 가진 개발자의 토론을 보여달라 요청
  e.g Pub/Sub vs Observer )

## 리뷰 받고 싶은 내용

### 1. 상태 관리 아키텍처 설계에 대한 피드백

현재 `stateStore.js`와 `cartStore.js`로 상태를 분리했지만, 장바구니 상태가 두 store에서 중복 관리되고 있습니다.

```javascript
// stateStore.js
export const state = {
  cart: [], // 여기와
  // ... 다른 상태들
};

// cartStore.js
export const cartStore = {
  state: {
    cart: [], // 여기에 중복
  },
};
```

단일 store로 통합할지, 아니면 명확한 책임 분리를 통해 현재 구조를 개선할지 고민입니다.
또 localStorage 관련 로직을 별도 함수로 빼야했을지

### 2. 컴포넌트 의존성 주입 패턴 개선 방안

현재 페이지 컴포넌트 생성 시 많은 의존성을 전달하고 있습니다:

```javascript
page = ProductListPage({ state, setState, openCartModal, addToCart, navigateTo });
```

이런 구조에서 **의존성이 증가할 때마다 모든 컴포넌트를 수정해야 하는 문제**가 있습니다. 바닐라 JS 환경에서 의존성 주입을 더 깔끔하게 처리할 수 있는 패턴이 있을까요?

### 3. Pub/Sub 패턴 구현의 성능 최적화

현재 상태 변경 시 모든 구독자에게 알림을 보내는 구조입니다:

```javascript
export const setState = (partialState) => {
  Object.assign(state, partialState);
  notify(); // 모든 구독자에게 알림
};
```

**특정 상태 변경에만 반응하는 선택적 구독** 패턴이라던가.. 뭔가 성능 최적화 방법이 있을까요? React의 가상 DOM이나 Vue의 반응형 시스템과 비교했을 때 어떤 개선점이 있을까요?

### 4. Router 코드 역할 분리와 복잡성 개선

현재 `main.js`의 router 함수가 너무 많은 책임을 가지고 있어 복잡해졌습니다:

```javascript
function router() {
  // 1. 로딩 상태 관리
  if (!page || page.pageType === "detail") {
    setState({ loading: true });
  }

  // 2. 장바구니 초기화
  cartStore.loadFromStorage();
  const { openCartModal, updateQuantityInputs, addToCart, renderCartModal } = cartModal({ state, setState });

  // 3. 구독 관리 (해지 없이 계속 누적)
  subscribe(() => {
    updateQuantityInputs();
    renderCartModal();
  });

  // 4. 상태 동기화
  setState({ cart: cartStore.state.cart });

  // 5. 라우팅 로직
  const route = getRoute();

  // 6. 페이지별 처리 (각 페이지마다 중복 패턴)
  if (route.page === "list") {
    setState({
      /* 복잡한 필터 상태 설정 */
    });
    if (page && page.pageType === "list") {
      page.render();
      return;
    }
    page = ProductListPage({
      /* 많은 의존성 */
    });
    page.pageType = "list";
    subscribe(() => {
      page.render();
    });
    page.createPage();
    return;
  }

  // 7. 정리 작업 (일부 페이지만)
  if (page && page.pageType === "list") {
    page.cleanupScrollInfinity();
  }

  // 8. 또 다른 페이지 처리...
}
```

**구체적인 문제점들:**

- **70여 줄의 단일 함수**: 라우팅, 상태 관리, 페이지 생성, 구독 관리 등 너무 많은 책임
- **중복 패턴**: 각 페이지마다 "상태 설정 → 페이지 생성 → 구독 " 패턴이 반복
- **메모리 누수**: 구독 해지 없이 `subscribe()` 호출이 계속 누적됨
- **전역 변수 의존성**: `page` 변수를 전역에서 관리하여 상태 추적이 어려움
- **하드코딩된 분기**: 페이지별 특수 처리 로직이 if-else로 하드코딩. 페이지별 특수 처리 로직 어떻게 해야할까요? 예를들면 상세 -> 디테일 페이지로 이동했을경우와 상세 -> 상세 페이지일 경우 처리가 다름

**개선 방향 고민:**

1. **router 함수를 어떻게 분리**해야 할까요?
2. **navigateTo 함수**와 router의 관계를 어떻게 정리하는 것이 좋을까요?
