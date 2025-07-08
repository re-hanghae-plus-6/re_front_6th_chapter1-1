// utils/render.js
export function render(selector, htmlString) {
  const container = document.querySelector(selector);
  if (container) container.innerHTML = htmlString;
}
