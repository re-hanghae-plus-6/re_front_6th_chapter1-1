import Component from '../../core/Component.js';
import Header from './header/Header.js';
import Footer from './footer/Footer.js';
import Cart from '../ui/modal/cart/Cart.js';
import cartStore from '../../store/cartStore.js';
import toastStore from '../../store/toastStore.js';
import Toast from '../feedback/toast/Toast.js';

class DefaultLayout extends Component {
  constructor(element, props) {
    super(element, props);
    this.cartInstance = null;
    this.toastInstance = null;
    this.unsubscribeCart = null;
    this.unsubscribeToast = null;
  }

  render() {
    this.element.innerHTML = `
      <div class="min-h-screen bg-gray-50">
        <div id="header"></div>
        <div id="content"></div>
        <div id="footer"></div>
        <div id="cart"></div>
        <div id="toast"></div>
      </div>
    `;
    new Header(this.element.querySelector('#header')).mount();
    new Footer(this.element.querySelector('#footer')).mount();

    // children: 페이지 컴포넌트 클래스
    if (this.props && this.props.children) {
      new this.props.children(this.element.querySelector('#content'), this.props).mount();
    }

    // Cart 표시 로직 분리
    this.updateCart(cartStore.getState());

    // Toast 표시 로직 분리
    this.updateCart(toastStore.getState());

    // 구독 (이미 구독 중이면 중복 방지)
    if (!this.unsubscribeCart) {
      this.unsubscribeCart = cartStore.subscribe(this.updateCart.bind(this));
    }
    if (!this.unsubscribeToast) {
      this.unsubscribeToast = toastStore.subscribe(this.updateToast.bind(this));
    }
  }

  updateCart(cartState) {
    const cartContainer = this.element.querySelector('#cart');
    if (!cartContainer) return;

    // 기존 Cart 인스턴스가 있으면 정리 (unmount)
    if (this.cartInstance) {
      this.cartInstance.unmount();
      this.cartInstance = null;
    }
    cartContainer.innerHTML = '';
    if (cartState.isOpen) {
      this.cartInstance = new Cart(cartContainer);
      this.cartInstance.mount();
    }
  }

  updateToast(toastState) {
    const toastContainer = this.element.querySelector('#toast');
    if (!toastContainer) return;
    // Toast 인스턴스 정리
    if (this.toastInstance) {
      this.toastInstance.unmount();
      this.toastInstance = null;
    }
    toastContainer.innerHTML = '';
    if (toastState.isOpen) {
      this.toastInstance = new Toast(toastContainer);
      this.toastInstance.mount();
    }
  }

  onUnmount() {
    // 구독 해제 (필수!)
    if (this.unsubscribeCart) this.unsubscribeCart();
    if (this.unsubscribeToast) this.unsubscribeToast();
    // 혹시 layout 해제할 때 남아있을 인스턴스 cleanup
    if (this.cartInstance) this.cartInstance.unmount();
    if (this.toastInstance) this.toastInstance.unmount();
  }
}
export default DefaultLayout;
