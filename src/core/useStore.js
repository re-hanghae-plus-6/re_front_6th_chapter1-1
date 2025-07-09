const useStore = (() => {
  // 장바구니, params 등 전역적으로 쓰일 상태들
  const globalState = {
    filters: {
      category1: "",
      category2: "",
      search: "",
      sort: "price_asc",
    },

    pagination: {
      hasNext: false,
      hasPrev: false,
      limit: 20,
      page: 1,
      total: 0,
      totalPages: 0,
    },
  };

  const listener = [];

  // set으로 중첩 객체에 접근하기 위함 (gpt)
  const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    let current = obj;

    keys.slice(0, -1).forEach((key) => {
      if (!current[key]) current[key] = {};
      current = current[key];
    });

    current[keys[keys.length - 1]] = value;
  };

  // 전역 상태를 가져오는 함수
  const get = (key) => {
    if (!key) {
      return globalState;
    } else {
      return globalState[key];
    }
  };

  // 전역 상태를 만드는 함수
  const set = (key, value) => {
    setNestedValue(globalState, key, value);

    listener.forEach(({ callback, targetKey }) => {
      if (!targetKey || targetKey === key) {
        const keys = key.split(".");
        let updated = globalState;
        keys.forEach((k) => {
          if (updated) updated = updated[k];
        });
        callback(updated, globalState);
      }
    });
  };

  // 전역 상태가 변경됐음을 감지해 주는 함수
  const watch = (callback, targetKey = null) => {
    listener.push({ callback, targetKey });

    return () => {
      const index = listener.findIndex((l) => l.callback === callback && l.targetKey === targetKey);
      if (index !== -1) listener.splice(index, 1);
    };
  };

  return () => ({ get, set, watch });
})();
export default useStore;
