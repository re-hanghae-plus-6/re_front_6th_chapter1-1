class Footer {
  constructor() {}

  /**
   * 컴포넌트가 언마운트될 때 정리 작업을 수행합니다.
   * Footer는 특별한 정리 작업이 없으므로 빈 메서드로 구현합니다.
   */
  unmounted() {
    // Footer는 특별한 정리 작업이 필요 없음
  }

  render() {
    return /*html*/ `
      <footer class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
      </footer>
    `;
  }
}

export default Footer;
