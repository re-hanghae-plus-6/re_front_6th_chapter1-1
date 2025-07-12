export default function createPortal(content, $container) {
  if (typeof content === "string") {
    $container.innerHTML = content;
  } else if (content instanceof Node) {
    $container.appendChild(content);
  }
}
