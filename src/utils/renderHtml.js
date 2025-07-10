import { bindAllEvents } from "./bindAllEvents";
import { Router } from "../router/Router";

export const renderHtml = async () => {
  document.body.querySelector("#root").innerHTML = await Router();
  bindAllEvents();
};
