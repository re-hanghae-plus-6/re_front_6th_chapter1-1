function DefaultLayout({ children }) {
  return `
    <div class="min-h-screen bg-gray-50">
      ${children}
    </div>
  `;
}

export default DefaultLayout;
