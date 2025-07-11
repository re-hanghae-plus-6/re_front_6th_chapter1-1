// import { Header } from "../components/Header.js";
// import { Footer } from "../components/Footer.js";

// import { SearchFilter } from "../components/SearchFilter.js";
// import { createElementByString } from "../utils/createViewcomponent.js";
import navigateTo from "../utils/urlUtils.js";

export function ListPage() {
  // const el = createElementByString(`
  //   <div class="bg-gray-50 min-h-screen">
  //     ${Header()}
  //     <main class="max-w-md mx-auto px-4 py-4">
  //       ${SearchFilter()}
  //       <button id="gotodetail">상품상세로</button>
  //     </main>
  //     ${Footer()}
  //   </div>
  // `);
  const button = document.createElement("button");
  button.textContent = "상품 상세로";
  button.onclick = () => {
    navigateTo("product/123");
  };

  // button.addEventListener("click", window.alert("!!"));

  return button;
}
