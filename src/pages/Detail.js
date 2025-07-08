// pages/Detail.js

export default function Detail() {
  const $page = document.createElement("div");

  $page.innerHTML = `
        <main class="p-4">
          <h1 class="text-2xl font-bold">상품 상세 페이지</h1>
          <hr class="my-4">
    
          <!-- 뒤로가기 버튼 등 네비게이션 영역 -->
          <div>
            <a href="#/">목록으로</a>
          </div>
    
          <!-- 상품 이미지가 들어갈 곳 -->
          <div id="product-image-container" class="my-4">
            <!-- 예: <img src="..." alt="..."> -->
            <p>이미지 로딩 중...</p>
          </div>
    
          <!-- 상품 정보 (이름, 가격, 설명)가 들어갈 곳 -->
          <div id="product-info-container">
            <h2 id="product-name" class="text-xl">상품 이름</h2>
            <p id="product-price">가격</p>
            <p id="product-description">설명</p>
          </div>
    
          <!-- 수량 조절, 장바구니 버튼 등 인터랙션 영역 -->
          <div id="product-interaction-container" class="my-4">
            <!-- 예: <input type="number">, <button>장바구니</button> -->
          </div>
        </main>
      `;

  // 3. 데이터를 불러와서 화면을 업데이트하는 로직을 여기에 작성합니다.
  //    (예: fetch로 상품 정보를 가져온 뒤, 위의 ...container 내부를 채우기)
  //   const loadProductData = () => {
  //     // const productId = ... // URL에서 상품 ID 파싱
  //     // fetch(`/api/products/${productId}`)
  //     //   .then(res => res.json())
  //     //   .then(product => {
  //     //     $page.querySelector('#product-name').textContent = product.name;
  //     //     // ... 이런 식으로 데이터 채우기
  //     //   });
  //   };

  // 4. 버튼 클릭 등 이벤트 리스너를 설정하는 로직을 여기에 작성합니다.
  //   const addEventListeners = () => {
  //     // const addToCartButton = $page.querySelector('#add-to-cart-btn');
  //     // addToCartButton.addEventListener('click', () => {
  //     //   // 장바구니 추가 로직
  //     // });
  //   };

  // 함수 실행
  // loadProductData();
  // addEventListeners();

  // 5. 완성된 페이지 DOM 요소를 반환합니다.
  return $page;
}
