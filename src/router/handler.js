import { LoadingContent, NotFoundContent, ProductContent } from "../pages/components";

export function renderLoadingContent() {
  const root = document.getElementById("root");
  root.innerHTML = LoadingContent();
}

export function renderProductContent() {
  const root = document.getElementById("root");
  root.innerHTML = ProductContent();
}

export function renderNotFound() {
  const root = document.getElementById("root");
  root.innerHTML = NotFoundContent();
}
