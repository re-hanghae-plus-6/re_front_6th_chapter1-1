import Home from "./pages/Home.js";
import { state } from "./src/store.js";
import { setupEventListeners } from "./utils/eventUtils.js";
import { getProductList } from "./utils/dataUtils.js";

function render() {
  document.body.querySelector("#root").innerHTML = Home(state);
  setupEventListeners();
}

async function init() {
  await getProductList();
}

const app = {
  render,
  init,
  state,
};

window.app = app;

export default app;
