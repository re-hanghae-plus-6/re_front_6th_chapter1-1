class LocalStorageUtil {
  // 로컬스토리지에 데이터 저장
  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("로컬스토리지에 데이터를 저장하는 중 오류 발생:", error);
    }
  }

  // 로컬스토리지에서 데이터 가져오기
  getItem(key) {
    try {
      const serializedValue = localStorage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
      console.error("로컬스토리지에서 데이터를 가져오는 중 오류 발생:", error);
      return null;
    }
  }

  // 로컬스토리지에서 데이터 삭제
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("로컬스토리지에서 데이터를 삭제하는 중 오류 발생:", error);
    }
  }

  // 로컬스토리지 초기화
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("로컬스토리지를 초기화하는 중 오류 발생:", error);
    }
  }
}

export default new LocalStorageUtil();
