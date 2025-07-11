export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  /**
   * data- 속성들을 key-value 형태로 지정할 수 있다. 예: { breadcrumb: 'reset', category1: '생활/건강' }
   * 지정되면 <button> 요소로 렌더링된다.
   */
  dataAttrs?: Record<string, string>;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** inline: true 이면 wrapper(nav)를 제거하고 순수한 항목들만 반환한다 */
  inline?: boolean;
}

export const 브레드크럼 = ({ items, inline = false }: BreadcrumbProps): string => {
  const breadcrumbHtml = items
    .map((item) => {
      // 비활성 span (마지막 활성 표시 혹은 단순 텍스트)
      if (item.isActive || (!item.href && !item.dataAttrs)) {
        return `<span class="text-xs text-gray-600 cursor-default">${item.label}</span>`;
      }

      // dataAttrs 가 존재하면 버튼으로 렌더링 (상품 목록 필터용)
      if (item.dataAttrs) {
        const dataAttrStr = Object.entries(item.dataAttrs)
          .map(([k, v]) => `data-${k}="${v}"`)
          .join(" ");
        return `<button ${dataAttrStr} class="text-xs hover:text-blue-800 hover:underline">${item.label}</button>`;
      } else {
        // 기본 앵커 (페이지 네비게이션용)
        return `<a href="${item.href}" data-link class="hover:text-blue-600 transition-colors">${item.label}</a>`;
      }
    })
    .join(' <span class="text-xs text-gray-500">&gt;</span> ');

  if (inline) return breadcrumbHtml;

  return `
    <nav class="mb-4">
      <div class="flex items-center space-x-2 text-sm text-gray-600">
        ${breadcrumbHtml}
      </div>
    </nav>
  `;
};

// 상품 상세용 브레드크럼 생성 헬퍼 함수 (홈페이지와 동일하게 "전체" 사용)
export const createProductBreadcrumb = (category1?: string, category2?: string): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [{ label: "전체", href: "/" }];

  if (category1) {
    items.push({
      label: category1,
      href: `/?category1=${encodeURIComponent(category1)}`,
    });
  }

  if (category2) {
    items.push({
      label: category2,
      href: `/?category1=${encodeURIComponent(category1 || "")}&category2=${encodeURIComponent(category2)}`,
      isActive: true,
    });
  } else if (category1) {
    // category2가 없으면 category1이 마지막
    items[items.length - 1].isActive = true;
  }

  return items;
};

// 상품 목록(카테고리 필터)용 브레드크럼 항목 생성
export const createCategoryBreadcrumb = (category1: string | null, category2: string | null): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    {
      label: "전체",
      dataAttrs: { breadcrumb: "reset" },
    },
  ];

  if (category1) {
    items.push({
      label: category1,
      dataAttrs: { breadcrumb: "category1", category1 },
    });
  }

  if (category2) {
    items.push({
      label: category2,
      isActive: true,
    });
  }

  return items;
};
