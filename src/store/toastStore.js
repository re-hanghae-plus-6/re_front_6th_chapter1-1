import CreateStore from '../core/CreateStore.js';

const toastStore = new CreateStore({
  isOpen: false,
  type: 'success', // success | info | error
  message: '',
});
export default toastStore;
