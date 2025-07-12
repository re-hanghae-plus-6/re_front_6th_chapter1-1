(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e){if(t.type!==`childList`)continue;for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();const e=`modulepreload`,t=function(e){return`/front_6th_chapter1-1/`+e},n={},r=function(r,i,a){let o=Promise.resolve();if(i&&i.length>0){let r=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}o=l(i.map(i=>{if(i=t(i,a),i in n)return;n[i]=!0;let o=i.endsWith(`.css`),s=o?`[rel="stylesheet"]`:``,l=!!a;if(l)for(let e=r.length-1;e>=0;e--){let t=r[e];if(t.href===i&&(!o||t.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${i}"]${s}`))return;let u=document.createElement(`link`);if(u.rel=o?`stylesheet`:e,o||(u.as=`script`),u.crossOrigin=``,u.href=i,c&&u.setAttribute(`nonce`,c),document.head.appendChild(u),o)return new Promise((e,t)=>{u.addEventListener(`load`,e),u.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${i}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(e=>{for(let t of e||[]){if(t.status!==`rejected`)continue;s(t.reason)}return r().catch(s)})};async function i(e={}){let{limit:t=20,search:n=``,category1:r=``,category2:i=``,sort:a=`price_asc`}=e,o=e.current??e.page??1,s=new URLSearchParams({page:o.toString(),limit:t.toString(),...n&&{search:n},...r&&{category1:r},...i&&{category2:i},sort:a}),c=await fetch(`/api/products?${s}`);return await c.json()}async function a(e){let t=await fetch(`/api/products/${e}`);return await t.json()}async function o(){let e=await fetch(`/api/categories`);return await e.json()}const s=e=>`<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse" key="${e}">
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-3">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>`,c=(e=4)=>Array.from({length:e},(e,t)=>s(t)).join(``),l=e=>`
    <div class="bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-900">
              <a href="/" data-link="">쇼핑몰</a>
            </h1>
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
                ${e.cart.length>0?`<span
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">${e.cart.length}</span>`:``}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          <div class="mb-4">
            <div class="relative">
              <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <!-- 필터 옵션 -->
          <div class="space-y-3">
            <!-- 카테고리 필터 -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">카테고리:</label>
                <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
                ${e.filters.category1?`<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" data-category1="${e.filters.category1}" class="text-xs hover:text-blue-800 hover:underline">${e.filters.category1}</button>`:``}
                ${e.filters.category2?`<span class="text-xs text-gray-500">&gt;</span><span class="text-xs text-gray-600 cursor-default">${e.filters.category2}</span>`:``}
              </div>
              <!-- 1depth 카테고리 -->
              <div class="flex flex-wrap gap-2">
              ${e.loading?`<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`:``}
                ${!e.loading&&e.categories&&e.filters.category1===``?Object.keys(e.categories).map(e=>`
                    <button data-category1="${e}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                       bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                      ${e}
                    </button>
                  `).join(``):``}  
                 ${!e.loading&&e.categories&&e.filters.category1!==``?Object.keys(e.categories[e.filters.category1]).map(t=>`
                            <button data-category1="${e.filters.category1}" data-category2="${t}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                              ${t}
                            </button>`).join(``):``} 
              </div>
              <!-- 2depth 카테고리 -->
            </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select id="limit-select"
                        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="10">
                    10개
                  </option>
                  <option value="20" selected="">
                    20개
                  </option>
                  <option value="50">
                    50개
                  </option>
                  <option value="100">
                    100개
                  </option>
                </select>
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="price_asc" selected="">가격 낮은순</option>
                  <option value="price_desc">가격 높은순</option>
                  <option value="name_asc">이름순</option>
                  <option value="name_desc">이름 역순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- 상품 목록 -->
        <div class="mb-6">
          <!-- 상품 개수 정보 -->
          ${e.loading?``:`<div class="mb-4 text-sm text-gray-600">
                  총 <span class="font-medium text-gray-900">${e.pagination.total}개</span>의 상품
                </div>`}
          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
          ${e.loading?c(4):e.products.map(e=>`
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
                data-product-id=${e.productId}>
                <!-- 상품 이미지 -->
                <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
                  <img src="${e.image}"
                        alt="${e.title}"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        loading="lazy">
                </div>
                <!-- 상품 정보 -->
                <div class="p-3">
                  <div class="cursor-pointer product-info mb-3">
                    <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      ${e.title}
                    </h3>
                    ${e.brand?`<p class="text-xs text-gray-500 mb-2">${e.brand}</p>`:``}
                    <p class="text-lg font-bold text-gray-900">
                      ${Number(e.lprice).toLocaleString()}원
                    </p>
                  </div>
                  <!-- 장바구니 버튼 -->
                  <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                          hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id=${e.productId}>
                    장바구니 담기
                  </button>
                </div>
              </div>
              `).join(``)}
          </div>
          ${e.productInfiniteLoading?` <div class="text-center py-4">
            <div class="inline-flex items-center">
              <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
            </div>
          </div>`:``}
          ${e.pagination.hasNext?`<div id="infinity-sentinel" style="height: 1px;"></div>`:`<div class="text-center py-4 text-sm text-gray-500">
              모든 상품을 확인했습니다
            </div>`}
        </div>
      </main>
      <footer class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
      </footer>
    </div>
    `,u=e=>{let t=document.getElementById(`toast-message`);t&&t.remove();let n=document.createElement(`div`);n.id=`toast-message`,n.className=`fixed bottom-4 right-12 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`,n.textContent=e,document.body.appendChild(n),setTimeout(()=>{n.classList.remove(`translate-x-full`)},100),setTimeout(()=>{n.classList.add(`translate-x-full`),setTimeout(()=>{n.remove()},300)},3e3)},d=({state:e,openCartModal:t,addToCart:n,setState:r,navigateTo:a})=>{let s={},c=async()=>{m();let e=await o();r({categories:e}),await p(),r({loading:!1})},f=()=>{let t=document.getElementById(`root`);t.innerHTML=l(e),E()},p=async(t={})=>{let n={...e.filters,...t,page:t.page||e.pagination.page,limit:t.limit||e.pagination.limit},a=await i(n);r({products:a.products,filters:a.filters,pagination:a.pagination})},m=()=>{window.removeEventListener(`scroll`,g),window.addEventListener(`scroll`,g)},h=()=>{window.removeEventListener(`scroll`,g)},g=()=>{let{scrollTop:t,scrollHeight:n,clientHeight:i}=document.documentElement;t+i>=n-100&&e.pagination.hasNext&&!e.productInfiniteLoading&&(r({productInfiniteLoading:!0}),_({page:e.pagination.page+1,limit:e.pagination.limit}))},_=async(t={})=>{f(d(e));let n={...e.filters,...t,page:t.page||e.pagination.page},a=await i(n);r({products:[...e.products,...a.products],pagination:a.pagination}),r({productInfiniteLoading:!1})},v=e=>{a(`/product/${e}`)},y=t=>{p({limit:t,page:1});let n=new URLSearchParams(Object.entries({...e.filters,limit:t,sort:e.filters.sort,search:e.filters.search,category1:e.filters.category1,category2:e.filters.category2}).filter(([e,t])=>t!=null&&t!==``));a(`/?${n.toString()}`)},b=t=>{p({search:t,page:1});let n=new URLSearchParams(Object.entries({...e.filters,search:t,sort:e.filters.sort,limit:e.filters.limit,category1:e.filters.category1,category2:e.filters.category2}).filter(([e,t])=>t!=null&&t!==``));a(`/?${n.toString()}`)},x=t=>{p({sort:t,page:1});let n=new URLSearchParams(Object.entries({...e.filters,sort:t,search:e.filters.search,limit:e.filters.limit,category1:e.filters.category1,category2:e.filters.category2}).filter(([e,t])=>t!=null&&t!==``));a(`/?${n.toString()}`)},S=t=>{p({category1:t,page:1});let n=new URLSearchParams(Object.entries({...e.filters,category1:t,sort:e.filters.sort,search:e.filters.search,limit:e.filters.limit,category2:e.filters.category2}).filter(([e,t])=>t!=null&&t!==``));a(`/?${n.toString()}`)},C=t=>{p({category2:t,page:1});let n=new URLSearchParams(Object.entries({...e.filters,category2:t,sort:e.filters.sort,search:e.filters.search,limit:e.filters.limit,category1:e.filters.category1}).filter(([e,t])=>t!=null&&t!==``));a(`/?${n.toString()}`)},w=()=>{p({category1:``,category2:``,page:1});let t=new URLSearchParams(Object.entries({...e.filters,category1:``,category2:``,sort:e.filters.sort,search:e.filters.search,limit:e.filters.limit}).filter(([e,t])=>t!=null&&t!==``));a(`/?${t.toString()}`)},T=()=>{p({category2:``,page:1});let t=new URLSearchParams(Object.entries({...e.filters,category2:``,sort:e.filters.sort,search:e.filters.search,limit:e.filters.limit,category1:e.filters.category1}).filter(([e,t])=>t!=null&&t!==``));a(`/?${t.toString()}`)},E=()=>{let i=document.getElementById(`search-input`);i&&(i.value=e.filters.search||``,i.onkeydown=e=>{e.key===`Enter`&&b(e.target.value)});let a=document.getElementById(`limit-select`);a&&(a.value=e.pagination.limit||20,a.onchange=t=>{r({pagination:{...e.pagination,limit:Number(t.target.value)}}),y(Number(t.target.value))});let o=document.getElementById(`sort-select`);o&&(o.value=e.filters.sort||`price_asc`,o.onchange=t=>{r({filters:{...e.filters,sort:t.target.value}}),x(t.target.value)});let s=document.querySelectorAll(`.category1-filter-btn`);s.forEach(e=>{e.onclick=e=>{let t=e.target.getAttribute(`data-category1`);S(t)}});let c=document.querySelectorAll(`.category2-filter-btn`);c.forEach(e=>{e.onclick=e=>{let t=e.target.getAttribute(`data-category2`);C(t)}});let l=document.querySelectorAll(`[data-breadcrumb]`);l.forEach(t=>{t.onclick=t=>{let n=t.target.getAttribute(`data-breadcrumb`);n===`reset`?(r({filters:{...e.filters,category1:``,category2:``}}),w()):n===`category1`&&(r({filters:{...e.filters,category2:``}}),T())}});let d=document.getElementById(`cart-icon-btn`);d&&(d.onclick=()=>{t()});let f=document.querySelectorAll(`.add-to-cart-btn`);f.forEach(t=>{t.onclick=t=>{t.stopPropagation();let r=t.target.getAttribute(`data-product-id`),i=e.products.find(e=>e.productId===r);i&&(n({product:i}),u(`장바구니에 추가되었습니다`))}});let p=document.querySelectorAll(`.product-card`);p.forEach(e=>{e.onclick=e=>{let t=e.target.closest(`.product-card`).getAttribute(`data-product-id`);v(t)}})};return s.createPage=c,s.render=f,s.cleanupScrollInfinity=h,s};var f=d;const p=e=>`
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
          </div>
          <div class="flex items-center space-x-2">
            <!-- 장바구니 아이콘 -->
            <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
              </svg>
                 <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              ${e.cart.length}
            </span>
            </button>
          </div>
        </div>
      </div>
    </header>
    <main class="max-w-md mx-auto px-4 py-4">
    <!-- 브레드크럼 -->
    <nav class="mb-4">
      <div class="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
       ${e.product?`<button class="breadcrumb-link" data-category1="${e.product.category1}">
          ${e.product.category1}
        </button>`:``}
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        ${e.product?`<button class="breadcrumb-link" data-category2="${e.product.category2}">
          ${e.product.category2}
        </button>`:``}
      </div>
    </nav>
     ${e.loading?`<div class="py-20 bg-gray-50 flex items-center justify-center">
           <div class="text-center">
             <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
             <p class="text-gray-600">상품 정보를 불러오는 중...</p>
           </div>
         </div>`:``}
     ${!e.loading&&e.product?`
        <!-- 상품 상세 정보 -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
           <!-- 상품 이미지 -->
        <div class="p-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img src="${e.product.image}" alt="${e.product.title}" class="w-full h-full object-cover product-detail-image">
            </div>
            <!-- 상품 정보 -->
            <div class="p-4">
                <p class="text-sm text-gray-600 mb-1"></p>
                <h1 class="text-xl font-bold text-gray-900 mb-3">${e.product.title}</h1>
                 <!-- 평점 및 리뷰 -->
                <div class="flex items-center mb-3">
                    <div class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    </div>
                    <span class="ml-2 text-sm text-gray-600">${e.product.rating} (${e.product.reviewCount}개 리뷰)</span>
                </div>
                <!-- 가격 -->
                <div class="mb-4">
                    <span class="text-2xl font-bold text-blue-600">${e.product.lprice}원</span>
                </div>
                <!-- 재고 -->
                <div class="text-sm text-gray-600 mb-4">
                    재고 ${e.product.stock}개
                </div>
                <!-- 설명 -->
                <div class="text-sm text-gray-700 leading-relaxed mb-6">
                    ${e.product.description}
                </div>
            </div>
        </div>
        <!-- 수량 선택 및 액션 -->
        <div class="border-t border-gray-200 p-4">
            <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-gray-900">수량</span>
            <div class="flex items-center">
                <button id="quantity-decrease" class="w-8 h-8 flex items-center justify-center border border-gray-300 
                rounded-l-md bg-gray-50 hover:bg-gray-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
                </button>
                <input type="number" id="quantity-input" value="1" min="1" max="107" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
                focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <button id="quantity-increase" class="w-8 h-8 flex items-center justify-center border border-gray-300 
                rounded-r-md bg-gray-50 hover:bg-gray-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                </button>
            </div>
            </div>
            <!-- 액션 버튼 -->
            <button id="add-to-cart-btn" data-product-id="85067212996" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
                hover:bg-blue-700 transition-colors font-medium">
            장바구니 담기
            </button>
        </div>
      </div>
       <!-- 상품 목록으로 이동 -->
      <div class="mb-6">
        <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
            hover:bg-gray-200 transition-colors go-to-product-list">
            상품 목록으로 돌아가기
        </button>
      </div>
     
       `:``}
      <!-- 관련 상품 -->
      ${e.relatedProducts&&e.relatedProducts.length>0?`
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
            <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
        </div>
        <div class="p-4">
            <div class="grid grid-cols-2 gap-3 responsive-grid">
               ${e.relatedProducts.map(e=>`
                <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${e.productId}">
                    <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                    <img src="${e.image}" alt="${e.title}" class="w-full h-full object-cover" loading="lazy">
                    </div>
                    <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${e.title}</h3>
                    <p class="text-sm font-bold text-blue-600">${e.lprice}원</p>
                </div>`).join(``)}
            </div>
        </div>
      </div>`:``}
    </main>
    <footer class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto py-8 text-center text-gray-500">
        <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
      </div>
    </footer>
  </div>
  `,m=({state:e,setState:t,addToCart:n,openCartModal:r,navigateTo:o})=>{let s={},c=async e=>{t({loading:!0});let n=await a(e.productId);t({product:n,loading:!1,relatedProducts:null}),d({category1:n.category1,category2:n.category2})},l=()=>{let t=document.getElementById(`root`);t.innerHTML=p(e),f()},d=async({category1:n,category2:r})=>{let a=await i({category1:n,category2:r}),o=a.products.filter(t=>t.productId!==e.product.productId);t({relatedProducts:o})},f=()=>{let e=document.querySelectorAll(`.related-product-card`);e.forEach(e=>{e.onclick=e=>{let t=e.target.closest(`.related-product-card`).getAttribute(`data-product-id`);m(t)}});let t=document.getElementById(`quantity-increase`);t&&(t.onclick=g);let n=document.getElementById(`quantity-decrease`);n&&(n.onclick=_);let i=document.getElementById(`add-to-cart-btn`);i&&(i.onclick=h);let a=document.getElementById(`go-to-product-list`);a&&(a.onclick=v);let o=document.getElementById(`cart-icon-btn`);o&&(o.onclick=()=>{r()})},m=e=>{o(`/product/${e}`)},h=e=>{let t=document.getElementById(`quantity-input`),r=parseInt(t.value);n({productId:e,quantity:r}),u(`장바구니에 추가되었습니다`)},g=()=>{let e=document.getElementById(`quantity-input`);e.value=parseInt(e.value)+1},_=()=>{let e=document.getElementById(`quantity-input`);e.value=e.value>1?parseInt(e.value)-1:1},v=()=>{o(`/`)};return s.createPage=c,s.render=l,s};var h=m;const g=e=>{let t=e.filter(e=>e.isChecked).length;return`
    <div class="cart-modal-overlay flex fixed bg-black/50 top-0 left-0 z-50 min-h-full w-full items-end justify-center p-0 sm:items-center sm:p-4">
    <div class="flex min-h-full cart-modal items-end justify-center p-0 sm:items-center sm:p-4">
      <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
        <!-- 헤더 -->
        <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
            </svg>
            장바구니 
            <span class="text-sm font-normal text-gray-600 ml-1">(${e.length})</span>
          </h2>
          <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- 컨텐츠 -->
        <div class="flex flex-col max-h-[calc(90vh-120px)]">
          <!-- 전체 선택 섹션 -->
          <div class="p-4 border-b border-gray-200 bg-gray-50">
            <label class="flex items-center text-sm text-gray-700" >
              <input type="checkbox" id="cart-modal-select-all-checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2" ${t===e.length?`checked`:``}>
              전체선택 (${e.length}개)
            </label>
          </div>
          ${e.length===0?`<div class="flex-1 flex items-center justify-center p-8">
            <div class="text-center">
              <div class="text-gray-400 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
              <p class="text-gray-600">원하는 상품을 담아보세요!</p>
            </div>
          </div>`:`<div class="flex-1 overflow-y-auto">
                  <div class="p-4 space-y-4">
            ${e.map(e=>`
                  <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${e.productId}">
                <!-- 선택 체크박스 -->
                <label class="flex items-center mr-3">
                  <input type="checkbox" class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded 
                focus:ring-blue-500" data-product-id="${e.productId}" ${e.isChecked?`checked`:``}>
                </label>
                <!-- 상품 이미지 -->
                <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                  <img src="${e.image}" alt="${e.title}" class="w-full h-full object-cover cursor-pointer cart-item-image" data-product-id="${e.productId}">
                </div>
                <!-- 상품 정보 -->
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" data-product-id="${e.productId}">
                    ${e.title}
                  </h4>
                  <p class="text-sm text-gray-600 mt-1">
                    ${e.lprice}원
                  </p>
                  <!-- 수량 조절 -->
                  <div class="flex items-center mt-2">
                    <button class="quantity-decrease-btn w-7 h-7 flex items-center justify-center 
                border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100" data-product-id="${e.productId}">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                      </svg> 
                    </button>
                    <input type="number" value="${e.quantity}" min="1" class="quantity-input w-12 h-7 text-center text-sm border-t border-b 
                border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" disabled="" data-product-id="${e.productId}">
                    <button class="quantity-increase-btn w-7 h-7 flex items-center justify-center 
                border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100" data-product-id="${e.productId}">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <!-- 가격 및 삭제 -->
                <div class="text-right ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    ${e.lprice*e.quantity}원
                  </p>
                  <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${e.productId}">
                    삭제
                  </button>
                </div>
              </div>
                  `).join(``)}
                  </div>
                </div>
                `} 
        </div>
        <!-- 하단 액션 -->
        <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <!-- 선택된 아이템 정보 -->
          <!-- 총 금액 -->
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-bold text-gray-900">총 금액</span>
            <span class="text-xl font-bold text-blue-600">${e.reduce((e,t)=>e+t.lprice*t.quantity,0)}원</span>
          </div>
          <!-- 액션 버튼들 -->
          <div class="space-y-2">
            <button id="cart-modal-remove-selected-btn" class="w-full bg-red-600 text-white py-2 px-4 rounded-md 
                      hover:bg-red-700 transition-colors text-sm">
              선택한 상품 삭제 (${t}개)
            </button>
            <div class="flex gap-2">
              <button id="cart-modal-clear-cart-btn" class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md 
                      hover:bg-gray-700 transition-colors text-sm">
                전체 비우기
              </button>
              <button id="cart-modal-checkout-btn" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md 
                      hover:bg-blue-700 transition-colors text-sm">
                구매하기
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  `},_={state:{cart:[]},loadFromStorage(){try{let e=localStorage.getItem(`shopping_cart`);e?this.state.cart=JSON.parse(e):this.state.cart=[]}catch(e){console.error(`Failed to load cart from localStorage:`,e),this.state.cart=[]}},saveToStorage(){try{localStorage.setItem(`shopping_cart`,JSON.stringify(this.state.cart))}catch(e){console.error(`Failed to save cart to localStorage:`,e)}},getters:{getCart:e=>e.cart},actions:{addToCart:(e,t,n=1)=>{let r=e.cart.find(e=>e.productId===t.productId);r?r.quantity+=n:e.cart.push({...t,quantity:n}),_.saveToStorage()},removeFromCart:(e,t)=>{e.cart=e.cart.filter(e=>e.productId!==t),_.saveToStorage()},removeAllFromCart:e=>{e.cart=[],_.saveToStorage()},updateCartItemQuantity:(e,t,n)=>{let r=e.cart.find(e=>e.productId===t);if(r&&(r.quantity+=n,r.quantity<=0)){_.actions.removeFromCart(e,t);return}_.saveToStorage()}}},v=({state:e,setState:t})=>{let n=null;function r(){n&&(n.innerHTML=g(e.cart),s())}function i(){let t=document.querySelectorAll(`.quantity-input`);t.forEach(t=>{let n=t.getAttribute(`data-product-id`),r=e.cart.find(e=>e.productId===n);r?t.value=r.quantity:t.value=0})}function a({product:e,addQuantity:n=1}){_.actions.addToCart(_.state,e,n),i(),t({cart:_.state.cart})}function o(){let e=document.getElementById(`modal-root`);e&&e.remove(),n=document.createElement(`div`),n.id=`modal-root`,document.body.style.overflow=`hidden`,r(),document.body.appendChild(n);let t=()=>{n.remove(),document.body.style.overflow=``},i=n.querySelector(`#cart-modal-close-btn`);i.onclick=t,n.onclick=e=>{e.target===n.querySelector(`.cart-modal-overlay`)&&t()};let a=e=>{e.key===`Escape`&&(t(),document.removeEventListener(`keydown`,a))};document.addEventListener(`keydown`,a)}function s(){let r=n.querySelectorAll(`.quantity-increase-btn`);r.forEach(e=>{e.onclick=e=>{let t=e.target.closest(`button`).getAttribute(`data-product-id`);i(),c(t,1)}});let a=n.querySelectorAll(`.quantity-decrease-btn`);a.forEach(e=>{e.onclick=e=>{let t=e.target.closest(`button`).getAttribute(`data-product-id`);i(),c(t,-1)}});let o=n.querySelectorAll(`.cart-item-remove-btn`);o.forEach(e=>{e.onclick=e=>{let t=e.target.getAttribute(`data-product-id`);l(t)}});let s=n.querySelectorAll(`.cart-item-checkbox`);s.forEach(n=>{n.onclick=n=>{let r=n.target.getAttribute(`data-product-id`),i=n.target.checked,a=e.cart.map(e=>(e.productId===r&&(e.isChecked=i),e));t({cart:a})}});let d=n.querySelector(`#cart-modal-remove-selected-btn`);d.onclick=()=>{let e=document.querySelectorAll(`.cart-item-checkbox:checked`),t=Array.from(e).map(e=>e.dataset.productId);t.forEach(e=>l(e))};let f=n.querySelector(`#cart-modal-select-all-checkbox`);f.onclick=n=>{let r=n.target.checked,i=e.cart.map(e=>(e.isChecked=r,e));t({cart:i})};let p=n.querySelector(`#cart-modal-clear-cart-btn`);p.onclick=()=>{u()}}function c(e,n){_.actions.updateCartItemQuantity(_.state,e,n),t({cart:_.state.cart})}function l(e){_.actions.removeFromCart(_.state,e),t({cart:_.state.cart})}function u(){_.actions.removeAllFromCart(_.state),t({cart:_.state.cart})}return{openCartModal:o,updateQuantityInputs:i,addToCart:a,renderCartModal:r}},y={products:[],pagination:{page:1,limit:20,totalPages:1,hasNext:!1,hasPrev:!1,total:0},filters:{search:``,sort:`price_asc`,category1:``,category2:``},cart:[],loading:!0,categories:null,productInfiniteLoading:!1},b=e=>{Object.assign(y,e),C()},x=new Set;function S(e){return x.add(e),e(),()=>x.delete(e)}function C(){for(let e of x)e()}const w=`
<main class="max-w-md mx-auto px-4 py-4">
  <div class="text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg">
  <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1a73e8;stop-opacity:1" />
      </linearGradient>
      <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="#000000" flood-opacity="0.1"/>
      </filter>
    </defs>
    
    <!-- 404 Numbers -->
    <text x="160" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="48" font-weight="600" fill="url(#blueGradient)" text-anchor="middle">404</text>
    
    <!-- Icon decoration -->
    <circle cx="80" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
    <circle cx="240" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
    <circle cx="90" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
    <circle cx="230" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
    
    <!-- Message -->
    <text x="160" y="110" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="400" fill="#5f6368" text-anchor="middle">페이지를 찾을 수 없습니다</text>
    
    <!-- Subtle bottom accent -->
    <rect x="130" y="130" width="60" height="2" rx="1" fill="url(#blueGradient)" opacity="0.3"/>
  </svg>
  
  <a href="/" data-link class="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">홈으로</a>
</div>
</main>
`,T=`/front_6th_chapter1-1`,E=()=>r(async()=>{let{worker:e,wokerOptions:t}=await import(`./browser-vWTd4VZR.js`);return{worker:e,wokerOptions:t}},[]).then(({worker:e,wokerOptions:t})=>e.start(t)),D=[{path:/^\/$/,page:`list`,parse:(e,t)=>({limit:t.get(`limit`),sort:t.get(`sort`),search:t.get(`search`),category1:t.get(`category1`),category2:t.get(`category2`)})},{path:/^\/product\/([^/]+)$/,page:`detail`,parse:e=>({productId:e[1]})}];function O(){let e=j(),t=new URLSearchParams(window.location.search);for(let n of D){let r=e.match(n.path);if(r)return{page:n.page,...n.parse(r,t)}}return{page:`notfound`}}let k;const A=e=>T+e,j=(e=window.location.pathname)=>e.startsWith(T)?e.slice(21)||`/`:e;function M(e){window.history.pushState({},``,A(e)),N()}function N(){(!k||k.pageType===`detail`)&&b({loading:!0}),_.loadFromStorage();let{openCartModal:e,updateQuantityInputs:t,addToCart:n,renderCartModal:r}=v({state:y,setState:b});S(()=>{t(),r()}),b({cart:_.state.cart});let i=O();if(i.page===`list`){if(b({filters:{...y.filters,search:i.search||``,sort:i.sort||`price_asc`,category1:i.category1||``,category2:i.category2||``},pagination:{...y.pagination,limit:i.limit?Number(i.limit):20}}),k&&k.pageType===`list`){k.render();return}k=f({state:y,setState:b,openCartModal:e,addToCart:n,navigateTo:M}),k.pageType=`list`,S(()=>{k.render()}),k.createPage();return}if(k&&k.pageType===`list`&&k.cleanupScrollInfinity(),i.page===`detail`){k=h({state:y,setState:b,openCartModal:e,addToCart:n,navigateTo:M}),k.pageType=`detail`,k.productId=i.productId,S(()=>{k.render()}),k.createPage({productId:i.productId});return}document.getElementById(`root`).innerHTML=w}function P(){window.addEventListener(`popstate`,N)}E().then(()=>{N(),P()});