function ListView({ id = "", tag = "ul", list, renderItem, className = "" }) {
  const container = document.createElement(tag);
  container.setAttribute("class", className);
  container.setAttribute("id", id);

  list.forEach((item) => {
    const itemElement = document.createElement("li");
    const itemContent = renderItem(item);
    if (itemContent instanceof Node) {
      itemElement.appendChild(itemContent);
    } else {
      itemElement.innerHTML = itemContent;
    }
    container.appendChild(itemElement);
  });

  return container;
}

export default ListView;
