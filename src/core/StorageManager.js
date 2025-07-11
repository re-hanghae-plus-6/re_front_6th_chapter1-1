const STORAGE_TYPES = Object.freeze({
  LOCAL_STORAGE: "localStorage",
  SESSION_STORAGE: "sessionStorage",
});

export class StorageManager {
  static TYPES = STORAGE_TYPES;

  constructor(storageType = StorageManager.TYPES.LOCAL_STORAGE) {
    this.storage = storageType === StorageManager.TYPES.SESSION_STORAGE ? sessionStorage : localStorage;
    this.prefix = "";
  }

  /**
   * 저장소 크기 조회
   *
   * @returns {number} 저장된 항목 수
   */
  get size() {
    return this.keys().length;
  }

  /**
   * 저장소가 비어있는지 확인
   *
   * @returns {boolean} 비어있는지 여부
   */
  get isEmpty() {
    return this.size() === 0;
  }

  /**
   * 키 접두사 설정
   *
   * @param {string} prefix - 키 접두사
   */
  setPrefix(prefix) {
    this.prefix = prefix;
  }

  /**
   * 데이터 조회
   *
   * @param {string} key - 키
   * @returns {*} 저장된 값
   */
  get(key) {
    try {
      const item = this.storage.getItem(this.#getKey(key));
      if (!item) {
        return null;
      }

      return JSON.parse(item).value;
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  }

  /**
   * 데이터 저장
   *
   * @param {string} key - 키
   * @param {*} value - 저장할 값
   * @returns {boolean} 성공 여부
   */
  set(key, value) {
    try {
      const data = {
        value,
        timestamp: Date.now(),
      };

      this.storage.setItem(this.#getKey(key), JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Storage set error:", error);
      return false;
    }
  }

  /**
   * 배열에 항목 추가 (기존 데이터 유지)
   *
   * @param {string} key - 키
   * @param {*} item - 추가할 항목
   * @returns {boolean} 성공 여부
   */
  push(key, item) {
    try {
      const existingData = this.get(key);
      let items = [];

      if (existingData !== null) {
        if (Array.isArray(existingData)) {
          items = existingData;
        } else {
          console.warn(`Key '${key}' exists but is not an array. Converting to array.`);
          items = [existingData];
        }
      }

      items.push(item);
      return this.set(key, items);
    } catch (error) {
      console.error("Storage push error:", error);
      return false;
    }
  }

  /**
   * 배열에 여러 항목 추가 (기존 데이터 유지)
   *
   * @param {string} key - 키
   * @param {Array} items - 추가할 항목들
   * @returns {boolean} 성공 여부
   */
  pushAll(key, items) {
    try {
      if (!Array.isArray(items)) {
        console.error("Items must be an array");
        return false;
      }

      const existingData = this.get(key);
      let currentItems = [];

      if (existingData !== null) {
        if (Array.isArray(existingData)) {
          currentItems = existingData;
        } else {
          console.warn(`Key '${key}' exists but is not an array. Converting to array.`);
          currentItems = [existingData];
        }
      }

      currentItems.push(...items);
      return this.set(key, currentItems);
    } catch (error) {
      console.error("Storage pushAll error:", error);
      return false;
    }
  }

  /**
   * 배열에서 항목 제거 (조건 함수 사용)
   *
   * @param {string} key - 키
   * @param {Function} predicate - 제거 조건 함수
   * @returns {boolean} 성공 여부
   */
  removeFromArray(key, predicate) {
    try {
      const existingData = this.get(key);

      if (existingData === null || !Array.isArray(existingData)) {
        console.warn(`Key '${key}' does not exist or is not an array.`);
        return false;
      }

      const filteredItems = existingData.filter((item) => !predicate(item));
      return this.set(key, filteredItems);
    } catch (error) {
      console.error("Storage removeFromArray error:", error);
      return false;
    }
  }

  /**
   * 배열에서 ID로 항목 제거
   *
   * @param {string} key - 키
   * @param {string|number} id - 제거할 항목의 ID
   * @returns {boolean} 성공 여부
   */
  removeById(key, id) {
    return this.removeFromArray(key, (item) => item.id === id);
  }

  /**
   * 배열에서 특정 항목 업데이트
   *
   * @param {string} key - 키
   * @param {Function} predicate - 업데이트할 항목 찾기 함수
   * @param {Function|Object} updater - 업데이트 함수 또는 객체
   * @returns {boolean} 성공 여부
   */
  updateInArray(key, predicate, updater) {
    try {
      const existingData = this.get(key);

      if (existingData === null || !Array.isArray(existingData)) {
        console.warn(`Key '${key}' does not exist or is not an array.`);
        return false;
      }

      const updatedItems = existingData.map((item) => {
        if (predicate(item)) {
          return typeof updater === "function" ? updater(item) : { ...item, ...updater };
        }
        return item;
      });

      return this.set(key, updatedItems);
    } catch (error) {
      console.error("Storage updateInArray error:", error);
      return false;
    }
  }

  /**
   * 배열에서 ID로 항목 업데이트
   *
   * @param {string} key - 키
   * @param {string|number} id - 업데이트할 항목의 ID
   * @param {Function|Object} updater - 업데이트 함수 또는 객체
   * @returns {boolean} 성공 여부
   */
  updateById(key, id, updater) {
    return this.updateInArray(key, (item) => item.id === id, updater);
  }

  /**
   * 데이터 존재 여부 확인
   *
   * @param {string} key - 키
   * @returns {boolean} 존재 여부
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * 데이터 삭제
   *
   * @param {string} key - 키
   * @returns {boolean} 성공 여부
   */
  remove(key) {
    try {
      this.storage.removeItem(this.#getKey(key));
      return true;
    } catch (error) {
      console.error("Storage remove error:", error);
      return false;
    }
  }

  /**
   * 모든 데이터 삭제 (접두사 기준)
   *
   * @returns {number} 삭제된 항목 수
   */
  clear() {
    try {
      let removedCount = 0;
      const keys = Object.keys(this.storage);

      for (const key of keys) {
        if (this.prefix) {
          if (key.startsWith(`${this.prefix}:`)) {
            this.storage.removeItem(key);
            removedCount++;
          }
        } else {
          this.storage.removeItem(key);
          removedCount++;
        }
      }

      return removedCount;
    } catch (error) {
      console.error("Storage clear error:", error);
      return 0;
    }
  }

  /**
   * 모든 키 목록 조회
   *
   * @returns {string[]} 키 목록
   */
  keys() {
    try {
      const keys = Object.keys(this.storage);

      return this.prefix
        ? keys.filter((key) => key.startsWith(`${this.prefix}:`)).map((key) => key.replace(`${this.prefix}:`, ""))
        : keys;
    } catch (error) {
      console.error("Storage keys error:", error);
      return [];
    }
  }

  /**
   * 스토리지 정보 조회
   *
   * @returns {object} 스토리지 정보
   */
  info() {
    return {
      type: this.storage === localStorage ? "localStorage" : "sessionStorage",
      prefix: this.prefix,
      size: this.size,
      isEmpty: this.isEmpty,
      keys: this.keys(),
    };
  }

  /**
   * 실제 키 생성 (접두사 포함)
   *
   * @param {string} key - 원본 키
   * @returns {string} 접두사가 포함된 키
   */
  #getKey(key) {
    return this.prefix ? `${this.prefix}:${key}` : key;
  }
}
