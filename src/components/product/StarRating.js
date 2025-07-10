import { StarEmptyIcon } from "../icons/StarEmptyIcon";
import { StarFilledIcon } from "../icons/StarFilledIcon";

export function StarRating(rating) {
  const filledStars = Array.from({ length: rating }, StarFilledIcon).join("");
  const emptyStars = Array.from({ length: 5 - rating }, StarEmptyIcon).join("");

  return /* HTML */ `<div class="flex items-center">${filledStars}${emptyStars}</div>`;
}
