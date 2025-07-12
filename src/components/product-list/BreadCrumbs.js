import { getQueryParam } from "../../utils/getQueryParam";

function BreadCrumbs() {
  const render = () => {
    return /*HTML*/ `
      <div data-breadcrumb-container class="flex items-center gap-2">
       ${renderBreadcrumb()}
      </div>
     
    `;
  };

  const renderBreadcrumb = () => {
    const category1 = getQueryParam("category1");
    const category2 = getQueryParam("category2");

    let breadcrumbHTML = `
    <label class="text-sm text-gray-600">카테고리:</label>
    <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
  `;
    // category1이 있으면 브래드크럼 생긴다.
    if (category1) {
      breadcrumbHTML += `
         <span class="text-xs text-gray-500">&gt;</span>
        <button data-breadcrumb="category1" data-category1="${category1}" class="text-xs hover:text-blue-800 hover:underline">${category1}</button>
        `;
      // category2가 있으면 브래드크럼 생긴다.
      if (category2) {
        breadcrumbHTML += `
            <span class="text-xs text-gray-500">&gt;</span>
            <span class="text-xs text-gray-600 cursor-default">${category2}</span>
          `;
      }
    }

    return breadcrumbHTML;
  };

  const update = () => {
    const breadcrumbContainer = document.querySelector("[data-breadcrumb-container]");
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = renderBreadcrumb();
    }
  };

  return { render, update };
}

export default BreadCrumbs;
