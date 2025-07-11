import BaseComponent from "@/core/component";
import { Footer, CartModal, Toast } from "@/components";
import { subscribeToCartVisibility, hideCartModal } from "@/store";

export default class AppComponent extends BaseComponent {
  constructor($el) {
    super($el, {
      preserveSelectors: ["#main", "#header-container"], // 메인 뷰 보존
    });
    this.state = {
      cartModalVisible: false, // 전역 상태로 관리되므로 초기값은 false
    };

    // 푸터 컴포넌트 인스턴스
    this.footerComponent = null;
    this.cartModalComponent = null;
    this.toastComponent = null;

    // 전역 상태 구독 해제 함수
    this.unsubscribeCartVisibility = null;
  }

  initialState() {
    super.initialState();
  }

  componentDidMount() {
    this.initializeComponent();
    this.initializeToast();
    this.initializeCartVisibilitySubscription();
    this.createCartModal();
  }

  componentDidUpdate(_, __, nextState) {
    this.initializeComponent();
    this.initializeToast();
    this.createCartModal(nextState.cartModalVisible);

    // 모달 상태가 변경되면 CartModal 재생성
    if (nextState.cartModalVisible) {
      // 새로운 CartModal 생성

      this.cartModalComponent.render();
    }
  }

  componentWillUnmount() {
    // 컴포넌트 정리
    if (this.footerComponent) {
      this.footerComponent.componentWillUnmount?.();
    }
    if (this.cartModalComponent) {
      this.cartModalComponent.componentWillUnmount?.();
    }
    if (this.toastComponent) {
      this.toastComponent.componentWillUnmount?.();
    }

    // 전역 상태 구독 해제
    if (this.unsubscribeCartVisibility) {
      this.unsubscribeCartVisibility();
    }
  }

  initializeComponent() {
    // 푸터 컴포넌트 초기화
    const footerElement = this.target.querySelector("#footer-container");
    if (footerElement) {
      this.footerComponent = new Footer(footerElement, {});
    }
  }

  /**
   * 토스트 컴포넌트 초기화
   */
  initializeToast() {
    const toastContainer = this.target.querySelector("#toast-container");
    if (toastContainer && !this.toastComponent) {
      this.toastComponent = new Toast(toastContainer);
    }
  }

  /**
   * 장바구니 모달 visibility 전역 상태 구독 초기화
   */
  initializeCartVisibilitySubscription() {
    this.unsubscribeCartVisibility = subscribeToCartVisibility((isVisible) => {
      if (this.state.cartModalVisible !== isVisible) {
        this.setState({ cartModalVisible: isVisible });

        // body overflow 스타일 설정
        document.body.style.overflow = isVisible ? "hidden" : "";
      }
    });
  }

  createCartModal(isVisible) {
    const modalElement = this.target.querySelector("#cart-modal-container");
    if (modalElement) {
      this.cartModalComponent = new CartModal(modalElement, {
        now: Date.now(),
        isVisible: isVisible,
        onClose: () => this.closeCartModal(),
        toast: this.toastComponent,
      });
    }
  }

  /**
   * 장바구니 모달 닫기 (전역 액션 호출)
   */
  closeCartModal() {
    hideCartModal();
  }

  template() {
    return /* html */ `
      <div class="min-h-screen flex flex-col bg-gray-50">
        <!-- 헤더 컨테이너 -->
        <div id="header-container"></div>
        
        <!-- 메인 콘텐츠 -->
        <div class="max-w-md mx-auto px-4 py-4 mt-[72px] mb-[116px]">
          <div id="main" class="flex-1"></div>
        </div>
        
        <!-- 푸터 컨테이너 -->
        <div id="footer-container"></div>
        
        <!-- 장바구니 모달 컨테이너 -->
        <div id="cart-modal-container"></div>

        <!-- 토스트 컨테이너 -->
        <div id="toast-container"></div>
      </div>
    `;
  }
}
