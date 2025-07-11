export const paramsUtils = {
  updateUrlParams: (newParams) => {
    const url = new URL(window.location);
    const params = new URLSearchParams(url.search);

    // 새로운 파라미터 적용
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // URL 업데이트 (페이지 새로고침 없이)
    const newUrl = `${url.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  },
};
