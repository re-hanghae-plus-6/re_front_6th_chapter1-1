/**
 * React Router에서 영감을 받은 간단한 중첩 라우터 구현체입니다.
 *
 * 이 라우터는 경로 문자열을 트리 형태의 라우트 설정으로 해석합니다.
 * 각 라우트는 레이아웃, 컴포넌트, 하위 라우트를 정의할 수 있으며
 * `:`로 시작하는 동적 세그먼트는 파라미터로 캡처되어
 * 매칭된 컴포넌트로 전달됩니다.
 */

/**
 * 경로 앞뒤의 슬래시를 제거하고, 비어 있지 않은 세그먼트 배열로
 * 변환합니다.
 *
 * @param {string} path - 원본 경로 문자열(예: "/detail/42").
 * @returns {string[]} 분리된 경로 세그먼트 배열.
 */
function splitPath(path) {
  return path
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean);
}

/**
 * 해당 세그먼트가 동적 파라미터인지 여부를 확인합니다.
 *
 * 동적 세그먼트는 ":id"와 같이 콜론으로 시작합니다.
 *
 * @param {string} segment - 라우트 정의의 세그먼트 문자열.
 * @returns {boolean} 동적 세그먼트 여부.
 */
function isDynamic(segment) {
  return segment && segment[0] === ':';
}

/**
 * 현재 경로 세그먼트를 라우트 트리에 재귀적으로 매칭합니다.
 *
 * 매칭에 성공하면 모든 레이아웃이 적용된 컴포넌트 트리를
 * 렌더하는 함수를 반환합니다. 매칭되는 라우트가 없으면 `null`을
 * 반환합니다.
 *
 * @param {string[]} pathSegments - 현재 위치의 경로 세그먼트.
 * @param {Array} routes - 라우트 정의 배열.
 * @param {Object} [params={}] - 누적된 동적 파라미터.
 * @returns {(function(Object=): string)|null} 매칭된 라우트를 렌더하는 함수.
 */
function matchRoute(pathSegments, routes, params = {}) {
  for (const route of routes) {
    const routeSegments = route.path.split('/').filter(Boolean);

    // routeSegments의 길이가 더 길면 매칭 X
    // pathSegments의 길이가 더 길면 매칭 시도
    if (routeSegments.length > pathSegments.length) {
      continue;
    }

    let matched = true;
    // 기존에 누적된 파라미터를 복사 (동적 파라미터 누적)
    const paramMap = { ...params };

    // route.path의 각 세그먼트와 실제 경로(pathSegments)를 비교
    for (let i = 0; i < routeSegments.length; ++i) {
      // 현재 라우트 세그먼트
      const seg = routeSegments[i];

      // 동적 세그먼트(예: ':id')라면
      if (isDynamic(seg)) {
        // 콜론(:)을 제외한 파라미터 이름 추출 (예: 'id')
        const paramName = seg.slice(1);
        // paramMap에 파라미터 값 저장 (예: { id: '123' })
        paramMap[paramName] = pathSegments[i];
      }
      // 일반 세그먼트일 때 값이 다르면 매칭 실패
      else if (seg !== pathSegments[i]) {
        matched = false;
        break;
      }
    }

    // 하나라도 불일치라면, 이 route는 패스하고 다음 route로 넘어감
    if (!matched) continue;

    // restSegments가 빈 배열이면 더 이상 검사할 하위 경로가 없다는 뜻(이 route가 최정 매칭 route임)
    // restSegments가 남아 있으면 하위 라우트에서 계속 매칭 시도
    const restSegments = pathSegments.slice(routeSegments.length);

    // 1. 끝까지 다 온 경우
    if (restSegments.length === 0 && route.component) {
      if (route.layout) {
        return (props = {}) =>
          route.layout({
            ...props,
            children: route.component({ ...props, ...paramMap }),
          });
      }
      return (props = {}) => route.component({ ...props, ...paramMap });
    }

    // 2. children이 있고, 경로 세그먼트가 모두 소진된 경우
    // 이 경우는 현재 라우트가 컴포넌트는 없고 레이아웃 역할만 할 때 (react router에 Outlet 패턴)
    // children 중 path: ''로 정의된 "index route"가 있으면 그걸 실제 컴포넌트로 사용
    if (route.children && restSegments.length === 0) {
      const indexChild = route.children.find((child) => child.path === '');
      if (indexChild) {
        if (route.layout) {
          return (props = {}) =>
            route.layout({
              ...props,
              children: indexChild.component({ ...props, ...paramMap }),
            });
        }
        return (props = {}) => indexChild.component({ ...props, ...paramMap });
      }
    }

    // 3. children이 있고, 아직 매칭되지 않은 경로 세그먼트(restSegments)가 남아 있다면
    if (route.children && restSegments.length > 0) {
      // 남은 경로(restSegments)와 현재 route의 children을 이용해 matchRoute를 재귀 호출
      const childMatch = matchRoute(restSegments, route.children, paramMap);
      if (childMatch) {
        if (route.layout) {
          // 현재 route에 layout이 있다면, 자식 결과(childMatch)를 children으로 감싸서 반환 (react router에 Outlet 패턴)
          return (props = {}) => route.layout({ ...props, children: childMatch(props) });
        }
        // layout이 없으면, 자식에서 매칭된 결과 그대로 반환
        return childMatch;
      }
    }
  }

  // 하위에서 매칭이 실패하면 null 반환 -> 404 로 이어짐
  return null;
}

/**
 * 라우터를 초기화하고 전역 네비게이션 핸들러를 등록합니다.
 *
 * @param {Array} routes - 라우트 설정 트리.
 * @returns {{ renderRoute: (path: string) => void }} 주어진 경로를 렌더하는 헬퍼.
 */
export function createRouter(routes) {
  /**
   * 주어진 경로에 해당하는 컴포넌트 트리를 렌더합니다.
   *
   * @param {string} path - 브라우저의 경로.
   */
  const renderRoute = (path) => {
    const pathSegments = splitPath(path);
    const match = matchRoute(pathSegments, routes);
    const root = document.getElementById('root');
    if (match) {
      root.innerHTML = match();
    } else {
      root.innerHTML = routes.find((r) => r.path === '404').component();
    }
  };

  /**
   * `data-link` 속성이 있는 앵커 클릭을 가로채
   * 페이지 새로고침 없이 클라이언트 사이드 네비게이션을 수행합니다.
   */
  const handleLink = (e) => {
    const link = e.target.closest('a[data-link]');
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');
      window.history.pushState({}, '', href);
      renderRoute(window.location.pathname);
    }
  };

  // 브라우저 뒤로/앞으로 가기 시 view 갱신
  window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname);
  });

  // 링크 클릭 시 이벤트를 가로채서 네비게이션 처리
  document.body.addEventListener('click', handleLink);

  // 최초 진입 시 경로에 맞는 화면 렌더링
  renderRoute(window.location.pathname);

  return { renderRoute };
}
