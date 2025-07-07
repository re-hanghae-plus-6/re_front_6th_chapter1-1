import { router } from "../../routes";

function Link({ to, children }) {
  const link = document.createElement("a");

  link.href = to;
  link.addEventListener("click", (e) => {
    e.preventDefault();
    router.navigate(to);
  });
  link.innerHTML = children;

  return link;
}

export default Link;
