import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  PalletManagementNavigatorStack,
  renderManagePalletKebabButton,
  renderScanButton
} from './PalletManagementNavigator';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

jest.mock('../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

jest.mock('../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

describe('PalletManagement Navigator', () => {
  it('Renders the PalletManagement Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PalletManagementNavigatorStack
        isManualScanEnabled={false}
        managePalletMenu={false}
        dispatch={jest.fn()}
        createPallet={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the PalletManagement Navigator when create pallet is true', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PalletManagementNavigatorStack
        isManualScanEnabled={false}
        managePalletMenu={false}
        dispatch={jest.fn()}
        createPallet={true}
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

  it('Renders and Calls the Kebab Menu button', () => {
    const mockDispatch = jest.fn();

    const { toJSON, getByTestId } = render(
      renderManagePalletKebabButton(false, mockDispatch)
    );
    const palletMenu = getByTestId('pallet_menu');
    fireEvent.press(palletMenu);

    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });
});
