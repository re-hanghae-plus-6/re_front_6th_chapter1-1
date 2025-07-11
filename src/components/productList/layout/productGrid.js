export const ProductGrid = ({ children = "" }) => `
    <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${children}
    </div>
`;
