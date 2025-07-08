import { router } from "../../routes";

function Link({ to, as = "a", children }) {
  const link = document.createElement(as);

  link.href = to;
  link.addEventListener("click", (e) => {
    e.preventDefault();
    router.navigate(to);
  });
  if (typeof children === "string") {
    link.innerHTML = children;
  } else if (children instanceof Node) {
    link.appendChild(children);
  }

  return link;
}

export default Link;
