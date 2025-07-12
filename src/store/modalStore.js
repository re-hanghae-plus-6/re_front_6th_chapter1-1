class ModalStore {
  constructor() {
    this.state = {
      isOpen: false,
      data: null,
    };
  }

  // 모달 창 열기

  openModal() {
    if (this.state.isOpen) return;
    this.state.isOpen = true;
  }
  // 모달 창 닫기
  closeModal() {
    if (!this.state.isOpen) return;

    this.state.isOpen = false;
  }

  //
}

const modalStore = new ModalStore();

export default modalStore;
