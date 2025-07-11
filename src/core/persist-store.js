/**
 * 영구 저장소 어댑터 인터페이스
 */
class StorageAdapter {
  // eslint-disable-next-line no-unused-vars
  async getItem(_key) {
    throw new Error("getItem method must be implemented");
  }

  // eslint-disable-next-line no-unused-vars
  async setItem(_key, _value) {
    throw new Error("setItem method must be implemented");
  }

  // eslint-disable-next-line no-unused-vars
  async removeItem(_key) {
    throw new Error("removeItem method must be implemented");
  }

  async clear() {
    throw new Error("clear method must be implemented");
  }
}

/**
 * localStorage 어댑터
 */
class LocalStorageAdapter extends StorageAdapter {
  constructor() {
    super();
    this.isAvailable = typeof localStorage !== "undefined";
  }

  async getItem(key) {
    if (!this.isAvailable) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("localStorage getItem 오류:", error);
      return null;
    }
  }

  async setItem(key, value) {
    if (!this.isAvailable) return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("localStorage setItem 오류:", error);
      return false;
    }
  }

  async removeItem(key) {
    if (!this.isAvailable) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("localStorage removeItem 오류:", error);
      return false;
    }
  }

  async clear() {
    if (!this.isAvailable) return false;
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("localStorage clear 오류:", error);
      return false;
    }
  }
}

/**
 * sessionStorage 어댑터
 */
class SessionStorageAdapter extends StorageAdapter {
  constructor() {
    super();
    this.isAvailable = typeof sessionStorage !== "undefined";
  }

  async getItem(key) {
    if (!this.isAvailable) return null;
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("sessionStorage getItem 오류:", error);
      return null;
    }
  }

  async setItem(key, value) {
    if (!this.isAvailable) return false;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("sessionStorage setItem 오류:", error);
      return false;
    }
  }

  async removeItem(key) {
    if (!this.isAvailable) return false;
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("sessionStorage removeItem 오류:", error);
      return false;
    }
  }

  async clear() {
    if (!this.isAvailable) return false;
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error("sessionStorage clear 오류:", error);
      return false;
    }
  }
}

/**
 * IndexedDB 어댑터
 */
class IndexedDBAdapter extends StorageAdapter {
  constructor(dbName = "AppDB", version = 1) {
    super();
    this.dbName = dbName;
    this.version = version;
    this.storeName = "keyValueStore";
    this.isAvailable = typeof indexedDB !== "undefined";
  }

  async _getDB() {
    if (!this.isAvailable) return null;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "key" });
        }
      };
    });
  }

  async getItem(key) {
    if (!this.isAvailable) return null;

    try {
      const db = await this._getDB();
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.value : null);
        };
      });
    } catch (error) {
      console.error("IndexedDB getItem 오류:", error);
      return null;
    }
  }

  async setItem(key, value) {
    if (!this.isAvailable) return false;

    try {
      const db = await this._getDB();
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.put({ key, value });
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(true);
      });
    } catch (error) {
      console.error("IndexedDB setItem 오류:", error);
      return false;
    }
  }

  async removeItem(key) {
    if (!this.isAvailable) return false;

    try {
      const db = await this._getDB();
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(true);
      });
    } catch (error) {
      console.error("IndexedDB removeItem 오류:", error);
      return false;
    }
  }

  async clear() {
    if (!this.isAvailable) return false;

    try {
      const db = await this._getDB();
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(true);
      });
    } catch (error) {
      console.error("IndexedDB clear 오류:", error);
      return false;
    }
  }
}

/**
 * 영구 저장소 설정
 */
const PERSIST_CONFIG = {
  // 저장소 타입
  STORAGE_TYPE: {
    LOCAL: "local",
    SESSION: "session",
    INDEXED_DB: "indexeddb",
  },

  // 기본 설정
  DEFAULT_OPTIONS: {
    storageType: "local",
    storageKey: "persist-store",
    whitelist: [], // 저장할 키들 (빈 배열이면 모든 키 저장)
    blacklist: [], // 저장하지 않을 키들
    transforms: [], // 데이터 변환 함수들
    debounceTime: 0, // 저장 디바운스 시간 (ms)
    version: 1, // 스키마 버전
  },
};

/**
 * 영구 저장소 클래스
 */
class PersistStore {
  constructor(store, options = {}) {
    this.store = store;
    this.options = { ...PERSIST_CONFIG.DEFAULT_OPTIONS, ...options };
    this.storage = this._createStorageAdapter();
    this.saveTimeout = null;
    this.isInitialized = false;

    // 저장소 초기화 및 상태 복원
    this.initialize();
  }

  /**
   * 저장소 어댑터 생성
   */
  _createStorageAdapter() {
    switch (this.options.storageType) {
      case PERSIST_CONFIG.STORAGE_TYPE.LOCAL:
        return new LocalStorageAdapter();
      case PERSIST_CONFIG.STORAGE_TYPE.SESSION:
        return new SessionStorageAdapter();
      case PERSIST_CONFIG.STORAGE_TYPE.INDEXED_DB:
        return new IndexedDBAdapter();
      default:
        console.warn("지원하지 않는 저장소 타입:", this.options.storageType);
        return new LocalStorageAdapter();
    }
  }

  /**
   * 초기화 및 상태 복원
   */
  async initialize() {
    try {
      await this.restore();
      this.setupPersistMiddleware();
      this.isInitialized = true;
    } catch (error) {
      console.error("PersistStore 초기화 오류:", error);
    }
  }

  /**
   * 저장된 상태 복원
   */
  async restore() {
    try {
      const persistedData = await this.storage.getItem(this.options.storageKey);

      if (persistedData && persistedData.version === this.options.version) {
        const { state } = persistedData;

        // 화이트리스트/블랙리스트 필터링
        const filteredState = this._filterStateForRestore(state);

        // 변환 함수 적용
        const transformedState = this._applyTransforms(filteredState, "restore");

        // 상태 복원
        this.store.setStates(transformedState, "RESTORE_STATE");

        console.log("[PersistStore] 상태 복원 완료:", Object.keys(transformedState));
      }
    } catch (error) {
      console.error("상태 복원 오류:", error);
    }
  }

  /**
   * 현재 상태 저장
   */
  async save() {
    if (!this.isInitialized) return;

    try {
      const currentState = this.store.getState();
      const filteredState = this._filterStateForSave(currentState);
      const transformedState = this._applyTransforms(filteredState, "save");

      const dataToSave = {
        state: transformedState,
        timestamp: Date.now(),
        version: this.options.version,
      };

      await this.storage.setItem(this.options.storageKey, dataToSave);

      console.log("[PersistStore] 상태 저장 완료:", Object.keys(transformedState));
    } catch (error) {
      console.error("상태 저장 오류:", error);
    }
  }

  /**
   * 디바운스된 저장
   */
  debouncedSave() {
    if (this.options.debounceTime > 0) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => {
        this.save();
      }, this.options.debounceTime);
    } else {
      this.save();
    }
  }

  /**
   * 영구 저장 미들웨어 설정
   */
  setupPersistMiddleware() {
    const persistMiddleware = (phase, context) => {
      if (phase === "AFTER_SET" || phase === "AFTER_BATCH_SET") {
        // 복원 액션은 다시 저장하지 않음
        if (context.action !== "RESTORE_STATE") {
          this.debouncedSave();
        }
      }
    };

    this.store.addMiddleware(persistMiddleware);
  }

  /**
   * 저장용 상태 필터링
   */
  _filterStateForSave(state) {
    const { whitelist, blacklist } = this.options;
    let filteredState = { ...state };

    // 화이트리스트가 있으면 해당 키만 저장
    if (whitelist.length > 0) {
      filteredState = {};
      whitelist.forEach((key) => {
        if (Object.hasOwn(state, key)) {
          filteredState[key] = state[key];
        }
      });
    }

    // 블랙리스트 키 제거
    if (blacklist.length > 0) {
      blacklist.forEach((key) => {
        delete filteredState[key];
      });
    }

    return filteredState;
  }

  /**
   * 복원용 상태 필터링
   */
  _filterStateForRestore(state) {
    // 저장과 동일한 로직 적용
    return this._filterStateForSave(state);
  }

  /**
   * 변환 함수 적용
   */
  _applyTransforms(state, direction) {
    return this.options.transforms.reduce((transformedState, transform) => {
      try {
        if (direction === "save" && transform.out) {
          return transform.out(transformedState);
        } else if (direction === "restore" && transform.in) {
          return transform.in(transformedState);
        }
        return transformedState;
      } catch (error) {
        console.error("변환 함수 적용 오류:", error);
        return transformedState;
      }
    }, state);
  }

  /**
   * 저장된 데이터 삭제
   */
  async clear() {
    try {
      await this.storage.removeItem(this.options.storageKey);
      console.log("[PersistStore] 저장된 데이터 삭제 완료");
    } catch (error) {
      console.error("저장된 데이터 삭제 오류:", error);
    }
  }

  /**
   * 저장소 전체 초기화
   */
  async clearAll() {
    try {
      await this.storage.clear();
      console.log("[PersistStore] 저장소 전체 초기화 완료");
    } catch (error) {
      console.error("저장소 전체 초기화 오류:", error);
    }
  }
}

/**
 * 영구 저장소 생성 헬퍼 함수
 */
const createPersistStore = (store, options = {}) => {
  return new PersistStore(store, options);
};

export {
  PersistStore,
  LocalStorageAdapter,
  SessionStorageAdapter,
  IndexedDBAdapter,
  PERSIST_CONFIG,
  createPersistStore,
};
export default createPersistStore;
