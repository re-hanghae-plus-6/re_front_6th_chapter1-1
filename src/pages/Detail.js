import Header from "../components/Header";
import Footer from "../components/Footer";

const DetailPage = () => {
  const root = document.body.querySelector("#root");

  const render = () => {
    root.innerHTML = `
      <div class="min-h-screen bg-gray-50">
        ${Header()}
        <main class="max-w-md mx-auto px-4 py-4">
        </main>
        ${Footer()}
      </div>
    `;
  };

  render();
};

export default DetailPage;
