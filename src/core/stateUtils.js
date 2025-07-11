import productListStore from "./productListStore.js";

export const subscribeToState = (renderFunction, selector = null) => {
  return productListStore.subscribe((newState, prevState) => {
    if (selector) {
      const selectedNewState = selector(newState);
      const selectedPrevState = selector(prevState);

      // 선택된 상태가 변경되었을 때만 렌더링
      if (JSON.stringify(selectedNewState) !== JSON.stringify(selectedPrevState)) {
        renderFunction(selectedNewState);
      }
    } else {
      renderFunction(newState);
    }
  });
};

export const subscribeToStateKey = (key, callback) => {
  return productListStore.subscribe((newState, prevState) => {
    if (newState[key] !== prevState[key]) {
      callback(newState[key], prevState[key]);
    }
  });
};

export const subscribeToStateKeys = (keys, callback) => {
  return productListStore.subscribe((newState, prevState) => {
    const hasChanged = keys.some((key) => newState[key] !== prevState[key]);
    if (hasChanged) {
      const selectedNewState = keys.reduce((acc, key) => {
        acc[key] = newState[key];
        return acc;
      }, {});
      const selectedPrevState = keys.reduce((acc, key) => {
        acc[key] = prevState[key];
        return acc;
      }, {});
      callback(selectedNewState, selectedPrevState);
    }
  });
};

export const safeUpdateState = (updater, onError = null) => {
  try {
    productListStore.setState(updater);
  } catch (error) {
    console.error("상태 업데이트 중 오류:", error);
    if (onError) {
      onError(error);
    }
  }
};

export const debugMiddleware = (prevState, currentState) => {
  if (import.meta.env.DEV) {
    console.log("상태 변경:", {
      prev: prevState,
      current: currentState,
      changes: Object.keys(currentState).filter(
        (key) => JSON.stringify(prevState[key]) !== JSON.stringify(currentState[key]),
      ),
    });
  }
};

export const logMiddleware = (prevState, currentState) => {
  const changes = Object.keys(currentState).filter(
    (key) => JSON.stringify(prevState[key]) !== JSON.stringify(currentState[key]),
  );

  if (changes.length > 0) {
    console.log(`상태 변경됨: ${changes.join(", ")}`);
  }
};

export const urlSyncMiddleware = (prevState, currentState) => {
  // URL 동기화가 필요한 상태들
  const urlKeys = ["page", "limit", "sort", "search", "category1", "category2"];
  const urlChanges = urlKeys.filter((key) => currentState[key] !== prevState[key]);

  if (urlChanges.length > 0) {
    const urlParams = {};
    urlChanges.forEach((key) => {
      if (currentState[key] !== undefined && currentState[key] !== "") {
        urlParams[key] = currentState[key];
      }
    });

    if (Object.keys(urlParams).length > 0) {
      import("../utils/queryStringHandler.js").then(({ updateQueryParams }) => {
        updateQueryParams(urlParams);
      });
    }
  }
};

// 디버그 모드에서 미들웨어 추가
if (import.meta.env.DEV) {
  productListStore.store.use(debugMiddleware);
}

// URL 동기화 미들웨어 추가
productListStore.store.use(urlSyncMiddleware);
