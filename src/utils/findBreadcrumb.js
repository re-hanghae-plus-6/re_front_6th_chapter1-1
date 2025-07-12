export function findBreadcrumb(categoryObject, targetCategory, path = []) {
  for (const key in categoryObject) {
    const nextPath = [...path, key];
    if (key === targetCategory) {
      return nextPath;
    }

    const child = categoryObject[key];

    if (child && typeof child === "object") {
      const result = findBreadcrumb(child, targetCategory, nextPath);
      if (result.length) return result;
    }
  }

  return [];
}

export function findChildren(categoryObject, targetCategory) {
  if (!targetCategory) return Object.keys(categoryObject);

  for (const key in categoryObject) {
    if (key === targetCategory) {
      return Object.keys(categoryObject[key]);
    }

    const child = categoryObject[key];

    if (child && typeof child === "object") {
      const result = findChildren(child, targetCategory);
      if (result) return result;
    }
  }

  return [];
}
