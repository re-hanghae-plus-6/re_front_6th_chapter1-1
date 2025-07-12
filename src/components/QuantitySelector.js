/**
 * QuantitySelector - 수량 선택 컴포넌트
 *
 * 재사용 가능한 수량 선택 UI 컴포넌트입니다.
 * 증감 버튼과 직접 입력을 지원하며, 최소/최대값 제한이 가능합니다.
 *
 * @example
 * const quantitySelector = new QuantitySelector({
 *   initialValue: 1,
 *   min: 1,
 *   max: 999,
 *   onChange: (quantity) => console.log('수량 변경:', quantity)
 * });
 */
class QuantitySelector {
  constructor(options = {}) {
    this.options = {
      initialValue: 1,
      min: 1,
      max: 999,
      onChange: null,
      ...options,
    };

    this.currentValue = this.options.initialValue;
    this.elementId = `quantity`;
  }

  /**
   * 수량 값을 설정합니다.
   * @param {number} value - 설정할 수량 값
   * @param {boolean} [triggerChange=true] - onChange 콜백 호출 여부
   */
  setValue(value, triggerChange = true) {
    const numValue = parseInt(value) || this.options.min;
    const clampedValue = Math.max(this.options.min, Math.min(this.options.max, numValue));

    if (this.currentValue !== clampedValue) {
      this.currentValue = clampedValue;
      this.updateInputValue();

      if (triggerChange && this.options.onChange) {
        this.options.onChange(this.currentValue);
      }
    }
  }

  /**
   * 현재 수량 값을 반환합니다.
   * @returns {number} 현재 수량 값
   */
  getValue() {
    return this.currentValue;
  }

  /**
   * 수량을 증가시킵니다.
   */
  increaseQuantity() {
    if (this.currentValue >= this.options.max) return;
    this.setValue(this.currentValue + 1);
  }

  /**
   * 수량을 감소시킵니다.
   */
  decreaseQuantity() {
    if (this.currentValue <= this.options.min) return;
    this.setValue(this.currentValue - 1);
  }

  /**
   * input 요소의 값을 현재 값으로 업데이트합니다.
   */
  updateInputValue() {
    const input = document.getElementById(`${this.elementId}-input`);
    if (input && input.value !== this.currentValue.toString()) {
      input.value = this.currentValue;
    }
  }

  /**
   * 수량 증가 버튼 클릭 이벤트 처리
   */
  handleIncreaseClick = () => {
    this.increaseQuantity();
  };

  /**
   * 수량 감소 버튼 클릭 이벤트 처리
   */
  handleDecreaseClick = () => {
    this.decreaseQuantity();
  };

  /**
   * input 값 변경 이벤트 처리
   */
  handleInputChange = (e) => {
    const inputValue = e.target.value;
    this.setValue(inputValue);
  };

  /**
   * input blur 이벤트 처리 (포커스 잃을 때)
   */
  handleInputBlur = (e) => {
    // input이 비어있거나 유효하지 않은 경우 현재 값으로 복원
    if (!e.target.value || isNaN(e.target.value)) {
      this.updateInputValue();
    }
  };

  /**
   * 이벤트 리스너를 연결합니다.
   */
  attachEvents() {
    const decreaseBtn = document.getElementById(`${this.elementId}-decrease`);
    const increaseBtn = document.getElementById(`${this.elementId}-increase`);
    const input = document.getElementById(`${this.elementId}-input`);

    if (decreaseBtn) {
      decreaseBtn.addEventListener("click", this.handleDecreaseClick);
    }

    if (increaseBtn) {
      increaseBtn.addEventListener("click", this.handleIncreaseClick);
    }

    if (input) {
      input.addEventListener("input", this.handleInputChange);
      input.addEventListener("blur", this.handleInputBlur);
    }
  }

  /**
   * 이벤트 리스너를 해제합니다.
   */
  detachEvents() {
    const decreaseBtn = document.getElementById(`${this.elementId}-decrease`);
    const increaseBtn = document.getElementById(`${this.elementId}-increase`);
    const input = document.getElementById(`${this.elementId}-input`);

    if (decreaseBtn) {
      decreaseBtn.removeEventListener("click", this.handleDecreaseClick);
    }

    if (increaseBtn) {
      increaseBtn.removeEventListener("click", this.handleIncreaseClick);
    }

    if (input) {
      input.removeEventListener("input", this.handleInputChange);
      input.removeEventListener("blur", this.handleInputBlur);
    }
  }

  /**
   * 컴포넌트가 DOM에 마운트된 후 호출됩니다.
   */
  mounted() {
    this.attachEvents();
    this.updateInputValue();
  }

  /**
   * 컴포넌트가 언마운트될 때 호출됩니다.
   */
  unmounted() {
    this.detachEvents();
  }

  /**
   * 컴포넌트를 렌더링합니다.
   * @returns {string} HTML 문자열
   */
  render() {
    return /*html*/ `
      <div class="flex items-center">
        <button id="${this.elementId}-decrease" 
                class="w-8 h-8 flex items-center justify-center border border-gray-300 
                rounded-l-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
          </svg>
        </button>
        <input type="number" 
               id="${this.elementId}-input" 
               value="${this.currentValue}" 
               min="${this.options.min}" 
               max="${this.options.max}" 
               class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
               focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
        <button id="${this.elementId}-increase" 
                class="w-8 h-8 flex items-center justify-center border border-gray-300 
                rounded-r-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
      </div>
    `;
  }
}

export default QuantitySelector;
