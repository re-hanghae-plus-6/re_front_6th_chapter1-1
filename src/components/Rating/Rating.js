import { FullStar, EmptyStar } from "./Star";

export const Rating = (rating) => {
  const fullStars = Array.from({ length: rating })
    .map(() => FullStar())
    .join("");
  const emptyStars = Array.from({ length: 5 - rating })
    .map(() => EmptyStar())
    .join("");

  return /* HTML */ `<div class="flex items-center">${fullStars}${emptyStars}</div>`;
};
