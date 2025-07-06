function ListView({ id = "", list, renderItem, className = "" }) {
  return /* HTML */ `
    <div class="${className}" id="${id}">${list.map((item, index) => renderItem(item, index)).join("")}</div>
  `;
}

export default ListView;
