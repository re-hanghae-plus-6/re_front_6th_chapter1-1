const setSelectedCategoryStyle = (button) => {
  // 모든 버튼에서 선택된 스타일 제거
  const categoryButtons = document.querySelectorAll(".category1-filter-btn");
  categoryButtons.forEach((btn) => {
    btn.classList.remove("bg-blue-100", "border-blue-300", "text-blue-800");
    btn.classList.add("bg-white", "border-gray-300", "text-gray-700", "hover:bg-gray-50");
  });

  // 클릭된 버튼에 선택된 스타일 추가
  button.classList.remove("hover:bg-gray-50");
  button.classList.add("bg-blue-100", "border-blue-300", "text-blue-800");
};

export { setSelectedCategoryStyle };
