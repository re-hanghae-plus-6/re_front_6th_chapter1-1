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
    this.unsubscribeCart = null;
    this.unsubscribeToast = null;
  }

  render() {
    this.element.innerHTML = `
      <div class="min-h-screen bg-gray-50">
        <div id="header"></div>
        <main id="content"></main>
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
    cartContainer.innerHTML = ''; // 리렌더시 중복 방지
    if (cartState.isOpen) {
      new Cart(cartContainer).mount();
    }
    // isOpen이 false면 아무것도 표시 X
  }

  updateToast(toastState) {
    const toastContainer = this.element.querySelector('#toast');
    if (!toastContainer) return;
    toastContainer.innerHTML = ''; // 리렌더시 중복 방지
    if (toastState.isOpen) {
      new Toast(toastContainer).mount();
    }
  }

  onUnmount() {
    // 구독 해제 (필수!)
    if (this.unsubscribeCart) this.unsubscribeCart();
    if (this.unsubscribeToast) this.unsubscribeToast();
  }
}
export default DefaultLayout;
