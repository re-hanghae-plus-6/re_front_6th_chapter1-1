import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";

import { SearchFilter } from "../components/SearchFilter.js";
import { createElementByString } from "../utils/createViewcomponent.js";

export function ListPage() {
  return createElementByString(`
    <div class="bg-gray-50 min-h-screen">
      ${Header()}
      <main class="max-w-md mx-auto px-4 py-4">
        ${SearchFilter()}
        
      </main>
      ${Footer()}
    </div>
  `);
}
