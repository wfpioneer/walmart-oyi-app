import {
  hideActivityModal,
  hideInfoModal,
  showActivityModal,
  showInfoModal
} from '../actions/Modal';
import { ModalState, modal } from './Modal';

describe('Testing Modal Reducer', () => {
  it('Testing Modal Reducer', () => {
    const initialState: ModalState = {
      showModal: false,
      showActivity: false,
      content: null
    };

    const testChangedState: ModalState = {
      showModal: false,
      showActivity: false,
      content: null
    };
    testChangedState.showActivity = true;
    testChangedState.showModal = true;
    let modalReducerResults = modal(initialState, showActivityModal());
    expect(modalReducerResults).toStrictEqual(testChangedState);

    modalReducerResults = modal(testChangedState, hideActivityModal());
    expect(modalReducerResults).toStrictEqual(initialState);

    testChangedState.showActivity = false;
    testChangedState.content = { title: 'Info', text: 'Test' };
    modalReducerResults = modal(initialState, showInfoModal('Info', 'Test'));
    expect(modalReducerResults).toStrictEqual(testChangedState);

    modalReducerResults = modal(testChangedState, hideInfoModal());
    expect(modalReducerResults).toStrictEqual(initialState);
  });
});
