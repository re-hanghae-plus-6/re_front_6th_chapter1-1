import { getProducts, getCategories } from "../api/productApi";
import { Main } from "./Main";
import { router } from "../main";

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

const handleClick = async (e) => {
  const projectId = e.dataset.productId;

  history.pushState(null, "", `/product/${projectId}`);
  window.dispatchEvent(new Event("popstate"));
  await router();
};

document.addEventListener("click", (e) => {
  if (e.target.closest(".product-card")) {
    e.preventDefault();
    handleClick(e.target.closest(".product-card"));
  }
});

let lastScrollY = window.scrollY;

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

document.addEventListener(
  "scroll",
  debounce(
    async () => {
      const [, link] = location.pathname.split("/");

      if (link === "") {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
          console.log("↓ 아래로 스크롤 중");
          const docHeight = document.documentElement.scrollHeight;
          // scrollY + window.innerHeight
          const scrollPos = currentScrollY + window.innerHeight;

          if (!state.isLoading && state.pagination.hasNext && scrollPos + 100 >= docHeight) {
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

            document.body.querySelector("#root").innerHTML = Main(state);

            if (state.pagination.hasNext) {
              state.isLoading = false;
            }
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
  ),
  300,
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
