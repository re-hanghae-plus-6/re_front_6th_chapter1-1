class CategoryFilter {
  constructor() {}

  // {
  //   "title": "방충망 미세먼지 롤 창문 모기장 DIY 100cmx10cm",
  //   "link": "https:\/\/smartstore.naver.com\/main\/products\/668979777",
  //   "image": "https:\/\/shopping-phinf.pstatic.net\/main_1112415\/11124150101.10.jpg",
  //   "lprice": "450",
  //   "hprice": "",
  //   "mallName": "동백물산",
  //   "productId": "11124150101",
  //   "productType": "2",
  //   "brand": "메쉬코리아",
  //   "maker": "",
  //   "category1": "생활\/건강",
  //   "category2": "생활용품",
  //   "category3": "생활잡화",
  //   "category4": "모기장"
  // }

  // <div class="space-y-2">
  //           <div class="flex items-center gap-2">
  //             <label class="text-sm text-gray-600">카테고리:</label>
  //             <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button><span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" data-category1="생활/건강" class="text-xs hover:text-blue-800 hover:underline">생활/건강</button><span class="text-xs text-gray-500">&gt;</span><span class="text-xs text-gray-600 cursor-default">주방용품</span>
  //           </div>
  //           <div class="space-y-2">
  //             <div class="flex flex-wrap gap-2">
  //               <button data-category1="생활/건강" data-category2="생활용품" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
  //                 생활용품
  //               </button>
  //               <button data-category1="생활/건강" data-category2="주방용품" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-blue-100 border-blue-300 text-blue-800">
  //                 주방용품
  //               </button>
  //               <button data-category1="생활/건강" data-category2="문구/사무용품" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
  //                 문구/사무용품
  //               </button>
  //             </div>
  //           </div>
  //         </div>

  render() {
    return /*html*/ `
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">카테고리:</label>
          <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
        </div>
        <!-- 1depth 카테고리 -->
        <div class="flex flex-wrap gap-2">
          <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>
        </div>
        <!-- 2depth 카테고리 -->
      </div>
    `;
  }
}

export default CategoryFilter;
