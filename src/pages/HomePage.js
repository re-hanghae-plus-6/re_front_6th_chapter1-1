import { getProducts, getCategories } from "../api/productApi";
import { router } from "../main";
import { Main } from "./Main";

let state = {
  products: [],
  pagination: {},
  filters: {},
  category: {},
  isLoading: false,
};

export const HomePage = async () => {
  document.body.querySelector("#root").innerHTML = Main({});

  const [projectData, categoryData] = await Promise.all([getProducts(), getCategories()]);

  if (projectData) {
    state.pagination = projectData.pagination;
    state.filters = projectData.filters;
    state.products = projectData.products;
  }

  if (categoryData) {
    state.category = categoryData;
  }

  document.body.querySelector("#root").innerHTML = Main(state);

  bindCardClickHandlers();
};

const handleSelect = async function (e, key) {
  e.preventDefault();
  state.isLoading = true;
  document.body.querySelector("#root").innerHTML = Main({ ...state, products: [], isLoading: true });

  const value = e.target.value;
  const [otherKey, otherValue] = key === "limit" ? ["sort", state.filters.sort] : ["limit", state.pagination.limit];
  const projectData = await getProducts({
    [key]: key === "limit" ? Number(value) : value,
    [otherKey]: otherValue,
    search: state.filters.search,
    category1: state.filters.category1,
    category2: state.filters.category2,
  });

  if (projectData) {
    state.pagination = projectData.pagination;
    state.filters = projectData.filters;
    state.products = projectData.products;
  }

  state.isLoading = false;

  document.body.querySelector("#root").innerHTML = Main(state);
};

const handleInput = async function (e) {
  e.preventDefault();
  const value = e.target.value;
  state.filters.search = value;
};

const handleChange = function () {
  document.body.querySelector("#root").innerHTML = Main(state);
};

const handleEnter = async function (e) {
  if (e.key !== "Enter") return;

  e.preventDefault();

  state.isLoading = false;
  const projectData = await getProducts({
    sort: state.filters.sort,
    limit: state.pagination.limit,
    search: state.filters.search,
    page: state.filters.page,
  });

  if (projectData) {
    state.pagination = projectData.pagination;
    state.filters = projectData.filters;
    state.products = projectData.products;
  }

  document.body.querySelector("#root").innerHTML = Main(state);
};

document.addEventListener("change", (e) => {
  if (e.target.matches("#limit-select")) {
    handleSelect(e, "limit");
  }

  if (e.target.matches("#sort-select")) {
    handleSelect(e, "sort");
  }

  if (e.target.matches("#search-input")) {
    handleChange(e);
  }
});

document.addEventListener("input", (e) => {
  if (e.target.matches("#search-input")) {
    handleInput(e);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.target.matches("#search-input")) {
    handleEnter(e);
  }
});

function bindCardClickHandlers() {
  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card) => {
    card.onclick = (e) => {
      if (e.target.closest(".add-to-cart-btn")) {
        return;
      }

      const projectId = card.dataset.productId;
      history.pushState({}, "", `/product/${projectId}`);
      router();
    };
  });
}

let lastScrollY = window.scrollY;

window.addEventListener(
  "scroll",
  async () => {
    const [, link] = location.pathname.split("/");

    if (link === "") {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        console.log("↓ 아래로 스크롤 중");
        const docHeight = document.documentElement.scrollHeight;
        // scrollY + window.innerHeight
        const scrollPos = currentScrollY + window.innerHeight;

        if (!state.isLoading && state.pagination.hasNext && scrollPos + 200 >= docHeight) {
          state.isLoading = true;
          document.body.querySelector("#root").innerHTML = Main({ ...state });

          const projectData = await getProducts({
            sort: state.filters.sort,
            limit: state.pagination.limit,
            search: state.filters.search,
            category1: state.filters.category1,
            category2: state.filters.category2,
            page: state.pagination.page + 1,
          });

          if (projectData) {
            state.pagination = projectData.pagination;
            state.filters = projectData.filters;
            state.products = [...state.products, ...projectData.products];
          }

          state.isLoading = false;

          document.body.querySelector("#root").innerHTML = Main(state);
        }
      } else if (currentScrollY < lastScrollY) {
        if (state.isLoading) {
          state.isLoading = false;
        }
      }

      lastScrollY = currentScrollY;
    }
  },
  { passive: true },
);

document.addEventListener("DOMContentLoaded", () => {
  state = {
    products: [],
    pagination: {},
    filters: {},
    category: {},
    isLoading: false,
  };
});
