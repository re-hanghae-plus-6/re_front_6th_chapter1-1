export default {
  render() {
    return `
      <section>
        <h1>홈 페이지</h1>
        <p>반가워요! 여기는 Home입니다 :)</p>
        <button id="goAbout">About 페이지로 이동</button>
      </section>
    `;
  },

  afterRender() {
    const btn = document.getElementById("goAbout");
    if (btn) {
      btn.addEventListener("click", () => {
        location.hash = "#/about"; // 해시 라우팅
      });
    }
  },
};
