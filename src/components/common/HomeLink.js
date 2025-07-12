const BASE_URL = import.meta.env.BASE_URL || "/";
const NORMALIZED_BASE_URL = BASE_URL === "/" ? "" : BASE_URL.replace(/\/$/, "");

export function HomeLink(props) {
  const { path = "/", text, className = "" } = props;
  const href = NORMALIZED_BASE_URL + "/";

  return /* HTML */ `<a href="${href}" data-link="${path}" class="${className}">${text}</a>`;
}
