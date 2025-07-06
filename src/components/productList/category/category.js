import { Breadcrumb } from "./breadcrumb.js";
import { SearchBar } from "./searchBar.js";
import { CategoryButton } from "./categoryButton.js";
import { ProductCountDropdown } from "./productCountDropdown.js";
import { ProductOrderByDropdown } from "./productOrderByDropdown.js";

export const Category = () => `
      <!-- 검색 및 필터 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div class="mb-4">
          ${SearchBar({
            searchValue: "테슷트",
          })}
        </div>
        
        <!-- 필터 옵션 -->
        <div class="space-y-3">

          <!-- 카테고리 필터 -->
          <div class="space-y-2">
            ${Breadcrumb({
              category1: "생활/건강",
              category2: "주방용품22222",
            })}
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                ${CategoryButton({
                  category1: "생활/건강",
                  category2: "생활용품",
                  name: "생활용품",
                  isSelected: false,
                })}
                ${CategoryButton({
                  category1: "생활/건강",
                  category2: "주방용품",
                  name: "주방용품",
                  isSelected: true,
                })}
                ${CategoryButton({
                  category1: "생활/건강",
                  category2: "문구/사무용품",
                  name: "문구/사무용품",
                  isSelected: false,
                })}
              </div>
            </div>
          </div>
          
          <!-- 기존 필터들 -->
          <div class="flex gap-2 items-center justify-between">
            <!-- 페이지당 상품 수 -->
            ${ProductCountDropdown()}
            <!-- 정렬 -->
            ${ProductOrderByDropdown()}
          </div>
        </div>
      </div>
  `;
