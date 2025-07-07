import { FilledStar } from "./star/filledStar.js";
import { EmptyStar } from "./star/emptyStar.js";

export const Rating = ({ rating }) => `
    <div class="flex items-center">
        ${FilledStar.repeat(rating)}
        ${EmptyStar.repeat(5 - rating)}
    </div>
    <span class="ml-2 text-sm text-gray-600">${rating}</span>
`;
