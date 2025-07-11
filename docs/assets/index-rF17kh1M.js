(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e){if(t.type!==`childList`)continue;for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();const e=`modulepreload`,t=function(e){return`/front_6th_chapter1-1/`+e},n={},r=function(r,i,a){let o=Promise.resolve();if(i&&i.length>0){let r=function(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))},s=document.getElementsByTagName(`link`),c=document.querySelector(`meta[property=csp-nonce]`),l=c?.nonce||c?.getAttribute(`nonce`);o=r(i.map(r=>{if(r=t(r,a),r in n)return;n[r]=!0;let i=r.endsWith(`.css`),o=i?`[rel="stylesheet"]`:``,c=!!a;if(c)for(let e=s.length-1;e>=0;e--){let t=s[e];if(t.href===r&&(!i||t.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${r}"]${o}`))return;let u=document.createElement(`link`);if(u.rel=i?`stylesheet`:e,i||(u.as=`script`),u.crossOrigin=``,u.href=r,l&&u.setAttribute(`nonce`,l),document.head.appendChild(u),i)return new Promise((e,t)=>{u.addEventListener(`load`,e),u.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${r}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(e=>{for(let t of e||[]){if(t.status!==`rejected`)continue;s(t.reason)}return r().catch(s)})};async function i(e={}){let{limit:t=20,search:n=``,category1:r=``,category2:i=``,sort:a=`price_asc`}=e,o=e.current??e.page??1,s=new URLSearchParams({page:o.toString(),limit:t.toString(),...n&&{search:n},...r&&{category1:r},...i&&{category2:i},sort:a}),c=await fetch(`/api/products?${s}`);return await c.json()}async function a(e){let t=await fetch(`/api/products/${e}`);return await t.json()}async function o(){let e=await fetch(`/api/categories`);return await e.json()}var s=class{constructor(e){this.el=null,this.onFilterChange=e,this.state={categories:{},isLoading:!0,selectedCategories:[],searchQuery:``},this.handleSearch=this.debounce(e=>{this.setState({searchQuery:e.target.value}),this.onFilterChange&&this.onFilterChange({search:e.target.value})},300),this.fetchCategories()}async fetchCategories(){Object.keys(this.state.categories).length===0&&this.setState({isLoading:!0});try{let e=await o();this.setState({categories:e,isLoading:!1})}catch(e){console.error(`카테고리 데이터 로딩 실패:`,e),this.setState({isLoading:!1})}}setState(e){this.state={...this.state,...e},this.el&&this.updateContent()}updateContent(){let{categories:e,isLoading:t,selectedCategories:n}=this.state,r=this.el.querySelector(`.space-y-2 > div.flex.items-center.gap-2`);if(r){r.innerHTML=`
    <label class="text-sm text-gray-600">카테고리:</label>
    <button data-breadcrumb-index="-1" class="text-xs hover:text-blue-800 hover:underline">전체</button>
  `;let{selectedCategories:e}=this.state;e.forEach((t,n)=>{let i=n===e.length-1,a=document.createElement(`span`);if(a.className=`text-xs text-gray-500`,a.textContent=`>`,r.appendChild(a),i){let e=document.createElement(`span`);e.className=`text-xs text-gray-600 cursor-default`,e.textContent=t,r.appendChild(e)}else{let i=document.createElement(`button`);i.className=`text-xs hover:text-blue-800 hover:underline`,i.setAttribute(`data-breadcrumb-index`,n),i.setAttribute(`data-category1`,e[0]),i.textContent=t,r.appendChild(i)}})}let i=e;n.forEach(e=>{i=i?.[e]||{}});let a=this.el.querySelector(`.flex.flex-wrap.gap-2`);if(a){let[r,i]=n;if(t&&Object.keys(e).length===0){a.innerHTML=`<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`;return}let o=r?e?.[r]||{}:e,s=Array.from(a.querySelectorAll(`button`)),c=Object.keys(o),l=s.length===c.length&&s.every((e,t)=>e.textContent.trim()===c[t]);if(l)s.forEach(e=>{let t=e.textContent.trim(),n=t===i||!i&&t===r;e.className=`
            ${r?`category2-filter-btn`:`category1-filter-btn`}
            text-left px-3 py-2 text-sm rounded-md border transition-colors
            ${n?`bg-blue-100 border-blue-300 text-blue-800`:`bg-white border-gray-300 text-gray-700 hover:bg-gray-50`}
          `.trim()});else{let e=c.map(e=>{let t=e===i||!i&&e===r,n=e.replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return r?`<button data-category1="${r}" data-category2="${e}" 
        class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
        ${t?`bg-blue-100 border-blue-300 text-blue-800`:`bg-white border-gray-300 text-gray-700 hover:bg-gray-50`}">
        ${n}
      </button>`:`<button data-category1="${e}" 
        class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
        ${t?`bg-blue-100 border-blue-300 text-blue-800`:`bg-white border-gray-300 text-gray-700 hover:bg-gray-50`}">
        ${n}
      </button>`});a.innerHTML=e.join(``)}}}render(e={}){let t=[];return e.category1&&t.push(e.category1),e.category2&&t.push(e.category2),this.state.selectedCategories=t,this.state.searchQuery=e.search||``,this.el?(this.el.querySelector(`#search-input`).value=this.state.searchQuery,this.el.querySelector(`#limit-select`).value=e.limit,this.el.querySelector(`#sort-select`).value=e.sort):(this.el=document.createElement(`div`),this.el.className=`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4`,this.el.innerHTML=`
           <!-- 검색창 -->
           <div class="mb-4">
             <div class="relative">
               <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${this.state.searchQuery}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
               <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                 </svg>
               </div>
             </div>
           </div>
   
           <!-- 필터 옵션 -->
           <div class="space-y-3">
             <!-- 카테고리 필터 -->
             <div class="space-y-2">
               <div class="flex items-center gap-2">
               </div>
               <!-- 1depth 카테고리 (여기에 동적 콘텐츠가 들어갑니다) -->
               <div class="flex flex-wrap gap-2"></div>
             </div>
   
             <!-- 개수/정렬 -->
             <div class="flex gap-2 items-center justify-between">
               <div class="flex items-center gap-2">
                 <label class="text-sm text-gray-600">개수:</label>
                 <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                   <option value="10">10개</option>
                   <option value="20" ${e.limit===20?`selected`:``}>20개</option>
                   <option value="50" ${e.limit===50?`selected`:``}>50개</option>
                   <option value="100" ${e.limit===100?`selected`:``}>100개</option>
                 </select>
               </div>
               <div class="flex items-center gap-2">
                 <label class="text-sm text-gray-600">정렬:</label>
                 <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                   <option value="price_asc" ${e.sort===`price_asc`?`selected`:``}>가격 낮은순</option>
                   <option value="price_desc" ${e.sort===`price_desc`?`selected`:``}>가격 높은순</option>
                    <option value="name_asc" ${e.sort===`name_asc`?`selected`:``}>이름순</option>
                    <option value="name_desc" ${e.sort===`name_desc`?`selected`:``}>이름 역순</option>
                  </select>
                </div>
              </div>
            </div>
          `),this.updateContent(),this.addEvent(),this.el}debounce(e,t){let n;return(...r)=>{clearTimeout(n),n=setTimeout(()=>e.apply(this,r),t)}}addEvent(){let e=this.el.querySelector(`#search-input`),t=this.el.querySelector(`#limit-select`),n=this.el.querySelector(`#sort-select`),r=this.el.querySelector(`.flex.flex-wrap.gap-2`),i=this.el.querySelector(`.space-y-2 > div.flex.items-center.gap-2`);e?.addEventListener(`keydown`,e=>{e.key===`Enter`&&this.onFilterChange&&this.onFilterChange({search:e.target.value})}),t?.addEventListener(`change`,e=>{this.onFilterChange&&this.onFilterChange({limit:e.target.value})}),n?.addEventListener(`change`,e=>{this.onFilterChange&&this.onFilterChange({sort:e.target.value})}),r?.addEventListener(`click`,e=>{let t=e.target.closest(`button[data-category1]`);if(!t)return;let n=t.dataset.category1,r=t.dataset.category2,i;i=r?[n,r]:[n],this.setState({selectedCategories:i}),this.onFilterChange&&this.onFilterChange({category1:n,category2:r})}),i?.addEventListener(`click`,e=>{let t=e.target.closest(`[data-breadcrumb-index]`);if(!t)return;let n=Number(t.dataset.breadcrumbIndex),r=this.state.selectedCategories.slice(0,n+1);this.setState({selectedCategories:r});let[i,a]=r;this.onFilterChange&&this.onFilterChange({category1:i,category2:a})})}},c=s;const l={isOpen:!1,items:[]},u={state:{...l},subscribers:[],subscribe(e){this.subscribers.push(e),e(this.state)},notify(){this.subscribers.forEach(e=>e(this.state)),this.saveToLocalStorage()},setState(e){this.state={...this.state,...e},this.notify()},saveToLocalStorage(){try{localStorage.setItem(`shopping_cart`,JSON.stringify(this.state.items))}catch(e){console.error(`장바구니 저장 실패:`,e)}},loadFromLocalStorage(){try{let e=localStorage.getItem(`shopping_cart`);if(e){let t=JSON.parse(e);this.setState({items:t})}}catch(e){console.error(`장바구니 복원 실패:`,e)}},initialize(){this.loadFromLocalStorage()},addItem(e){let t=this.state.items.find(t=>t.id===e.productId),n;n=t?this.state.items.map(t=>t.id===e.productId?{...t,quantity:t.quantity+1}:t):[...this.state.items,{id:e.productId,title:e.title,price:parseInt(e.lprice),image:e.image,quantity:1,isSelected:!0}],this.setState({items:n})},removeItem(e){let t=this.state.items.filter(t=>t.id!==e);this.setState({items:t})},toggleItemSelection(e){let t=this.state.items.map(t=>t.id===e?{...t,isSelected:!t.isSelected}:t);this.setState({items:t})},toggleAllSelection(e){let t=this.state.items.map(t=>({...t,isSelected:e}));this.setState({items:t})},removeSelectedItems(){let e=this.state.items.filter(e=>!e.isSelected);this.setState({items:e})},clearCart(){this.setState({items:[]})},increaseQuantity(e){let t=this.state.items.map(t=>t.id===e?{...t,quantity:t.quantity+1}:t);this.setState({items:t})},decreaseQuantity(e){let t=this.state.items.map(t=>t.id===e&&t.quantity>1?{...t,quantity:t.quantity-1}:t).filter(Boolean);this.setState({items:t})},open(){this.setState({isOpen:!0})},close(){this.setState({isOpen:!1})},reset(){this.state={...l,items:[]},this.subscribers=[],this.notify()}};var d=class{constructor(){this.el=null}showSuccess(e=`장바구니에 추가되었습니다`){this.show(e,`success`)}showInfo(e){this.show(e,`info`)}showError(e=`오류가 발생했습니다`){this.show(e,`error`)}show(e,t=`success`){this.hide();let n=document.createElement(`div`);n.className=`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out`,n.id=`toast-message`;let r=t===`success`?`bg-green-600`:t===`info`?`bg-blue-600`:`bg-red-600`,i=this.getIcon(t);n.innerHTML=`
      <div class="${r} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
        <div class="flex-shrink-0">
          ${i}
        </div>
        <p class="text-sm font-medium">${e}</p>
        <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `,document.body.appendChild(n),this.el=n;let a=n.querySelector(`#toast-close-btn`);a&&a.addEventListener(`click`,()=>{this.hide()}),setTimeout(()=>{this.hide()},3e3)}hide(){this.el&&document.body.contains(this.el)&&(document.body.removeChild(this.el),this.el=null)}getIcon(e){switch(e){case`success`:return`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>`;case`info`:return`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;case`error`:return`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>`;default:return`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>`}}};const f=new d;var p=f;const m={products:[],pagination:{},loading:!0,loadingMore:!1,filters:{page:1,limit:20,sort:`price_asc`,search:``}};var h=class{constructor(){this.el=null,this.state={...m},this.searchFilter=new c(this.handleFilterChange.bind(this)),this.fetchProductsDebounced=this.debounce(this.fetchProducts.bind(this)),window.addEventListener(`popstate`,e=>{this.setState({filters:e.state||m.filters,loading:!0}),this.fetchProducts()}),this.handleScroll=this.handleScroll.bind(this)}handleFilterChange(e){let t={...this.state.filters,...e,page:1},n=new URLSearchParams;for(let e in t)t[e]!==void 0&&t[e]!==``&&t[e]!==null&&n.set(e,t[e]);history.pushState(t,``,`?${n.toString()}`),this.setState({filters:t,loading:!0}),this.fetchProducts()}debounce(e,t){let n;return(...r)=>{clearTimeout(n),n=setTimeout(()=>e.apply(this,r),t)}}handleScroll(){if(this.state.loadingMore||this.state.loading)return;let e=window.pageYOffset||document.documentElement.scrollTop,t=window.innerHeight,n=document.documentElement.scrollHeight;e+t>=n-100&&this.loadMoreProducts()}async loadMoreProducts(){if(this.state.loadingMore)return;let e=this.state.filters.page+1,t=Math.ceil((this.state.pagination.total||0)/this.state.filters.limit);if(!(e>t)){this.setState({loadingMore:!0});try{let t={...this.state.filters,page:e},n=await i(t),r=[...this.state.products,...n.products];this.setState({products:r,pagination:n.pagination,filters:t,loadingMore:!1})}catch(e){console.error(`추가 상품 로딩 실패:`,e),this.setState({loadingMore:!1})}}}async fetchProducts(){try{let e=await i(this.state.filters);this.setState({products:e.products,loading:!1,pagination:e.pagination})}catch(e){console.error(`상품 목록 불러오기 실패:`,e),this.setState({loading:!1})}}setState(e){if(this.state={...this.state,...e},this.el){let e=this.el,t=this.render();e.parentNode&&e.parentNode.replaceChild(t,e),this.el=t}}template(){return`
      <div class="home-page">
        <div id="search-filter-container"></div>
        <div id="product-list-container">
          ${this.templateProducts()}
        </div>
      </div>
    `}templateProducts(){let e=(this.state.pagination||{}).total||0,t=this.state.filters.page,n=Math.ceil(e/this.state.filters.limit),r=t<n;return this.state.loading?`<!-- 로딩 스켈레톤 --> <div class="grid grid-cols-2 gap-4 mb-6"> ${[,,,,].fill(0).map(()=>`<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"><div class="aspect-square bg-gray-200"></div><div class="p-3"><div class="h-4 bg-gray-200 rounded mb-2"></div><div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div><div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div><div class="h-8 bg-gray-200 rounded"></div></div></div>`).join(``)}</div>`:!this.state.products||!this.state.products.length?`<div class="text-center py-4"><p class="text-gray-600">불러올 상품이 없습니다.</p></div>`:`
      <div class="mb-4 text-sm text-gray-600">총 <span class="font-medium text-gray-900">${e}개</span>의 상품</div>
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${this.state.products.map(e=>`
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" data-product-id="${e.productId}">
            <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
              <img src="${e.image}" alt="${e.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" loading="lazy">
            </div>
            <div class="p-3">
              <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${e.title}</h3>
              <p class="text-xs text-gray-500 mb-2">${e.brand}</p>
              <p class="text-lg font-bold text-gray-900">${parseInt(e.lprice).toLocaleString()}원</p>
              <button class="w-full mt-2 bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="${e.productId}">장바구니 담기</button>
            </div>
          </div>
        `).join(``)}
      </div>
      ${this.state.loadingMore?`
        <div class="text-center py-4">
          <div class="inline-flex items-center">
            <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
          </div>
        </div>
      `:!r&&this.state.products.length>0?`
        <div class="text-center py-4 text-sm text-gray-500">
          모든 상품을 확인했습니다
        </div>
      `:``}
    `}render(){let e=this.el;e||(e=document.createElement(`main`),e.className=`max-w-md mx-auto px-4 py-4`),e.innerHTML=this.template();let t=e.querySelector(`#search-filter-container`),n=this.searchFilter.render(this.state.filters);return t.appendChild(n),this.el=e,this.addEventListeners(),this.el}addEventListeners(){this.el.querySelectorAll(`.add-to-cart-btn`).forEach(e=>{e.addEventListener(`click`,e=>{e.preventDefault();let t=e.currentTarget.dataset.productId,n=this.state.products.find(e=>e.productId===t);n&&(u.addItem(n),p.showSuccess(`장바구니에 추가되었습니다`))})}),this.el.querySelectorAll(`.product-image`).forEach(e=>{e.addEventListener(`click`,e=>{e.preventDefault();let t=e.currentTarget.closest(`.product-card`).dataset.productId;history.pushState({},``,`/product/${t}`),window.dispatchEvent(new CustomEvent(`urlchange`)),C()})})}init(){let e=new URLSearchParams(window.location.search),t={page:parseInt(e.get(`page`))||1,limit:parseInt(e.get(`limit`))||20,sort:e.get(`sort`)||`price_asc`,search:e.get(`search`)||``,category1:e.get(`category1`)||void 0,category2:e.get(`category2`)||void 0};return this.setState({filters:{...m.filters,...t}}),this.fetchProducts(),this.searchFilter.fetchCategories(),window.addEventListener(`scroll`,this.handleScroll),this.el}destroy(){window.removeEventListener(`scroll`,this.handleScroll)}},g=h,_=class{constructor(e={}){this.el=null,this.state={product:null,relatedProducts:[],quantity:1,loading:!0,productId:e.productId},this.relatedProductsTimeout=null}resetState(){this.state={product:null,relatedProducts:[],quantity:1,loading:!0,productId:this.state.productId},this.el=null}async fetchProductDetails(){let{productId:e}=this.state;if(!e){this.setState({loading:!1});return}try{let[t,n]=await Promise.all([a(e),i()]),r={productId:t.productId,title:t.title,image:t.image,lprice:t.lprice,rating:t.rating||0,category1:t.category1||``,category2:t.category2||``,category3:t.category3||``,category4:t.category4||``,stock:t.stock||0,reviewCount:t.reviewCount||0,description:t.description||``};this.setState({product:r,loading:!1,relatedProducts:[]}),this.relatedProductsTimeout=setTimeout(()=>{let t=n.products.filter(t=>t.productId!==e).slice(0,19);this.setState({relatedProducts:t})},10)}catch(e){console.error(`상품 상세 정보를 가져오는 중 오류가 발생했습니다.`,e),this.setState({loading:!1})}}setState(e){if(this.state={...this.state,...e},this.el){let e=this.el,t=this.render();e.parentNode&&e.parentNode.replaceChild(t,e),this.el=t}}template(){if(this.state.loading)return`<div class="py-20 bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">상품 정보를 불러오는 중...</p>
          </div>
        </div>`;if(!this.state.product)return`<div>Product not found</div>`;let{title:e,image:t,lprice:n,description:r,rating:i,productId:a}=this.state.product,o=this.state.relatedProducts&&this.state.relatedProducts.length>0?`<!-- 관련 상품 -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-4 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
              <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-2 gap-3 responsive-grid">
                  ${this.state.relatedProducts.map(e=>`
              <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${e.productId}">
                <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                  <img src="${e.image}" alt="${e.title}" class="w-full h-full object-cover" loading="lazy">
                </div>
                <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${e.title}</h3>
                <p class="text-sm font-bold text-blue-600">${parseInt(e.lprice).toLocaleString()}원</p>
              </div>
                  `).join(``)}
                </div>
              </div>
          </div>`:``,s=()=>{let e=[this.state.product.category1,this.state.product.category2].filter(Boolean),t=`
        <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
      `;return e.forEach((e,n)=>{t+=`
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <button class="breadcrumb-link" data-category-index="${n+1}" data-category-value="${e}">
            ${e}
          </button>
        `}),t};return`
        <!-- 브레드크럼 -->
        <nav class="mb-4">
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            ${s()}
          </div>
        </nav>
        <!-- 상품 상세 정보 -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <!-- 상품 이미지 -->
          <div class="p-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
               <img src="${t}" alt="${e}">
            </div>
            <!-- 상품 정보 -->
            <div>
              <p class="text-sm text-gray-600 mb-1"></p>
              <h1 class="text-xl font-bold text-gray-900 mb-3">${e}</h1>
              <!-- 평점 및 리뷰 -->
              <div class="flex items-center mb-3">
                <div class="flex items-center">
                  ${Array(i).fill(0).map(()=>`
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  `).join(``)}
                  ${Array(5-i).fill(0).map(()=>`
                    <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  `).join(``)}
                </div>
                <span class="ml-2 text-sm text-gray-600">${this.state.product.rating}.0 (${this.state.product.reviewCount}개 리뷰)</span>
              </div>
              <!-- 가격 -->
              <div class="mb-4">
                <span class="text-2xl font-bold text-blue-600">${parseInt(n).toLocaleString()}원</span>
              </div>
              <!-- 재고 -->
              <div class="text-sm text-gray-600 mb-4">
                재고 ${this.state.product.stock}개
              </div>
              <!-- 설명 -->
              <div class="text-sm text-gray-700 leading-relaxed mb-6">
                ${r}
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
                <input type="number" id="quantity-input" value="${this.state.quantity}" min="1" max="${this.state.product.stock}" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
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
            <button id="add-to-cart-btn" data-product-id="${a}" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
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

        ${o}
    `}render(){let e=this.el;return e||(e=document.createElement(`main`),e.className=`max-w-md mx-auto px-4 py-4`),e.innerHTML=this.template(),this.el=e,this.addEventListeners(),this.el}addEventListeners(){let e=this.el.querySelector(`#quantity-input`),t=this.el.querySelector(`#quantity-increase`),n=this.el.querySelector(`#quantity-decrease`),r=this.el.querySelector(`#add-to-cart-btn`),i=this.el.querySelector(`.go-to-product-list`);i&&i.addEventListener(`click`,()=>{window.history.back()}),this.el.querySelectorAll(`.breadcrumb-link`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=parseInt(e.dataset.categoryIndex),r=new URLSearchParams,i=[this.state.product.category1,this.state.product.category2].filter(Boolean);for(let e=0;e<n;e++)i[e]&&r.set(`category${e+1}`,i[e]);let a=`/?${r.toString()}`;history.pushState({},``,a),window.dispatchEvent(new CustomEvent(`urlchange`)),C()})}),e&&e.addEventListener(`input`,e=>{let t=parseInt(e.target.value,10);isNaN(t)||t<1?this.setState({quantity:1}):t>this.state.product.stock?this.setState({quantity:this.state.product.stock}):this.setState({quantity:t})}),t&&t.addEventListener(`click`,()=>{this.state.quantity<this.state.product.stock&&this.setState({quantity:this.state.quantity+1})}),n&&n.addEventListener(`click`,()=>{this.state.quantity>1&&this.setState({quantity:this.state.quantity-1})}),r&&r.addEventListener(`click`,()=>{let e={productId:this.state.product.productId,title:this.state.product.title,lprice:this.state.product.lprice,image:this.state.product.image};for(let t=0;t<this.state.quantity;t++)u.addItem(e);p.showSuccess(`장바구니에 추가되었습니다`)}),this.el.querySelectorAll(`.related-product-card`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=e.dataset.productId;history.pushState({},``,`/product/${n}`),window.dispatchEvent(new CustomEvent(`urlchange`)),C()})})}async init(){return this.relatedProductsTimeout&&(clearTimeout(this.relatedProductsTimeout),this.relatedProductsTimeout=null),this.resetState(),await new Promise(e=>setTimeout(e,50)),await this.fetchProductDetails(),this.render()}destroy(){this.relatedProductsTimeout&&(clearTimeout(this.relatedProductsTimeout),this.relatedProductsTimeout=null),this.el=null}},v=_,y=class{constructor(){this.el=null}template(){return`
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

            <text x="160" y="85" font-family="Segoe UI, sans-serif" font-size="48" font-weight="600" fill="url(#blueGradient)" text-anchor="middle">404</text>
            <circle cx="80" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
            <circle cx="240" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
            <circle cx="90" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
            <circle cx="230" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
            <text x="160" y="110" font-family="Segoe UI, sans-serif" font-size="14" font-weight="400" fill="#5f6368" text-anchor="middle">페이지를 찾을 수 없습니다</text>
            <rect x="130" y="130" width="60" height="2" rx="1" fill="url(#blueGradient)" opacity="0.3"/>
          </svg>

          <a href="/" data-link class="inline-block mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            홈으로
          </a>
        </div>
      </main>
    `}render(){let e=document.createElement(`template`);return e.innerHTML=this.template().trim(),this.el=e.content.firstElementChild,this.addEvent(),this.el}addEvent(){let e=this.el.querySelector(`a[href="/"]`);e&&e.addEventListener(`click`,e=>{e.preventDefault(),history.pushState({},``,`/`),window.dispatchEvent(new Event(`popstate`))})}async init(){return this.render()}},b=y;let x=null;function S(){return window.location.hash.replace(/^#/,``)||`/`}async function C(){let e=document.querySelector(`#app`);if(!e)return;let t=S(),n=null;if(t===`/`)n=new g;else if(/^\/product\/[\w-]+$/.test(t)){let e=t.split(`/`)[2];n=e?new v({productId:e}):new b}else n=new b;x&&typeof x.destroy==`function`&&x.destroy(),n.init&&await n.init(),e.innerHTML=``,e.appendChild(n.render()),x=n}var w=class{constructor(){this.el=null,this.state={cartCount:0},this.handlePopstate=this.handlePopstate.bind(this),this.handleUrlChange=this.handleUrlChange.bind(this),u.subscribe(e=>{let t=e.items?e.items.length:0;this.setState({cartCount:t})})}handlePopstate(){this.updateHeader()}handleUrlChange(){this.updateHeader()}updateHeader(){if(this.el){let e=this.el,t=this.render();e.parentNode&&e.parentNode.replaceChild(t,e),this.el=t}}badgeTemplate(){let e=this.el.querySelector(`#cart-count-badge`);if(this.state.cartCount===0)e&&e.remove();else{if(!e){let t=this.el.querySelector(`#cart-icon-btn`);e=document.createElement(`span`),e.id=`cart-count-badge`,e.className=`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center`,t.appendChild(e)}e.textContent=this.state.cartCount,e.classList.remove(`hidden`)}}template(){let e=this.state.cartCount===0?`hidden`:``,t=window.location.pathname.startsWith(`/product/`);return`
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            ${t?`
              <div class="flex items-center space-x-3">
                <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
              </div>
            `:`
              <h1 class="text-xl font-bold text-gray-900">
                <a href="/" data-link>쇼핑몰</a>
              </h1>
            `}
            <div class="flex items-center space-x-2">
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6">
                  </path>
                </svg>${this.state.cartCount>0?`
                <span id="cart-count-badge"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${e}">
                  ${this.state.cartCount}
                </span>`:``}
              </button>
            </div>
          </div>
        </div>
      </header>
    `}setState(e){this.state={...this.state,...e},this.update()}update(){this.el&&this.badgeTemplate()}render(){let e=document.createElement(`template`);e.innerHTML=this.template().trim();let t=e.content.firstElementChild;this.el&&this.el.parentNode&&this.el.parentNode.replaceChild(t,this.el),this.el=t;let n=this.el.querySelector(`#cart-icon-btn`);return n.addEventListener(`click`,()=>{u.setState({isOpen:!0})}),window.removeEventListener(`popstate`,this.handlePopstate),window.addEventListener(`popstate`,this.handlePopstate),window.removeEventListener(`urlchange`,this.handleUrlChange),window.addEventListener(`urlchange`,this.handleUrlChange),this.el}},T=w,E=class{constructor(){this.el=null}template(){return`
      <footer class="bg-white shadow-sm">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
      </footer>
    `}render(){let e=document.createElement(`template`);return e.innerHTML=this.template().trim(),this.el=e.content.firstElementChild,this.el}},D=E,O=class{constructor(){this.el=null,u.subscribe(e=>{var t;let n=(t=this.state)?.isOpen||!1,r=e.isOpen||!1;if(this.state={...e},r&&!n){this.hide(),this.render();let e=document.getElementById(`root`);e?e.appendChild(this.el):document.body.appendChild(this.el),this.show()}else !r&&n?this.el&&(this.el.parentNode&&this.el.parentNode.removeChild(this.el),this.el.style.display=`none`,this.el=null):r&&n&&this.el&&this.update()})}update(){if(!this.el)return;let e=this.el.querySelector(`h2`);if(e){var t;let n=(t=this.state)?.items||[],r=n.length,i=r>0?`<span class="text-sm font-normal text-gray-600 ml-1">(${r})</span>`:``;e.innerHTML=`
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
        </svg>
        장바구니
        ${i}
      `}let n=this.el.querySelector(`.cart-content`);n&&(n.innerHTML=this.templateContent(),this.addEvent())}show(){if(this.el)this.el.style.display=`block`;else{this.render();let e=document.getElementById(`root`);e&&e.appendChild(this.el),this.el.style.display=`block`}}hide(){this.el&&(this.el.parentNode&&this.el.parentNode.removeChild(this.el),this.el.style.display=`none`,this.el=null);let e=document.querySelector(`.cart-modal-overlay`);e&&e.parentNode&&e.parentNode.removeChild(e),this.removeEventListeners()}removeEventListeners(){this.keydownHandler&&(document.removeEventListener(`keydown`,this.keydownHandler),this.keydownHandler=null)}templateCartItem(e){return`
      <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${e.id}">
        <!-- 선택 체크박스 -->
        <label class="flex items-center mr-3">
          <input type="checkbox" class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" data-product-id="${e.id}" ${e.isSelected?`checked`:``}>
        </label>
        <!-- 상품 이미지 -->
        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
          <img src="${e.image}" alt="${e.title}" class="w-full h-full object-cover cursor-pointer cart-item-image" data-product-id="${e.id}">
        </div>
        <!-- 상품 정보 -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" data-product-id="${e.id}">${e.title}</h4>
          <p class="text-sm text-gray-600 mt-1">${e.price.toLocaleString()}원</p>
          <!-- 수량 조절 -->
          <div class="flex items-center mt-2">
            <button class="quantity-decrease-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100" data-product-id="${e.id}">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <input type="number" value="${e.quantity}" min="1" class="quantity-input w-12 h-7 text-center text-sm border-t border-b border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" disabled data-product-id="${e.id}">
            <button class="quantity-increase-btn w-7 h-7 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100" data-product-id="${e.id}">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- 가격 및 삭제 -->
        <div class="text-right ml-3">
          <p class="text-sm font-medium text-gray-900">${(e.price*e.quantity).toLocaleString()}원</p>
          <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${e.id}">삭제</button>
        </div>
      </div>
    `}templateEmpty(){return`
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="text-center">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
          <p class="text-gray-600">원하는 상품을 담아보세요!</p>
        </div>
      </div>
    `}templateContent(){var e;let t=(e=this.state)?.items||[];if(t.length===0)return this.templateEmpty();let n=t.reduce((e,t)=>e+t.price*t.quantity,0),r=t.filter(e=>e.isSelected),i=r.length,a=r.reduce((e,t)=>e+t.price*t.quantity,0),o=t.length>0&&i===t.length;return`
      <div class="flex flex-col max-h-[calc(90vh-120px)]">
        <!-- 전체 선택 섹션 -->
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <label class="flex items-center text-sm text-gray-700">
            <input type="checkbox" id="cart-modal-select-all-checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2" ${o?`checked`:``}>
            전체선택 (${t.length}개)
          </label>
        </div>
        <!-- 아이템 목록 -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-4 space-y-4">
            ${t.map(this.templateCartItem).join(``)}
          </div>
        </div>
      </div>
      <!-- 하단 액션 -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        ${i>0?`
          <!-- 선택된 아이템 정보 -->
          <div class="flex justify-between items-center mb-3 text-sm">
            <span class="text-gray-600">선택한 상품 (${i}개)</span>
            <span class="font-medium">${a.toLocaleString()}원</span>
          </div>
        `:``}
        <!-- 총 금액 -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-bold text-gray-900">총 금액</span>
          <span class="text-xl font-bold text-blue-600">${n.toLocaleString()}원</span>
        </div>
        <!-- 액션 버튼들 -->
        <div class="space-y-2">
          ${i>0?`
            <button id="cart-modal-remove-selected-btn" class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm">
              선택한 상품 삭제 (${i}개)
            </button>
          `:``}
          <div class="flex gap-2">
            <button id="cart-modal-clear-cart-btn" class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm">전체 비우기</button>
            <button id="cart-modal-checkout-btn" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">구매하기</button>
          </div>
        </div>
      </div>
    `}itemCountText(){var e;let t=(e=this.state)?.items||[],n=t.length;return n>0?`<span class="text-sm font-normal text-gray-600 ml-1">(${n})</span>`:``}templateShell(){return`
      <div class="fixed inset-0 z-50 overflow-y-auto cart-modal" style="display: none;">
        <!-- 배경 오버레이 -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity cart-modal-overlay"></div>
        <!-- 모달 컨테이너 -->
        <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
          <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
            <!-- 헤더 -->
            <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
                장바구니
                ${this.itemCountText()}
              </h2>
              <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <!-- 컨텐츠 -->
            <div class="flex flex-col cart-content max-h-[calc(90vh-120px)]">
              ${this.templateContent()}
            </div>
          </div>
        </div>
      </div>
    `}addEvent(){var e,t,n,r,i;this.removeEventListeners(),(e=this.el.querySelector(`#cart-modal-close-btn`))?.addEventListener(`click`,()=>u.close()),(t=this.el.querySelector(`.cart-modal-overlay`))?.addEventListener(`click`,e=>{e.target===e.currentTarget&&u.close()});let a=e=>{e.key===`Escape`&&u.close()};document.addEventListener(`keydown`,a),this.keydownHandler=a,this.el.querySelectorAll(`.cart-item-remove-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.productId;u.removeItem(t)})}),this.el.querySelectorAll(`.quantity-increase-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.productId;u.increaseQuantity(t)})}),this.el.querySelectorAll(`.quantity-decrease-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.productId;u.decreaseQuantity(t)})}),this.el.querySelectorAll(`.cart-item-checkbox`).forEach(e=>{e.addEventListener(`change`,e=>{let t=e.currentTarget.dataset.productId;u.toggleItemSelection(t)})}),(n=this.el.querySelector(`#cart-modal-select-all-checkbox`))?.addEventListener(`change`,e=>{u.toggleAllSelection(e.currentTarget.checked)}),(r=this.el.querySelector(`#cart-modal-remove-selected-btn`))?.addEventListener(`click`,()=>{u.removeSelectedItems(),p.showInfo(`선택된 상품들이 삭제되었습니다`)}),(i=this.el.querySelector(`#cart-modal-clear-cart-btn`))?.addEventListener(`click`,()=>{u.clearCart(),p.showInfo(`장바구니가 비워졌습니다`)})}render(){let e=document.createElement(`template`);return e.innerHTML=this.templateShell().trim(),this.el=e.content.firstElementChild,this.addEvent(),this.el}},k=O;const A=()=>r(async()=>{let{worker:e}=await import(`./browser-CcyfQrG1.js`);return{worker:e}},[]).then(({worker:e})=>e.start({onUnhandledRequest:`bypass`})),j=new k,M=new T,N=new D;function P(){let e=document.getElementById(`root`);if(!e)return;e.innerHTML=``;let t=M.render(),n=N.render(),r=document.createElement(`div`);r.id=`app`,e.appendChild(t),e.appendChild(r),e.appendChild(n),e.querySelector(`.cart-modal`)||e.appendChild(j.render())}const F=()=>{u.initialize(),P(),C()};function I(){F();let e=null;window.addEventListener(`popstate`,()=>{e&&clearTimeout(e),e=setTimeout(()=>{F(),e=null},10)})}A().then(I);