import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  ReviewItemDetailsNavigatorStack,
  navigateBack, renderCalcButton, renderCamButton, renderPrintQueueButton, renderScanButton
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

let navigationProp: NavigationProp<any>;

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
    const { toJSON } = render(
      renderPrintQueueButton(navigationProp)
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('Render navigateBack button ', () => {
    const mockDispatch = jest.fn();
    navigateBack(mockDispatch, false, 'po', navigationProp);
    expect(mockDispatch).toHaveBeenCalled();
    navigateBack(mockDispatch, false, 'nsfl', navigationProp);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
