export function findParentByTag(element, tagName) {
  if (element.tagName === tagName) {
    return element;
  }

  return findParentByTag(element.parentElement, tagName);
}
