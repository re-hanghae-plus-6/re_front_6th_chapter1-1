## 과제 체크포인트

### 배포 링크

<!--
배포 링크를 적어주세요
예시: https://<username>.github.io/front-6th-chapter1-1/

배포가 완료되지 않으면 과제를 통과할 수 없습니다.
배포 후에 정상 작동하는지 확인해주세요.
-->

### 기본과제

#### 상품목록

**상품 목록 로딩**

- [x] 페이지 접속 시 로딩 상태가 표시된다
- [x] 데이터 로드 완료 후 상품 목록이 렌더링된다
- [ ] 로딩 실패 시 에러 상태가 표시된다
- [ ] 에러 발생 시 재시도 버튼이 제공된다

**상품 목록 조회**

- [x] 각 상품의 기본 정보(이미지, 상품명, 가격)가 카드 형태로 표시된다

**한 페이지에 보여질 상품 수 선택**

- [x] 드롭다운에서 10, 20, 50, 100개 중 선택할 수 있으며 기본 값은 20개 이다.
- [x] 선택 변경 시 즉시 목록에 반영된다

**상품 정렬 기능**

- [x] 상품을 가격순/인기순으로 오름차순/내림차순 정렬을 할 수 있다.
- [x] 드롭다운을 통해 정렬 기준을 선택할 수 있다
- [x] 정렬 변경 시 즉시 목록에 반영된다

**무한 스크롤 페이지네이션**

- [x] 페이지 하단 근처 도달 시 다음 페이지 데이터가 자동 로드된다
- [x] 스크롤에 따라 계속해서 새로운 상품들이 목록에 추가된다
- [x] 새 데이터 로드 중일 때 로딩 인디케이터와 스켈레톤 UI가 표시된다
- [x] 홈 페이지에서만 무한 스크롤이 활성화된다

**상품을 장바구니에 담기**

- [x] 각 상품에 장바구니 추가 버튼이 있다
- [x] 버튼 클릭 시 해당 상품이 장바구니에 추가된다
- [x] 추가 완료 시 사용자에게 알림이 표시된다

**상품 검색**

- [x] 상품명 기반 검색을 위한 텍스트 입력 필드가 있다
- [ ] 검색 버튼 클릭으로 검색이 수행된다
- [x] Enter 키로 검색이 수행된다
- [x] 검색어와 일치하는 상품들만 목록에 표시된다

**카테고리 선택**

- [x] 사용 가능한 카테고리들을 선택할 수 있는 UI가 제공된다
- [x] 선택된 카테고리에 해당하는 상품들만 표시된다
- [x] 전체 상품 보기로 돌아갈 수 있다
- [x] 2단계 카테고리 구조를 지원한다 (1depth, 2depth)

**카테고리 네비게이션**

- [x] 현재 선택된 카테고리 경로가 브레드크럼으로 표시된다
- [x] 브레드크럼의 각 단계를 클릭하여 상위 카테고리로 이동할 수 있다
- [x] "전체" > "1depth 카테고리" > "2depth 카테고리" 형태로 표시된다

**현재 상품 수 표시**

- [x] 현재 조건에서 조회된 총 상품 수가 화면에 표시된다
- [x] 검색이나 필터 적용 시 상품 수가 실시간으로 업데이트된다

#### 장바구니

**장바구니 모달**

- [ ] 장바구니 아이콘 클릭 시 모달 형태로 장바구니가 열린다
- [ ] X 버튼이나 배경 클릭으로 모달을 닫을 수 있다
- [ ] ESC 키로 모달을 닫을 수 있다
- [ ] 모달에서 장바구니의 모든 기능을 사용할 수 있다

**장바구니 수량 조절**

- [ ] 각 장바구니 상품의 수량을 증가할 수 있다
- [ ] 각 장바구니 상품의 수량을 감소할 수 있다
- [ ] 수량 변경 시 총 금액이 실시간으로 업데이트된다

**장바구니 삭제**

- [ ] 각 상품에 삭제 버튼이 배치되어 있다
- [ ] 삭제 버튼 클릭 시 해당 상품이 장바구니에서 제거된다

**장바구니 선택 삭제**

- [ ] 각 상품에 선택을 위한 체크박스가 제공된다
- [ ] 선택 삭제 버튼이 있다
- [ ] 체크된 상품들만 일괄 삭제된다

**장바구니 전체 선택**

- [ ] 모든 상품을 한 번에 선택할 수 있는 마스터 체크박스가 있다
- [ ] 전체 선택 시 모든 상품의 체크박스가 선택된다
- [ ] 전체 해제 시 모든 상품의 체크박스가 해제된다

**장바구니 비우기**

- [ ] 장바구니에 있는 모든 상품을 한 번에 삭제할 수 있다

#### 상품 상세

**상품 클릭시 상세 페이지 이동**

- [x] 상품 목록에서 상품 이미지나 상품 정보 클릭 시 상세 페이지로 이동한다
- [x] URL이 `/product/{productId}` 형태로 변경된다
- [x] 상품의 자세한 정보가 전용 페이지에서 표시된다

**상품 상세 페이지 기능**

- [x] 상품 이미지, 설명, 가격 등의 상세 정보가 표시된다
- [x] 전체 화면을 활용한 상세 정보 레이아웃이 제공된다

**상품 상세 - 장바구니 담기**

- [x] 상품 상세 페이지에서 해당 상품을 장바구니에 추가할 수 있다
- [ ] 페이지 내에서 수량을 선택하여 장바구니에 추가할 수 있다
- [x] 수량 증가/감소 버튼이 제공된다

**관련 상품 기능**

- [x] 상품 상세 페이지에서 관련 상품들이 표시된다
- [x] 같은 카테고리(category2)의 다른 상품들이 관련 상품으로 표시된다
- [x] 관련 상품 클릭 시 해당 상품의 상세 페이지로 이동한다
- [x] 현재 보고 있는 상품은 관련 상품에서 제외된다

**상품 상세 페이지 내 네비게이션**

- [x] 상품 상세에서 상품 목록으로 돌아가는 버튼이 제공된다
- [x] 브레드크럼을 통해 카테고리별 상품 목록으로 이동할 수 있다
- [x] SPA 방식으로 페이지 간 이동이 부드럽게 처리된다

#### 사용자 피드백 시스템

**토스트 메시지**

- [x] 장바구니 추가 시 성공 메시지가 토스트로 표시된다
- [x] 장바구니 삭제, 선택 삭제, 전체 삭제 시 알림 메시지가 표시된다
- [x] 토스트는 3초 후 자동으로 사라진다
- [x] 토스트에 닫기 버튼이 제공된다
- [x] 토스트 타입별로 다른 스타일이 적용된다 (success, info, error)

### 심화과제

#### SPA 네비게이션 및 URL 관리

**페이지 이동**

- [x] 어플리케이션 내의 모든 페이지 이동(뒤로가기/앞으로가기를 포함)은 하여 새로고침이 발생하지 않아야 한다.

**상품 목록 - URL 쿼리 반영**

- [x] 검색어가 URL 쿼리 파라미터에 저장된다
- [x] 카테고리 선택이 URL 쿼리 파라미터에 저장된다
- [x] 상품 옵션이 URL 쿼리 파라미터에 저장된다
- [x] 정렬 조건이 URL 쿼리 파라미터에 저장된다
- [x] 조건 변경 시 URL이 자동으로 업데이트된다
- [x] URL을 통해 현재 검색/필터 상태를 공유할 수 있다

**상품 목록 - 새로고침 시 상태 유지**

- [x] 새로고침 후 URL 쿼리에서 검색어가 복원된다
- [x] 새로고침 후 URL 쿼리에서 카테고리가 복원된다
- [x] 새로고침 후 URL 쿼리에서 옵션 설정이 복원된다
- [x] 새로고침 후 URL 쿼리에서 정렬 조건이 복원된다
- [x] 복원된 조건에 맞는 상품 데이터가 다시 로드된다

**장바구니 - 새로고침 시 데이터 유지**

- [x] 장바구니 내용이 브라우저에 저장된다
- [x] 새로고침 후에도 이전 장바구니 내용이 유지된다
- [x] 장바구니의 선택 상태도 함께 유지된다

**상품 상세 - URL에 ID 반영**

- [x] 상품 상세 페이지 이동 시 상품 ID가 URL 경로에 포함된다 (`/product/{productId}`)
- [x] URL로 직접 접근 시 해당 상품의 상세 페이지가 자동으로 로드된다

**상품 상세 - 새로고침시 유지**

- [x] 새로고침 후에도 URL의 상품 ID를 읽어서 해당 상품 상세 페이지가 유지된다

**404 페이지**

- [x] 존재하지 않는 경로 접근 시 404 에러 페이지가 표시된다
- [x] 홈으로 돌아가기 버튼이 제공된다

#### AI로 한 번 더 구현하기

- [ ] 기존에 구현한 기능을 AI로 다시 구현한다.
- [ ] 이 과정에서 직접 가공하는 것은 최대한 지양한다.

## 과제 셀프회고

<!-- 과제에 대한 회고를 작성해주세요 -->

준일 코치님의 블로그글을 보고 결심한 항해 플러스의 첫과제를 준일 코치님의 블로그 글 기반으로 학습할 수 있어서 즐거웠습니다.
처음에는 블로그글에 적혀있던 것을 기반으로 가볍게 render를 하고 mvc 단계로 나눠주는 부분이 포인트가 될 것 같다고 생각하였습니다.
그러나 과제를 시작해보니 많은 기능구현들을 마주하면서 상태관리, mount unmount, event 관리 등 많은 것을 정말 생각보다 많이 라이브러리에 의존하고 있었다는 것을 깨달았습니다.
처음에는 History API 만 구성하면 되겠지 => 리액트의 render 상태관리가 다 필요하겠군 => 이벤트처리하려면 전역으로 하나 관리해야되겠군.. 의 흐름으로 개발 과정이 이뤄졌던 것 같습니다.

### 기술적 성장

- 새로 학습한 개념

1. class 문법
   class 사용을 java에서는 과거에 많이 다뤄봤었지만 js class를 다룰만한 경험이 별로 없었습니다.
   자바스크립트 class를 이번 기회에 많이 익히게 된 것 같습니다.
   특히 개발중에 bind 관리를 해주지 않아서 this가 의도된 값을 바라보지 않아서 곤란해하며 버그를 수정했었습니다.

2. 이벤트 위임 방식
   리액트에서 이벤트 위임 방식으로 되어있다는 말은 수도 없이 들어봤지만,
   왜 최적화가 되고, 관리를 잘 할 수 있냐라는 점을 이번에 구성하면서 많이 깨달았습니다.

3. history API
   항상 리액트에서 제공하는 라이브러리로만 다루다보니 다룰일이 없어서 처음 다뤄본 내용이었습니다.
   history API가 복잡한 기능은 아니지만 항상 낯설고 어렵게 느껴졌는데, 한번 다뤄보니 친근해진 것 같습니다.

4. 테스트코드
   테스트 코드 자체를 처음 겪어봤습니다.
   물론 작성해본건 아니지만 테스트코드가 계속 실패하면서 어떤 함수들로 어떻게 테스트가 진행되는지 가볍게 볼 수는 있었던 것 같습니다.

5. 기간을 지키는 개발
   사실 이벤트를 전역으로 등록하지 않아도, component class를 구현하지 않아도 기능자체는 구현할 수 있었음에도,
   기능을 하나하나 구현할 때마다 계속 좋은 구조로 리팩토링을 진행하였습니다.
   장바구니 기능만 구현을 못했는데, 이런 부분이 아쉬워서 다음부터는 기간을 신경쓰면서 스스로 타협하면서 과제를 진행해야겠다고 느꼈습니다.

6. 리액트에서 해주던 상태관리 생명주기의 필요성
   리액트만의 구성단계라고 생각했었는데, 실제로 구현을 하면서 필요한 기능을 넣다보니, 결국 리액트에서 class 컴포넌트로 구성했던 모습과 비슷한 형태로 가게 되었습니다.
   meta에서 어떤 고민을 하면서 이런 흐름이 이어졌을까를 느낄 수 있었던 시간이었습니다.

### 자랑하고 싶은 코드

- 컴포넌트 class
  state를 어떻게 구성할 수 있을까와 rerender를 어떻게 구성하면 좋을까를 많이 고민하면서
  subscribe 패턴으로 구성과 크게 다르지 않겠구나를 반영한 코드입니다.
  결국에는 리액트 컴포넌트의 형태와 비슷하게 따라가게 될 수 밖에 없던게 인상적이었습니다.

```ts
export abstract class Component<P extends object = {}, S extends object = {}> {
  public isMounted = false;

  el: HTMLElement;

  parentEl?: HTMLElement;

  protected _state: S;

  get state(): S {
    return this._state;
  }

  set state(newState: S) {
    this._state = newState;
    this.update();
  }

  protected _props: P;

  constructor(props?: P, initialState?: S) {
    this._props = props ?? ({} as P);
    this._state = initialState ?? ({} as S); // state 초기화 추가
    this.el = this.render();
  }

  get props(): P {
    return this._props;
  }

  abstract render(): HTMLElement;

  update() {
    const newEl = this.render();
    this.el.replaceWith(newEl);
    this.el = newEl;
  }

  mount(target: HTMLElement) {
    if (this.isMounted) {
      return;
    }
    this.parentEl = target;

    this.parentEl.appendChild(this.el);
    this.isMounted = true;
    this.componentDidMount();
  }

  unmount() {
    if (!this.isMounted) {
      return;
    }

    this.componentWillUnmount();

    this.el.remove();

    this.isMounted = false;
  }

  componentDidMount() {}
  componentWillUnmount() {}
}
```

- 전역 이벤트 등록 함수
  EventDelegator 싱글턴 패턴을 사용해서 각 타입마다 전역 event 하나를 구성하도록 하였습니다.
  타입적으로도 안전하고 확장성 있게 구성하였습니다.

  ```ts
  export class EventDelegator {
    static instance: EventDelegator | null = null;
    handlers: {
      [K in keyof HTMLElementEventMap]?: Map<string, (e: HTMLElementEventMap[K]) => void>;
    } = {};

    static getInstance() {
      if (!EventDelegator.instance) {
        EventDelegator.instance = new EventDelegator();
      }
      return EventDelegator.instance;
    }

    constructor() {}

    dispatch(type: keyof HTMLElementEventMap, e: HTMLElementEventMap[keyof HTMLElementEventMap]) {
      const target = e.target;

      if (!(target instanceof Element)) {
        return;
      }

      const handlerMap = this.handlers[type];

      if (!handlerMap) return;

      // event-id 속성값을 가진 조상을 찾음
      const matchedEntry = [...handlerMap.entries()].find(([eventId]) => target?.closest(`[event-id="${eventId}"]`));

      if (matchedEntry) {
        const [eventId, handler] = matchedEntry;
        handler(e as any);
      }
    }

    register<K extends keyof HTMLElementEventMap>(
      type: K,
      eventId: string,
      handler: (e: HTMLElementEventMap[K]) => void,
    ) {
      let eventMap = this.handlers[type];

      if (eventMap) {
        eventMap.set(eventId, handler);
        return;
      }

      eventMap = new Map();
      eventMap.set(eventId, handler);
      this.handlers[type] = eventMap;

      document.body.addEventListener(type, this.dispatch.bind(this, type));
    }

    unregister(type: keyof HTMLElementEventMap, eventId: string) {
      this.handlers[type]?.delete(eventId);
    }
  }
  ```

  - 각 컴포넌트 화면
    mount unmount render 컴포넌트 섹션 등이 확실하게 분리되어있어서 바닐라 자바스크립트치고는 가독성이 괜찮지 않나..? 하는 자랑을 해봅니다.

  ```ts
    export class HomeComponent extends Component {
  상품_리스트_컴포넌트 = new 상품목록_상품_리스트_컴포넌트();
  로딩_컴포넌트 = new 상품목록_로딩컴포넌트();
  상품목록_하단_섹션 = new 상품목록_하단_섹션();
  카테고리_필터_섹션 = new 카테고리_필터_섹션();
  개수_정렬_필터_섹션 = new 개수_정렬_필터_섹션();
  상품명_검색_필터 = new 상품명_검색_필터();

  render(): HTMLElement {
    const el = document.createElement("div");
    el.innerHTML = 상품목록_메인레이아웃();
    return el;
  }

  componentDidMount() {
    handleProductList();
    const productContainer = document.getElementById("product-container");
    const categoryContainer = document.getElementById("category-filter-space");
    const filterContainer = document.getElementById("original-filter-space");
    const nameFilterContainer = document.getElementById("name-filter-space");

    if (productContainer) {
      this.상품_리스트_컴포넌트.mount(productContainer);
      this.로딩_컴포넌트.mount(productContainer);
      this.상품목록_하단_섹션.mount(productContainer);
    }

    if (categoryContainer) {
      this.카테고리_필터_섹션.mount(categoryContainer);
    }

    if (filterContainer) {
      this.개수_정렬_필터_섹션.mount(filterContainer);
    }

    if (nameFilterContainer) {
      this.상품명_검색_필터.mount(nameFilterContainer);
    }
  }

  componentWillUnmount() {
    this.상품_리스트_컴포넌트.unmount();
    this.로딩_컴포넌트.unmount();
    this.상품목록_하단_섹션.unmount();
    this.카테고리_필터_섹션.unmount();
    this.개수_정렬_필터_섹션.unmount();
    this.상품명_검색_필터.unmount();
  }

  ```

  4. 타입스크립트로 마이그레이션..!
     별거는 아니지만, 3팀최고갓 준형님이 타입스크립트로 짜면 칭찬해준다고 하셔서 적어봤습니다.

### 개선이 필요하다고 생각하는 코드

1. 중간 중간에 리팩토링하면서 설계 자체가 바뀌다보니 일정한 코드 흐름이 되지 않은 부분이 아쉽습니다.
2. 이벤트 등록을 컴포넌트랑 엮어놓으면 더 깔끔한 코드가 되지 않았을까 싶은 아쉬움이 있습니다.
3. 나중에는 시간이 없어서 event callback들을 한파일에 때려넣다보니 가독성이 아쉬운 컴포넌트가 많아서 아쉬웠습니다.

### 학습 효과 분석

1. 리액트 자체의 동작 흐름 및 원리, 필요성 등 확실하게 익힐 수 있었던 것 같습니다.
2. class 문법 this객체 bind 의 사용법 활용법을 익힐 수 있었습니다.

<!-- 예시
- 가장 큰 배움이 있었던 부분
- 추가 학습이 필요한 영역
- 실무 적용 가능성
-->

### 과제 피드백

1. 유닛테스트를 경험한적 없이 문제들이 생기다보니 대처가 어려웠고, 과제와 진행시간만큼 유닛테스트 부딪히는 시간이 너무 길었던 것 같아서 아쉬웠습니다.
2. 기능은 조금 줄이고 더 확실하고 좋은 코드를 짜는 방향이면 더 좋을 것 같습니다!

### AI 활용 경험 공유하기

중간 과정에 리팩토링을 많이 진행하였다보니 수정할 코드 양이 많았는데,
큰틀의 설계와 완성된 하나의 시퀀스만 있으면 Copilot Agent가 기존 코드를 80%는 만족스럽게 짜줘서 빠르게 리팩토링을 진행할 수 있었습니다.

내가 생각한 설계 방향이 일반적인지 검증하거나, 아이디어를 얻는 방식으로 사용하였습니다.

기능 list를 명확하게 같이 나열해서 주면서 리팩토링을 시켰을 때, 더 명확하고 확실하게 수정이 되었습니다.

## 리뷰 받고 싶은 내용

1. 처음 도입부터 일단 MVC 형태의 구조를 가져가고 싶었던 부분이 있어서 MVC 구조로 잘 구성이 되었는가 피드백 받고싶습니다.

Model은 스토어.
View는 컴포넌트, 모델을 구독하여 render
Controller에서는 API를 핸들링하여 스토어에 저장 등 Model을 다루는 곳

다음과 같은 형태로 설계를 진행하였습니다.

시간이 부족해서 나중에는 깊은 생각은 못하고 컴포넌트쪽에 함수를 다 때려넣은 점이 아쉽긴합니다 ㅜ

2. 옵저버 패턴으로 흐름 관계도가 명확하게 구성하려고 노력한 부분을 피드백 받고 싶습니다.
   EX:

- ProductList API 요청 Controller는 SearchParams만을 구독하여 StoreModel을 핸들링
- ProductList가 필요한 컴포넌트에서 ProductList만을 구독하여 render 실행

3. mount unmount를 컴포넌트마다 등록하고 해제하는 보일러 플레이트 코드가 너무 많은데, 어떻게 구성하면 더 깔끔한 코드를 만들 수 있었을지 피드백 받고 싶습니다!

4. 제가 구성해놓은 방식이 정답에 몇퍼센트 가까운 정도일까요?
   SPA 기능을 구현하면서 큰 테마는 세가지였다고 생각합니다.
5. Router
6. 컴포넌트들의 render, state 관리
7. 이벤트 위임방식으로 이벤트 관리
   조금은 모호할 수 있지만, 해당 내용을 구성하면서 얼마나 정답에 가까운 코드로 작성하였을지 피드백 받고 싶습니다.
   물론 정답은 없다는건 알고 있지만, 틀린 코드는 있다고 생각하여 여쭤봅니다!
