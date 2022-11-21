import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  PickingNavigatorStack,
  kebabMenuButton,
  renderScanButton
} from './PickingNavigator';
import { Tabs } from '../models/Picking.d';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

jest.mock('../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

jest.mock('../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

describe('Picking Navigator', () => {
  it('Renders the Picking Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PickingNavigatorStack
        dispatch={jest.fn()}
        isManualScanEnabled={false}
        selectedTab={Tabs.PICK}
        pickingMenu={false}
        multiBin={false}
        multiPick={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the Picking Navigator with kebab menu', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PickingNavigatorStack
        dispatch={jest.fn()}
        isManualScanEnabled={false}
        selectedTab={Tabs.PICK}
        pickingMenu={false}
        multiBin={true}
        multiPick={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders and Calls the Manual Scan Button', () => {
    const mockDispatch = jest.fn();

    const { toJSON, getByTestId } = render(
      renderScanButton(mockDispatch, false)
    );
    const scanButton = getByTestId('manual-scan');
    fireEvent.press(scanButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders and Calls the Kebab Menu button', () => {
    const mockDispatch = jest.fn();

    const { toJSON, getByTestId } = render(
      kebabMenuButton(false, mockDispatch)
    );
    const pickMenu = getByTestId('picking-menu');
    fireEvent.press(pickMenu);

    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });
});
