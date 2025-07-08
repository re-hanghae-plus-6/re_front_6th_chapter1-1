// import footer from './footer/Footer.js';
// import header from './header/Header.js';
//
// function DefaultLayout({ children }) {
//   return `
//     <div class="min-h-screen bg-gray-50">
//       ${header()}
//       ${children}
//       ${footer()}
//     </div>
//   `;
// }
//
// export default DefaultLayout;

import Component from '../../core/Component.js';
import Header from './header/Header.js';
import Footer from './footer/Footer.js';

class DefaultLayout extends Component {
  constructor(element, props) {
    super(element, props);
  }

  render() {
    this.element.innerHTML = `
      <div class="min-h-screen bg-gray-50">
        <div id="header"></div>
        <main id="content"></main>
        <div id="footer"></div>
      </div>
    `;
    new Header(this.element.querySelector('#header')).mount();
    new Footer(this.element.querySelector('#footer')).mount();

    // children: 페이지 컴포넌트 클래스
    if (this.props && this.props.children) {
      new this.props.children(this.element.querySelector('#content'), this.props).mount();
    }
  }
}
export default DefaultLayout;
