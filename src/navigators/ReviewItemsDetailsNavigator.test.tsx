import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  ReviewItemDetailsNavigatorStack,
  navigateBack, navigateHistoryBack,
  renderCalcButton, renderCamButton,
  renderCloseButton, renderPrintQueueButton, renderScanButton
} from './ReviewItemDetailsNavigator';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

jest.mock('../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));
jest.mock('../state/actions/Modal', () => ({
  showInfoModal: jest.fn()
}));
jest.mock('../utils/scannerUtils', () => ({
  openCamera: jest.fn()
}));

jest.mock('../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn()
};

describe('ReviewItemsDetailsNavigation', () => {
  it('Render ReviewItemsNavigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ReviewItemDetailsNavigatorStack
        isManualScanEnabled={false}
        calcOpen={false}
        exceptionType={null}
        actionCompleted={false}
        showCalculator={false}
        title=""
        dispatch={jest.fn()}
        navigation={navigationProp}
        manualNoAction={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders and Calls the Manual Scan Button', () => {
    const mockDispatch = jest.fn();

    const { toJSON, getByTestId } = render(
      renderScanButton(mockDispatch, false)
    );
    const scanButton = getByTestId('barcode-scan');
    fireEvent.press(scanButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Render open camera button', () => {
    const { toJSON, getByTestId } = render(
      renderCamButton()
    );
    const cameraButton = getByTestId('open-camera');
    fireEvent.press(cameraButton);
    expect(toJSON()).toMatchSnapshot();
  });
  it('Render calcutator button ', () => {
    const mockDispatch = jest.fn();
    const { toJSON, getByTestId } = render(
      renderCalcButton(mockDispatch, false)
    );
    const calcbutton = getByTestId('calc-button');
    fireEvent.press(calcbutton);
    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });
  it('Render print queue button ', () => {
    const { toJSON, getByTestId } = render(
      renderPrintQueueButton(navigationProp)
    );
    const printButton = getByTestId('print-queue-button');
    fireEvent.press(printButton);
    expect(navigationProp.navigate).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Render navigateBack button ', () => {
    const mockDispatch = jest.fn();
    navigateBack(mockDispatch, true, 'null', navigationProp);
    expect(navigationProp.goBack).toHaveBeenCalled();
    navigateBack(mockDispatch, false, 'po', navigationProp);
    expect(mockDispatch).toHaveBeenCalled();
    navigateBack(mockDispatch, false, 'nsfl', navigationProp);
    expect(mockDispatch).toHaveBeenCalled();
  });
  it('Render navigateHistoryBack button', () => {
    const mockDispatch = jest.fn();
    navigateHistoryBack(mockDispatch, navigationProp);
    expect(mockDispatch).toHaveBeenCalled();
    expect(navigationProp.navigate).toHaveBeenCalled();
  });
  it('Render close button', () => {
    const mockDispatch = jest.fn();
    const { getByTestId } = render(
      renderCloseButton(mockDispatch, navigationProp)
    );
    const closeButton = getByTestId('close-button');
    fireEvent.press(closeButton);
    expect(mockDispatch).toHaveBeenCalled();
    expect(navigationProp.navigate).toHaveBeenCalled();
  });
});
