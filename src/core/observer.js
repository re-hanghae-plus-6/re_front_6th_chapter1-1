let currentObserver = null;
const observerToObservableMap = new Map();

const debounceFrame = (callback) => {
  let currentCallback = -1;
  const debounced = () => {
    // 예약된 함수가 있다면 취소
    cancelAnimationFrame(currentCallback);
    // 다음 프레임에 실행
    currentCallback = requestAnimationFrame(callback);
  };
  debounced.cancel = () => cancelAnimationFrame(currentCallback);
  return debounced;
};

export const observe = (fn) => {
  currentObserver = debounceFrame(fn);
  try {
    fn();
  } finally {
    // 실행을 보장
    currentObserver = null;
  }

  return () => {
    const records = observerToObservableMap.get(currentObserver);

    if (records) {
      // currentObserver가 관찰하는 모든 observable 인스턴스에서 해당 옵저버를 제거
      for (const [observable, name] of records) {
        if (observable?._observerMaps?.[name]) {
          observable._observerMaps[name].delete(currentObserver);
          if (observable._observerMaps[name].size === 0) {
            delete observable._observerMaps[name];
          }
        }
      }

      observerToObservableMap.delete(currentObserver);
    }

    currentObserver.cancel();
  };
};

/**
 * 얕은 비교를 통해 값 변경을 감지하고 관찰하는 함수를 호출합니다.
 */
export const observable = (obj) => {
  const observerMap = {};

  const proxy = new Proxy(obj, {
    get(target, name) {
      observerMap[name] = observerMap[name] || new Set();

      if (currentObserver) {
        // 키에 해당하는 값 변경시 호출할 함수 저장
        observerMap[name].add(currentObserver);

        // 메모리 최적화를 위해 currentObserver 인스턴스에 역참조 정보 저장
        let records = observerToObservableMap.get(currentObserver);
        if (!records) {
          records = new Set();
          observerToObservableMap.set(currentObserver, records);
        }
        // [observable 인스턴스, 속성 이름] 저장
        records.add([proxy, name]);
      }
      return target[name];
    },
    set(target, name, value) {
      const prev = target[name];
      const next = value;

      if (prev === next) {
        return true;
      }

      target[name] = value;

      // 변경된 값을 관찰하는 함수 호출
      observerMap[name]?.forEach((fn) => {
        console.log(fn);
        fn();
      });
      return true;
    },
  });

  proxy._observerMaps = observerMap;

  return proxy;
};
