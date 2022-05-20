import {
  HIDE_ACTIVITY_MODAL,
  HIDE_INFO_MODAL,
  SHOW_ACTIVITY_MODAL,
  SHOW_INFO_MODAL,
  hideActivityModal,
  hideInfoModal,
  showActivityModal,
  showInfoModal
} from './Modal';

describe('Testing Modal Actions', () => {
  it('Test Action Creators for Modal', () => {
    const showResponse = showActivityModal();
    expect(showResponse).toStrictEqual({ type: SHOW_ACTIVITY_MODAL });

    const hideResponse = hideActivityModal();
    expect(hideResponse).toStrictEqual({ type: HIDE_ACTIVITY_MODAL });

    const showInfoResponse = showInfoModal('Info', 'Test');
    expect(showInfoResponse).toStrictEqual({
      type: SHOW_INFO_MODAL,
      payload: { title: 'Info', text: 'Test' }
    });

    const hideInfoResponse = hideInfoModal();
    expect(hideInfoResponse).toStrictEqual({ type: HIDE_INFO_MODAL });
  });
});
